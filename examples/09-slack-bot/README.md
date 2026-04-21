# 09 — Slack Bot

A Slack slash command that runs a komputer.ai agent and posts the result back to the channel.

## What it does

A Flask server that:
1. Receives a `/agent <instructions>` slash command from Slack
2. Returns an immediate acknowledgement (Slack requires a response in 3 seconds)
3. Creates a komputer.ai agent in the background
4. Streams the agent's events via WebSocket
5. Posts the final text response back to the Slack channel

## Install dependencies

```bash
pip install flask slack-sdk httpx websockets
```

## Setup

### 1. Create a Slack app

1. Go to [api.slack.com/apps](https://api.slack.com/apps) → Create New App
2. Add a **Slash Command**: `/agent` → `https://your-server.example.com/slack/command`
3. Add **OAuth Scope**: `chat:write`
4. Install the app to your workspace
5. Copy the **Bot User OAuth Token** and **Signing Secret**

### 2. Configure and run

```bash
export SLACK_BOT_TOKEN=xoxb-your-token
export SLACK_SIGNING_SECRET=your-signing-secret
export KOMPUTER_API=http://komputer-api:8080   # or localhost:8080 for local dev

python app.py
```

### 3. Expose locally (for development)

```bash
# Use ngrok or similar to expose localhost:3001
ngrok http 3001
# Update the slash command URL in your Slack app settings
```

## Usage

In any Slack channel where the bot is present:

```
/agent Write a Python script that generates Fibonacci numbers
/agent Explain the CAP theorem in 3 bullet points
/agent What are the best practices for Kubernetes RBAC?
```

The bot replies: *"Running: <instructions>. I'll post results here when done."*

A few seconds later (depending on task complexity), the agent's response appears in the channel.

## Key concepts

- **3-second Slack timeout** — Slack slash commands must respond in 3 seconds or they show an error. The bot returns immediately, then does the real work in a background thread.
- **`lifecycle: AutoDelete`** — each Slack request creates a fresh agent that deletes itself when done
- **Agent naming** — `slack-{user}-{timestamp}` ensures unique names per request
- **Signature verification** — always verify Slack's HMAC signature before processing commands
- The komputer.ai API URL should be your in-cluster service address in production
