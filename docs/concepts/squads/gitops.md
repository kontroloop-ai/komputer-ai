---
title: GitOps
description: Declaring squad members declaratively — prefer ref over embedded spec to avoid controller drift.
---

Members can be declared two ways in the squad CRD:

```yaml
spec:
  members:
    - ref:
        name: my-agent           # reference to an existing KomputerAgent
    - spec:                      # embedded spec — operator creates the agent
        task: "..."
```

**Prefer `ref` for GitOps.** When a member is declared with an embedded `spec`, the operator creates a `KomputerAgent` CR and rewrites the squad spec to a `ref` on first reconcile. This in-place mutation can surprise GitOps controllers (e.g. Argo CD, Flux) that detect drift. Declare agents separately and reference them by name to keep the squad spec stable.
