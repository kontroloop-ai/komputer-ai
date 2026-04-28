---
title: Sample dashboard
description: Bundled Grafana dashboard auto-loaded when ServiceMonitor is enabled.
---

Bundled in `helm/komputer-ai/dashboards/komputer-overview.json`. Loaded automatically into Grafana when you install the chart with any ServiceMonitor enabled (the dashboard ConfigMap has `grafana_dashboard: "1"` for sidecar pickup).
