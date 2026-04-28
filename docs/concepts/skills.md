---
title: Skills
description: Reusable named skills written to the agent's filesystem as Claude SDK skill files.
---

A **KomputerSkill** is a reusable, named skill written to the agent's filesystem as a Claude SDK skill file. Attached skills become available to the agent as slash commands it can invoke during task execution.

## When to use it

- **Repeatable workflows** — Step-by-step instructions the agent follows consistently (code review checklist, incident response steps)
- **Tool usage patterns** — How to use a particular API or CLI tool in your environment
- **Specializations** — Give a general-purpose agent deep expertise in a specific domain without changing its base instructions

## How it works

1. Create a `KomputerSkill` CR with a `description` (when to use it) and `content` (markdown instructions)
2. Reference it by name in `spec.skills` on a `KomputerAgent`
3. The operator writes each skill as a `.md` file to the agent's skill directory on startup
4. The Claude SDK discovers the skill files and makes them available as slash commands
5. The `.status.attachedAgents` field tracks how many agents reference each skill

## Example

```yaml
apiVersion: komputer.komputer.ai/v1alpha1
kind: KomputerSkill
metadata:
  name: git-commit
  namespace: platform
spec:
  description: "Create well-formatted git commits following team conventions"
  content: |
    When creating a git commit:
    1. Run `git diff --staged` to review what's staged
    2. Write a subject line: `<type>: <short description>` (50 chars max)
    3. Types: feat, fix, docs, refactor, test, chore
    4. Add a body paragraph if the change needs explanation
    5. Never use --no-verify
```

Attach to an agent:
```yaml
spec:
  skills:
    - git-commit
```

Agents can also create and attach skills dynamically at runtime using the `create_skill` and `attach_skill` manager tools.
