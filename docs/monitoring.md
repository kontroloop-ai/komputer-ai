# Monitoring

komputer-ai exposes Prometheus metrics from every component, plus a sample Grafana dashboard.

## Components and endpoints

| Component | Endpoint | Always served? | What's exposed |
|---|---|---|---|
| API | `:8080/api/metrics` | yes | HTTP request rate/latency, WebSocket connections, Redis stream throughput |
| API | `:8080/agent/metrics` | yes | Per-task cost, tokens, duration; tool invocations and durations; agent action counts; agents-by-phase, tasks-in-progress, schedules-active gauges (queried from K8s at scrape time) |
| Operator | `:8080/metrics` | only when bind address set (Helm value `metrics.operator.bindAddress`, default `:8080`) | Built-in controller-runtime metrics + `komputer_operator_template_cap_reached_total` |
| Agent | `:8000/metrics` | yes (FastAPI server) | Steering events, MCP connector status, subagent wait time |

## Enabling Prometheus scraping

The Helm chart includes ServiceMonitor templates compatible with [kube-prometheus-stack](https://github.com/prometheus-community/helm-charts/tree/main/charts/kube-prometheus-stack). Enable each independently:

```yaml
metrics:
  api:
    serviceMonitor:
      enabled: true
      interval: 30s
  agentMetrics:
    serviceMonitor:
      enabled: true     # /agent/metrics endpoint (separate from /api/metrics)
      interval: 30s
  operator:
    serviceMonitor:
      enabled: true
      interval: 30s
```

Why two ServiceMonitors for the API? `/api/metrics` carries operational metrics (latency, errors). `/agent/metrics` carries business metrics (cost, tokens). You may want different retention or scrape intervals — splitting them keeps that flexible.

There is no ServiceMonitor for agents by default. Agent pods come and go (sleep cycles), so traditional pull-based scraping misses ephemeral activity. Instead, enable remote-write (below).

## Per-agent labels — cardinality trade-off

By default, the `agent_name` label is **present but empty** on per-agent metrics. This keeps dashboards schema-stable — queries like `sum by (agent_name) (...)` work whether or not the feature is enabled, they just resolve to a single bucket when off.

To get real per-agent breakdown:

```yaml
metrics:
  perAgentLabels: true
```

**Cost:** every per-agent metric series multiplies by the number of agents you create. For 100 active agents, the `komputer_agent_tasks_total` series count goes from ~12 (3 outcomes × 4 models) to ~1200. Prometheus handles this fine until you hit hundreds of thousands of series.

**Recommendation:** keep this off for production, enable in pre-prod or for one-off debugging.

## Agent remote-write

Three metrics live only in the agent process — they describe activity that doesn't appear in the Redis event stream:

- `komputer_agent_steering_total` — count of follow-up messages mid-task
- `komputer_agent_mcp_connector_status` — health of each MCP connector (Slack, GitHub, etc.)
- `komputer_agent_subagent_wait_seconds` — wall-clock time spent in `wait_for_agents.py`

When agents sleep (the common case), their `/metrics` endpoint disappears before Prometheus's next scrape. To capture these reliably, configure the agent to push them via Prometheus remote-write:

```yaml
metrics:
  agent:
    remoteWrite:
      enabled: true
      url: http://prometheus.monitoring.svc.cluster.local:9090/api/v1/write
      # Optional bearer token (from a K8s Secret with key 'KOMPUTER_METRICS_REMOTE_WRITE_TOKEN'):
      bearerTokenSecret: prometheus-remote-write-token
```

The agent flushes every 15 seconds. Failures are logged but never crash the agent.

Your remote-write target must have receiver enabled. For Prometheus: `--web.enable-remote-write-receiver`. For Mimir/Cortex/Thanos: native support.

> **Note:** the env vars `KOMPUTER_METRICS_REMOTE_WRITE_URL` and `KOMPUTER_METRICS_PER_AGENT` are not yet automatically injected from Helm values into agent pods. To enable today, set them on `KomputerAgentClusterTemplate.spec.podSpec.containers[0].env` directly.

## Free metrics from kube-state-metrics

If you're running `kube-prometheus-stack`, you already have:

- `kube_pod_status_phase{namespace,pod}` — pod lifecycle (filter by `pod=~"<agent>-pod"`)
- `container_cpu_usage_seconds_total{pod=~"...pod$"}` — per-agent CPU
- `container_memory_working_set_bytes{pod=~"...pod$"}` — per-agent memory
- `kube_persistentvolumeclaim_resource_requests_storage_bytes{namespace}` — workspace storage

We don't duplicate these in komputer-ai's metrics. Use them for resource-utilization views in your dashboards.

## Sample dashboard

Bundled in `helm/komputer-ai/dashboards/komputer-overview.json`. Loaded automatically into Grafana when you install the chart with any ServiceMonitor enabled (the dashboard ConfigMap has `grafana_dashboard: "1"` for sidecar pickup).

## Local development

For testing without a cluster:

```bash
cd monitoring && docker compose up -d
# Prometheus: http://localhost:9090
# Grafana: http://localhost:3000
```

See `monitoring/README.md` for full instructions including how to test agent remote-write locally.

## Metric reference

### API plumbing (`/api/metrics`)

- `komputer_api_http_requests_total{method,path,status}` (counter)
- `komputer_api_http_request_duration_seconds{method,path}` (histogram)
- `komputer_api_ws_connections_active{mode}` (gauge — `mode=broadcast|group`)
- `komputer_api_ws_dispatch_total{mode,result}` (counter — `result=delivered|claimed_by_other|write_failed`)
- `komputer_api_redis_xread_messages_total` (counter)
- `komputer_api_build_info{version,commit}` (gauge — always 1)

### Agent business (`/agent/metrics`)

- `komputer_agent_tasks_total{namespace,model,outcome,agent_name}` (counter — `outcome=started|completed|cancelled|errored`)
- `komputer_agent_task_duration_seconds{namespace,model,agent_name}` (histogram)
- `komputer_agent_task_cost_usd_total{namespace,model,agent_name}` (counter)
- `komputer_agent_task_tokens_total{namespace,model,kind,agent_name}` (counter — `kind=input|output|cache_read|cache_creation`)
- `komputer_agent_tool_invocations_total{namespace,tool,outcome,agent_name}` (counter)
- `komputer_agent_tool_duration_seconds{namespace,tool,agent_name}` (histogram)
- `komputer_agent_actions_total{action,result}` (counter — `action=create|delete|cancel|sleep|wake|patch`)
- `komputer_tasks_inprogress{namespace,model,agent_name}` (gauge — listed from K8s at scrape time)
- `komputer_schedules_active{namespace}` (gauge — listed from K8s at scrape time)
- `komputer_agents_active{namespace,phase}` (gauge — listed from K8s at scrape time)
- `komputer_agent_build_info{version,commit}` (gauge — always 1)

### Operator (`/metrics`)

- `controller_runtime_reconcile_total{controller,result}` (counter)
- `controller_runtime_reconcile_time_seconds{controller}` (histogram)
- `controller_runtime_active_workers{controller}` (gauge)
- `komputer_operator_template_cap_reached_total{namespace,template}` (counter)

### Agent push (`/metrics` on agent pod, plus remote-write)

- `komputer_agent_steering_total{agent_name}` (counter)
- `komputer_agent_mcp_connector_status{agent_name,connector,status}` (gauge — 1 healthy, 0 unhealthy)
- `komputer_agent_subagent_wait_seconds{agent_name}` (histogram)
