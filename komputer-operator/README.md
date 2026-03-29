# komputer-operator

Kubernetes operator built with [operator-sdk](https://sdk.operatorframework.io/) that manages the lifecycle of Claude AI agents. It watches `KomputerAgent` custom resources and creates the necessary pods, persistent volumes, and configuration for each agent.

## CRDs

### KomputerConfig

Cluster-scoped singleton holding platform configuration — Redis connection and internal API URL. The operator auto-discovers this resource.

```yaml
apiVersion: komputer.komputer.ai/v1alpha1
kind: KomputerConfig
metadata:
  name: default
spec:
  redis:
    address: "redis.default:6379"
    db: 0
    streamPrefix: "komputer-events"
    passwordSecret:
      name: "redis-secret"
      key: "password"
  apiURL: "http://komputer-api.default.svc.cluster.local:8080"
```

The `apiURL` is used by manager agents to create and manage sub-agents via the komputer-api.

### KomputerAgentClusterTemplate

Cluster-scoped reusable pod configuration with full `corev1.PodSpec` passthrough. Shared across all namespaces.

```yaml
apiVersion: komputer.komputer.ai/v1alpha1
kind: KomputerAgentClusterTemplate
metadata:
  name: default
spec:
  podSpec:
    containers:
      - name: agent
        image: komputer-agent:latest
        env:
          - name: ANTHROPIC_API_KEY
            valueFrom:
              secretKeyRef:
                name: anthropic-api-key
                key: api-key
        resources:
          requests:
            cpu: "500m"
            memory: "512Mi"
          limits:
            cpu: "2"
            memory: "2Gi"
  storage:
    size: "5Gi"
```

### KomputerAgentTemplate

Namespace-scoped version of the template. If a `KomputerAgentTemplate` exists in the agent's namespace with the same name as a `KomputerAgentClusterTemplate`, the namespaced template takes precedence.

### KomputerAgent

An agent instance. The operator creates a pod and PVC when this resource is created.

```yaml
apiVersion: komputer.komputer.ai/v1alpha1
kind: KomputerAgent
metadata:
  name: my-agent
spec:
  templateRef: "default"          # optional, defaults to "default"
  instructions: "Research AI news"
  model: "claude-sonnet-4-6"     # optional, has default
  role: "manager"                 # "manager" or "worker"
  lifecycle: "Sleep"              # "", "Sleep", or "AutoDelete"
  secrets:                        # optional list of K8s Secret names
    - my-agent-secrets
```

- `role`: `manager` agents get orchestration tools (MCP) to create and manage sub-agents, while `worker` agents only have bash and web search tools.
- `lifecycle`: Controls what happens after task completion. Default (`""`) keeps the pod running. `Sleep` deletes the pod but keeps the PVC — the agent wakes up on the next task. `AutoDelete` deletes the entire agent.
- `secrets`: List of K8s Secret names. Each key in each secret is injected as an env var into the agent pod. The operator deduplicates env vars — agent secrets override template env vars with the same name.

**Status fields:**

```
kubectl get komputeragents
NAME       PHASE      TASK         COST     MODEL              AGE
my-agent   Running    InProgress   0.0842   claude-sonnet-4-6  5m
sleepy     Sleeping   Complete     0.0231   claude-sonnet-4-6  1h
```

- `phase` — Pod lifecycle: Pending, Running, Sleeping, Succeeded, Failed
- `taskStatus` — Agent activity: Complete, InProgress, Error (managed by the API worker)
- `lastTaskCostUSD` — Cost of the most recent task
- `totalCostUSD` — Cumulative cost of all tasks (shown as Cost column)
- `podName`, `pvcName` — Names of created resources
- `startTime`, `completionTime` — Timestamps
- `lastTaskMessage` — Latest event summary
- `sessionId` — Claude session ID for conversation continuity

### KomputerOffice

Tracks a group of agents working under a manager. Created automatically when a manager agent creates sub-agents.

```
kubectl get komputeroffices
NAME         PHASE        MANAGER      AGENTS   ACTIVE   COST     AGE
research     InProgress   researcher   4        2        0.3210   10m
```

- `phase` — InProgress, Complete, Error
- `members` — Per-agent status (name, role, task status, cost)
- `totalCostUSD` — Aggregate cost across all members

### KomputerSchedule

Runs agent tasks on a cron schedule.

```yaml
apiVersion: komputer.komputer.ai/v1alpha1
kind: KomputerSchedule
metadata:
  name: nightly-report
spec:
  schedule: "0 2 * * *"           # 2:00 AM daily
  timezone: "America/New_York"
  instructions: "Generate the daily performance report"
  agent:
    model: "claude-sonnet-4-6"
    lifecycle: "Sleep"             # default for schedules
    role: "worker"
```

```
kubectl get komputerschedules
NAME             SCHEDULE      PHASE    AGENT            RUNS   COST     NEXT                   AGE
nightly-report   0 2 * * *     Active   nightly-report   7      0.5600   2026-03-30T06:00:00Z   7d
```

- `suspended` — Pause without deleting
- `autoDelete` — Delete the schedule after first successful run
- `keepAgents` — When auto-deleting, keep the created agents alive
- Tracks run count, success/fail counts, per-run and total cost

## Reconciliation Logic

When a `KomputerAgent` CR is created:

1. Resolves the `templateRef` to get the pod spec (checks namespaced template first, then cluster template)
2. Auto-discovers the singleton `KomputerConfig`
3. Creates a PVC (`{name}-pvc`) for the agent's persistent workspace
4. Creates a ConfigMap (`{name}-pod-config`) with Redis config at `/etc/komputer/config.json`
5. Creates a Pod from the template, injecting:
   - `KOMPUTER_INSTRUCTIONS`, `KOMPUTER_MODEL`, `KOMPUTER_AGENT_NAME`, `KOMPUTER_NAMESPACE` env vars
   - For managers: `KOMPUTER_ROLE`, `KOMPUTER_API_URL`
   - Env vars from `spec.secrets` (each key in each referenced K8s Secret)
   - Workspace PVC at `/workspace`
   - Config at `/etc/komputer`
6. Manages pod lifecycle based on `spec.lifecycle`:
   - Default: keeps the pod alive, recreates on termination
   - Sleep: deletes the pod after task completion, preserves PVC
   - AutoDelete: deletes the entire agent after task completion
7. Updates CR status based on pod state

## Development

### Prerequisites

- Go 1.22+
- operator-sdk v1.42+
- A Kubernetes cluster

### Build and test

```bash
make generate    # Regenerate deepcopy code
make manifests   # Regenerate CRD manifests
make test        # Run integration tests with envtest
go build ./...   # Build
```

### Install CRDs

```bash
make install     # Uses server-side apply (required for large PodSpec CRD)
```

### Run locally

```bash
make run         # Runs against current kubeconfig cluster
```

For HA deployments, enable leader election:

```bash
make run ARGS="--leader-elect"
```

### Deploy to cluster

```bash
make docker-build IMG=<registry>/komputer-operator:latest
make docker-push IMG=<registry>/komputer-operator:latest
make deploy IMG=<registry>/komputer-operator:latest
```

## Project Structure

```
komputer-operator/
├── api/v1alpha1/                    # CRD type definitions
│   ├── komputeragent_types.go
│   ├── komputeragenttemplate_types.go
│   ├── komputeragentclustertemplate_types.go
│   ├── komputerconfig_types.go
│   └── komputerredisconfig_types.go  # Legacy, kept for migration
├── internal/controller/
│   ├── komputeragent_controller.go      # Reconciliation logic
│   └── komputeragent_controller_test.go # Integration tests
├── cmd/main.go                      # Manager entrypoint
├── config/
│   ├── crd/bases/                   # Generated CRD manifests
│   ├── rbac/                        # RBAC rules
│   └── samples/                     # Example CRs
├── Makefile
└── Dockerfile
```
