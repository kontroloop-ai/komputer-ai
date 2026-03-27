# Custom Agent Images

The default agent image (`komputer-agent`) ships with Python 3.12, Node.js 22, git, curl, jq, and the Claude Code CLI. Agents can install additional packages at runtime using `sudo apt-get`, `pip`, or `npm` — and those installs persist across tasks thanks to the workspace PVC.

However, runtime installs happen every time a new pod starts. If you need specific packages, tools, or system-level dependencies baked into the image, you should build a custom agent image.

## Extending the base image (recommended)

Build your own image using the official komputer-agent as the base:

```dockerfile
FROM ghcr.io/kontroloop-ai/komputer-agent:latest

# Switch to root to install system packages
USER root

# Install system-level tools
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
      postgresql-client \
      awscli \
      ffmpeg && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Python packages globally (available to all agents)
RUN pip install --no-cache-dir pandas numpy boto3

# Switch back to non-root user (required for Claude CLI)
USER komputer
```

Build and use it:

```bash
docker build -t my-custom-agent:latest .
```

Then reference it in your template:

```yaml
apiVersion: komputer.komputer.ai/v1alpha1
kind: KomputerAgentClusterTemplate
metadata:
  name: custom
spec:
  podSpec:
    containers:
      - name: agent
        image: my-custom-agent:latest
        env:
          - name: ANTHROPIC_API_KEY
            valueFrom:
              secretKeyRef:
                name: anthropic-api-key
                key: api-key
  storage:
    size: "10Gi"
```

Agents can reference this template with `templateRef: "custom"`.

## What the base image includes

| Layer | Contents |
|-------|----------|
| OS | Debian (python:3.12-slim) |
| System tools | git, curl, jq, unzip, sudo |
| Node.js | 22.x + Claude Code CLI (`@anthropic-ai/claude-code`) |
| Python | 3.12 + agent runtime (FastAPI, Claude Agent SDK, Redis client) |
| User | `komputer` (non-root, passwordless sudo) |
| Entrypoint | `python /app/main.py` |

Runtime package installs by agents persist to the workspace PVC:
- `pip install` goes to `/workspace/.local`
- `npm install -g` goes to `/workspace/.npm-global`
- Both are on `PATH` automatically

## Important constraints

When building a custom image, keep these requirements in mind:

- **Non-root user** — The Claude CLI requires a non-root user with `--dangerously-skip-permissions`. The base image creates a `komputer` user for this. If you change the user, make sure it's non-root with sudo access.
- **Claude Code CLI** — Must be installed globally via npm (`@anthropic-ai/claude-code`). Without it, the agent cannot run.
- **Entrypoint** — Must be `python /app/main.py`. The agent runtime (FastAPI server, event publisher, Claude SDK integration) lives in `/app/`. Do not override the entrypoint unless you know what you're doing.
- **Workspace at `/workspace`** — The operator mounts the persistent volume here. Agents work in this directory.

## Using a completely different base image

If you need a different Linux distribution (e.g., Ubuntu, Alpine, RHEL), you can use the [agent Dockerfile](../komputer-agent/Dockerfile) as a reference and rebuild from scratch. This is unsupported and at your own risk — you're responsible for ensuring all dependencies are present and the agent runtime works correctly.

The key things your custom Dockerfile must provide:

1. Python 3.12+ with the packages from `requirements.txt`
2. Node.js 22+ with `@anthropic-ai/claude-code` installed globally
3. A non-root user with passwordless sudo
4. The agent code copied to `/app/`
5. Entrypoint set to `python /app/main.py`
6. `/workspace` directory owned by the non-root user
