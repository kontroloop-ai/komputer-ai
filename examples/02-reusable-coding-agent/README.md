# 02 — Reusable Coding Agent

A persistent agent that keeps its workspace between tasks. Send it follow-up work without losing state.

## What it does

Creates a coding agent with a persistent workspace (PVC). You can send it multiple tasks over time — each task picks up where the last one left off. The workspace at `/workspace` is preserved across task runs.

## Run it

```bash
# Create the agent and send the first task
kubectl apply -f agent.yaml

# Watch the first task
komputer watch dev-agent

# Send a follow-up task to the same agent (pod stays running)
curl -X POST http://localhost:8080/api/v1/agents \
  -H "Content-Type: application/json" \
  -d '{"name": "dev-agent", "instructions": "Run the test suite in /workspace/my-app and fix any failures."}'

# Or with the CLI
komputer create dev-agent "Run the test suite in /workspace/my-app and fix any failures."

# Watch the second task
komputer watch dev-agent
```

## Using the chat command for iterative work

The `chat` command is ideal for iterative coding sessions:

```bash
komputer chat dev-agent
```

```
> What files are in /workspace/my-app?
> Add error handling to the main function
> Write tests for the changes you just made
```

Each message is a new task on the same agent. The agent remembers its workspace and conversation context.

## Key concepts

- **No `lifecycle` field** — the pod stays running between tasks, ready for the next one
- **Workspace persistence** — `/workspace` is a PVC that survives pod restarts and task completions
- **Session continuity** — Claude remembers the conversation history across tasks on the same agent
- **409 Conflict** — sending a task while the agent is busy returns a conflict error; wait for completion first
