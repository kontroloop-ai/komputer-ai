# 01 — Hello World

The simplest possible KomputerAgent. Create an agent, watch it run, delete it.

## What it does

Starts a Claude agent that writes a haiku about Kubernetes and prints it to the terminal.

## Run it

```bash
# Apply the agent
kubectl apply -f agent.yaml

# Watch it work
komputer watch hello-world

# Clean up
kubectl delete -f agent.yaml
```

Or with the CLI in one shot:

```bash
komputer run hello-world "Write a haiku about Kubernetes and print it to the terminal."
```

## What to observe

- The agent pod starts within a few seconds
- You see `task_started → thinking → text → task_completed` events in the stream
- Cost and duration are printed at the end

## Key concepts

- `KomputerAgent` is the only resource needed for a basic agent
- `instructions` is the task prompt — Claude reads this when the pod starts
- No `lifecycle` set means the pod stays running after completion (default behavior)
- Delete the CR to clean up the pod, PVC, and ConfigMap
