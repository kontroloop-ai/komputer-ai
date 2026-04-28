---
title: Squads overview
description: A named group of agents that share a single Kubernetes Pod, giving every member direct read/write access to each other's workspaces.
---

A squad is a named group of agents that share a single Kubernetes Pod, giving every member direct read/write access to each other's workspaces via the filesystem. The operator provisions one Pod per squad with all member containers and their PVCs mounted inside it — no coordination protocol, just shared files.

## When to use

Use a squad when agents need to exchange files directly:

- **Pair programming** — one agent writes code, another reviews or runs tests against the same files.
- **Pipeline workers** — an agent generates output files that the next agent in the chain reads.
- **Reviewer + coder** — one agent authors a diff, another applies feedback in place.

Do not use a squad when agents work on separate branches or unrelated tasks — solo agents are simpler and don't share resource lifecycle.

## Workspace layout

Inside the squad Pod each agent sees:

| Path | Contents |
|---|---|
| `/workspace` | The agent's own persistent workspace (its PVC) |
| `/agents/<sibling-name>/workspace` | Each sibling agent's workspace (read/write) |

All paths are read-write. There is no enforced isolation between members — any agent can write to a sibling's workspace.
