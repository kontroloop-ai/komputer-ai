---
title: Limitations & caveats
description: Known constraints — one squad per agent, ephemeral container limits, finalizers.
---

- **One squad per agent.** An agent can belong to at most one squad at a time. This is enforced by an admission webhook — creating or patching a squad with an agent that is already in another squad is rejected.
- **Ephemeral container volume limitation.** When an agent is injected into a running Pod as an ephemeral container, Kubernetes does not allow adding new volumes to a running Pod. As a result the newly-added agent cannot mount its own PVC at `/workspace`. It *can* see all original members' workspaces at `/agents/<sibling>/workspace`. The agent's own `/workspace` becomes available after the next Pod restart (e.g. when another membership change triggers a recreate).
- **No resource requests for late-added members.** Ephemeral containers cannot declare resource requests/limits. Resources are only allocated on the next Pod restart when the agent becomes a regular container.
- **Pod name is the squad name.** `kubectl get pod` shows the squad Pod as `<squad-name>-pod`, not the individual agent names. Use `kubectl get pod <squad>-pod` to inspect it.
- **Cleanup finalizer.** Each squad carries a `komputer.ai/squad-cleanup` finalizer. Kubernetes blocks the actual deletion of a squad until the operator clears `Status.Squad` on every member — preventing orphaned members if the operator was down at delete time.
