---
title: Monitoring overview
description: Prometheus metrics endpoints for every component, plus a sample Grafana dashboard.
---

komputer-ai exposes Prometheus metrics from every component, plus a sample Grafana dashboard.

## Components and endpoints

| Component | Endpoint | What's exposed |
|---|---|---|
| API | `:8080/api/metrics` | HTTP request rate/latency, WebSocket connections, Redis stream throughput |
| API | `:8080/agent/metrics` | Per-task cost, tokens, duration; tool invocations and durations; agent action counts; agents-by-phase, tasks-in-progress, schedules-active gauges (queried from K8s at scrape time) |
| Operator | `:8082/metrics` | Built-in controller-runtime metrics + `komputer_operator_template_cap_reached_total` |
| Agent | `:8000/metrics` | Steering events, MCP connector status, subagent wait time |

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

There is no ServiceMonitor for agents by default. Agent pods come and go (sleep cycles), so traditional pull-based scraping misses ephemeral activity. Instead, enable [remote-write](./remote-write).
