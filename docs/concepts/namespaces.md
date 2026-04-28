---
title: Namespaces
description: Namespace-aware isolation for agents, templates, secrets, and config.
---

komputer.ai is fully namespace-aware. Namespaces provide isolation boundaries for agents and their resources:

- **Agents** are namespace-scoped — two teams can each have an agent named `researcher` without conflict.
- **Templates** can be namespace-scoped (per-team overrides) or cluster-scoped (shared defaults).
- **Config** is cluster-scoped — one Redis and API configuration for the whole platform.
- **Secrets** live in the same namespace as their agent.

When creating an agent, the namespace is auto-created if it doesn't exist. The default template and required secrets are copied into the new namespace automatically.

> ⚠️ **Anthropic API key required in every agent namespace.** If you create namespaces manually or deploy agents directly via `kubectl apply`, ensure the `anthropic-api-key` secret (or whatever secret your template references for `ANTHROPIC_API_KEY`) exists in that namespace. Agents will fail to start without it.
> ```bash
> kubectl create secret generic anthropic-api-key \
>   --from-literal=api-key=sk-ant-... \
>   -n <your-namespace>
> ```

All API endpoints and CLI commands support namespace selection. If no namespace is specified, the server's default namespace is used.
