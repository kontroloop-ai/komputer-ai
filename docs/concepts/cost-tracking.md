---
title: Cost Tracking
description: Per-agent and aggregate Anthropic API usage tracking via CR status fields.
---

Every agent tracks its Anthropic API usage in the CR status:

- **`lastTaskCostUSD`** — Cost of the most recent task
- **`totalCostUSD`** — Cumulative cost of all tasks run by this agent

These fields are updated by the API worker when a `task_completed` event arrives. You can see costs via `kubectl get komputeragents` (the Cost column), the CLI (`komputer get <name>`), or the API response fields.

Offices and schedules also aggregate costs across all their agents.
