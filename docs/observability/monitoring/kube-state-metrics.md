---
title: kube-state-metrics
description: Free metrics you already get from kube-prometheus-stack — no need to duplicate.
---

If you're running `kube-prometheus-stack`, you already have:

- `kube_pod_status_phase{namespace,pod}` — pod lifecycle (filter by `pod=~"<agent>-pod"`)
- `container_cpu_usage_seconds_total{pod=~"...pod$"}` — per-agent CPU
- `container_memory_working_set_bytes{pod=~"...pod$"}` — per-agent memory
- `kube_persistentvolumeclaim_resource_requests_storage_bytes{namespace}` — workspace storage

We don't duplicate these in komputer-ai's metrics. Use them for resource-utilization views in your dashboards.
