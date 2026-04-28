---
title: Per-agent labels
description: Cardinality trade-off when enabling per-agent label breakdown on metrics.
---

By default, the `agent_name` label is **present but empty** on per-agent metrics. This keeps dashboards schema-stable — queries like `sum by (agent_name) (...)` work whether or not the feature is enabled, they just resolve to a single bucket when off.

To get real per-agent breakdown:

```yaml
metrics:
  perAgentLabels: true
```

**Cost:** every per-agent metric series multiplies by the number of agents you create. For 100 active agents, the `komputer_agent_tasks_total` series count goes from ~12 (3 outcomes × 4 models) to ~1200. Prometheus handles this fine until you hit hundreds of thousands of series.

**Recommendation:** keep this off for production, enable in pre-prod or for one-off debugging.
