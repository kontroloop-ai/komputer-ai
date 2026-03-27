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
  secrets:                        # optional list of K8s Secret names
    - my-agent-secrets
```

- `role`: `manager` agents get orchestration tools (MCP) to create and manage sub-agents, while `worker` agents only have bash and web search tools.
- `secrets`: List of K8s Secret names. Each key in each secret is injected as an env var into the agent pod. The operator deduplicates env vars — agent secrets override template env vars with the same name.

**Status fields:**

```
kubectl get komputeragents
NAME       PHASE     TASK         MODEL              AGE
my-agent   Running   InProgress   claude-sonnet-4-6  5m
```

- `phase` — Pod lifecycle: Pending, Running, Succeeded, Failed
- `taskStatus` — Agent activity: Complete, InProgress, Error (managed by the API worker)
- `podName`, `pvcName` — Names of created resources
- `startTime`, `completionTime` — Timestamps
- `lastTaskMessage` — Latest event summary
- `sessionId` — Claude session ID for conversation continuity

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
6. Keeps the pod alive — recreates on termination
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
