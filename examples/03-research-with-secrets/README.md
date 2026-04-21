# 03 — Research with Secrets

Pass API credentials to an agent using Kubernetes Secrets. The agent receives them as `SECRET_*` environment variables.

## What it does

Creates a GitHub API token as a Kubernetes Secret, then creates an agent that uses it to fetch and summarize the latest Kubernetes releases. The agent deletes itself after completing the task (`lifecycle: AutoDelete`).

## Setup

```bash
# 1. Create the secret with your real GitHub token
kubectl create secret generic github-credentials \
  --from-literal=GITHUB=ghp_your_token_here

# OR apply the example (edit the token first)
# kubectl apply -f secret.yaml

# 2. Apply the agent
kubectl apply -f agent.yaml

# 3. Stream the output
komputer watch github-researcher
```

## How secrets work

Each key in the Kubernetes Secret is injected as an environment variable prefixed with `SECRET_`:

| Secret key | Env var in agent |
|------------|-----------------|
| `GITHUB`   | `SECRET_GITHUB` |
| `AWS_KEY`  | `SECRET_AWS_KEY` |
| `DB_PASS`  | `SECRET_DB_PASS` |

Claude is instructed to check these env vars when it needs credentials.

## Using the CLI

```bash
komputer run github-researcher \
  "Fetch the latest Kubernetes releases using the GitHub API token in SECRET_GITHUB." \
  --secret GITHUB=ghp_your_token_here \
  --lifecycle AutoDelete
```

The `--secret KEY=VALUE` flag creates a K8s Secret automatically and attaches it to the agent.

## Key concepts

- **`secrets`** — list of K8s Secret names to mount; each key becomes `SECRET_<KEY>` in the pod
- **`lifecycle: AutoDelete`** — agent deletes itself after the task, ideal for one-shot jobs
- Secrets are cleaned up when the agent is deleted
- Never put credentials in `instructions` — use Secrets instead
