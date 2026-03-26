FROM python:3.12-slim

# Install Node.js (required for Claude Code CLI)
RUN apt-get update && \
    apt-get install -y --no-install-recommends curl ca-certificates && \
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

# Run as non-root user (required by Claude CLI for --dangerously-skip-permissions)
RUN useradd -m -s /bin/bash komputer && mkdir -p /workspace && chown komputer:komputer /workspace
USER komputer

WORKDIR /workspace

ENV PYTHONUNBUFFERED=1
ENTRYPOINT ["python", "/app/main.py"]
