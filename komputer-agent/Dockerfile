FROM python:3.12-slim

# Install system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
      curl ca-certificates git jq unzip sudo && \
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get install -y --no-install-recommends nodejs && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Claude Code CLI
RUN npm install -g @anthropic-ai/claude-code

# Install Python dependencies
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Create non-root user with passwordless sudo access.
# Non-root is required by Claude CLI for --dangerously-skip-permissions.
# Sudo allows agents to install packages at runtime (apt-get, pip, npm).
RUN useradd -m -s /bin/bash komputer && \
    echo "komputer ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers && \
    mkdir -p /workspace && chown komputer:komputer /workspace
USER komputer

WORKDIR /workspace

ENV PYTHONUNBUFFERED=1
ENTRYPOINT ["python", "/app/main.py"]
