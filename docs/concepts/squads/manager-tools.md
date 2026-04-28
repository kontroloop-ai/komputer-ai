---
title: Manager tools
description: MCP tools manager agents can use to orchestrate squads autonomously.
---

Manager agents can orchestrate squads using these MCP tools:

- `create_squad` — create a new squad
- `add_to_squad` — add an existing (sleeping) agent to a squad
- `remove_from_squad` — remove an agent from a squad
- `delete_squad` — delete a squad
- `list_squads` — list all squads

## Configuration

The validating admission webhook enforces the **one-squad-per-agent** constraint. It is enabled by default and **strongly recommended**:

```yaml
webhooks:
  enabled: true   # default; requires cert-manager
```

**With it on** — Kubernetes rejects conflicting squad create/update with a clear error like `agent "alice" is already in squad "squad-1"`. Requires cert-manager to be installed (the chart provisions a self-signed Issuer + Certificate automatically).

**With it off** — overlapping squads are allowed at the API. Two squads can both claim the same agent, causing the squad controller to race over `Phase=Squad` and Pod ownership: the agent flips between Pods and neither squad stabilizes. Only disable if cert-manager is unavailable and you accept this risk.
