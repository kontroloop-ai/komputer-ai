---
title: Memories
description: Named, persistent knowledge resources that get injected into Claude's system prompt before every task.
---

A **KomputerMemory** is a named, persistent knowledge resource that can be shared across agents. When an agent has memories attached, their content is injected into Claude's system prompt before each task — giving the agent persistent context without repeating it in every task prompt.

## When to use it

- **Runbooks** — Standard operating procedures, escalation paths, cluster-specific notes
- **Domain knowledge** — Background information an agent always needs (API docs, schemas, team conventions)
- **Shared context** — Facts that should be consistent across multiple agents (company policies, product details)

## How it works

1. Create a `KomputerMemory` CR with a `content` field (markdown supported) and an optional `description`
2. Reference it by name in `spec.memories` on a `KomputerAgent`
3. When the agent wakes up, the API resolves all attached memory names, fetches their content, and prepends it to the agent's system prompt
4. The `.status.attachedAgents` field tracks how many agents reference each memory

## Example

```yaml
apiVersion: komputer.komputer.ai/v1alpha1
kind: KomputerMemory
metadata:
  name: deployment-policy
  namespace: platform
spec:
  description: "Production deployment rules"
  content: |
    ## Deployment Policy
    - No direct pushes to main — all changes via PR
    - Run `make test` before every deploy
    - Rolling update strategy only (never Recreate in prod)
```

Attach to an agent:
```yaml
spec:
  memories:
    - deployment-policy
```

Agents can also create and attach memories dynamically at runtime using the `create_memory` and `attach_memory` manager tools.
