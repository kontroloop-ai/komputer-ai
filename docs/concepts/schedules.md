---
title: Schedules
description: Run agent tasks on a cron schedule.
---

A **KomputerSchedule** runs agent tasks on a cron schedule. Use it for recurring work — nightly reports, periodic monitoring, scheduled analysis.

Key features:

- **Cron expression** — Standard 5-field cron (`min hour dom month dow`)
- **Timezone** — IANA timezone support (defaults to UTC)
- **Suspend/resume** — Pause schedules without deleting them
- **Auto-delete** — Optionally delete the schedule after the first successful run
- **Keep agents** — When auto-deleting, optionally keep the created agents alive
- **Agent configuration** — Specify model, role, lifecycle, template, and secrets for created agents
- **Cost tracking** — Tracks total cost and per-run cost across all scheduled runs

Schedules default to `Sleep` lifecycle for their agents, so compute is only used during the actual task execution.
