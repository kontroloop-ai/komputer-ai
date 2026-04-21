"""
Slack slash command → komputer.ai agent → stream response back to Slack.

Uses Slack Bolt for Python (handles signature verification, ack, and async out of the box)
and the komputer-ai SDK for agent creation and event streaming.

Setup:
  1. Create a Slack app with a slash command (e.g. /agent) pointing at this server.
  2. Enable Socket Mode or set the request URL to https://your-server/slack/events.
  3. Set SLACK_BOT_TOKEN and SLACK_SIGNING_SECRET env vars.
  4. pip install slack-bolt komputer-ai-sdk
  5. Run: python app.py

Usage in Slack:
  /agent Write a poem about distributed systems
"""

import os
import re
import threading

from slack_bolt import App
from slack_bolt.adapter.flask import SlackRequestHandler
from flask import Flask, request

from komputer_ai.client import KomputerClient

SLACK_BOT_TOKEN      = os.environ["SLACK_BOT_TOKEN"]
SLACK_SIGNING_SECRET = os.environ["SLACK_SIGNING_SECRET"]
KOMPUTER_API         = os.environ.get("KOMPUTER_API", "http://komputer-api:8080")

bolt = App(token=SLACK_BOT_TOKEN, signing_secret=SLACK_SIGNING_SECRET)
flask_app = Flask(__name__)
handler = SlackRequestHandler(bolt)


def agent_name_for(user: str) -> str:
    slug = re.sub(r"[^a-z0-9-]", "-", user.lower())[:20].strip("-")
    return f"slack-{slug}"


def run_agent_and_reply(agent_name: str, instructions: str, channel: str, say):
    with KomputerClient(KOMPUTER_API) as client:
        client.create_agent(
            name=agent_name,
            instructions=instructions,
            lifecycle="AutoDelete",
        )

        text_chunks = []
        for event in client.watch_agent(agent_name):
            if event.type == "text":
                text_chunks.append(event.payload.get("content", ""))
            elif event.type == "task_completed":
                break
            elif event.type == "error":
                say(channel=channel, text=f"Agent error: {event.payload.get('error')}")
                return

    reply = "\n".join(text_chunks) or "Task completed with no text output."
    say(channel=channel, text=reply)


@bolt.command("/agent")
def handle_agent_command(ack, command, say):
    ack(f"Running: _{command['text']}_\nI'll post the result here when done.")

    instructions = command["text"].strip()
    if not instructions:
        ack("Usage: /agent <your task>")
        return

    channel    = command["channel_id"]
    user       = command.get("user_name", "user")
    agent_name = agent_name_for(user)

    threading.Thread(
        target=run_agent_and_reply,
        args=(agent_name, instructions, channel, say),
        daemon=True,
    ).start()


@flask_app.route("/slack/events", methods=["POST"])
def slack_events():
    return handler.handle(request)


if __name__ == "__main__":
    flask_app.run(host="0.0.0.0", port=3001)
