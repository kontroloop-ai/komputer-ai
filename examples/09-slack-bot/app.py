"""
Slack slash command → komputer.ai agent → stream response back to Slack.

Setup:
  1. Create a Slack app with a slash command (e.g. /agent) pointing at this server.
  2. Set SLACK_BOT_TOKEN and SLACK_SIGNING_SECRET env vars.
  3. pip install flask slack-sdk httpx websockets
  4. Run: python app.py

Usage in Slack:
  /agent Write a poem about distributed systems
"""

import asyncio
import hashlib
import hmac
import json
import os
import threading
import time

import httpx
import websockets
from flask import Flask, Response, abort, request
from slack_sdk import WebClient

app = Flask(__name__)

SLACK_BOT_TOKEN     = os.environ["SLACK_BOT_TOKEN"]
SLACK_SIGNING_SECRET = os.environ["SLACK_SIGNING_SECRET"]
KOMPUTER_API        = os.environ.get("KOMPUTER_API", "http://komputer-api:8080")

slack = WebClient(token=SLACK_BOT_TOKEN)


def verify_slack_signature(req: request) -> bool:
    ts = req.headers.get("X-Slack-Request-Timestamp", "")
    if abs(time.time() - int(ts)) > 60 * 5:
        return False
    body = req.get_data(as_text=True)
    sig_base = f"v0:{ts}:{body}"
    expected = "v0=" + hmac.new(
        SLACK_SIGNING_SECRET.encode(), sig_base.encode(), hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(expected, req.headers.get("X-Slack-Signature", ""))


async def run_agent_and_reply(agent_name: str, instructions: str, channel: str):
    api_url = KOMPUTER_API
    ws_url  = KOMPUTER_API.replace("http", "ws")

    async with httpx.AsyncClient() as http:
        resp = await http.post(f"{api_url}/api/v1/agents", json={
            "name": agent_name,
            "instructions": instructions,
            "lifecycle": "AutoDelete",
        })
        if resp.status_code not in (200, 201):
            slack.chat_postMessage(channel=channel, text=f"Failed to create agent: {resp.text}")
            return

    text_chunks = []
    uri = f"{ws_url}/api/v1/agents/{agent_name}/ws"

    async with websockets.connect(uri) as ws:
        async for raw in ws:
            event = json.loads(raw)
            etype = event.get("type")
            payload = event.get("payload", {})

            if etype == "text":
                text_chunks.append(payload.get("content", ""))
            elif etype in ("task_completed", "error"):
                break

    reply = "\n".join(text_chunks) or "Task completed with no text output."
    slack.chat_postMessage(channel=channel, text=reply)


@app.route("/slack/command", methods=["POST"])
def slash_command():
    if not verify_slack_signature(request):
        abort(403)

    instructions = request.form.get("text", "").strip()
    channel      = request.form.get("channel_id")
    user         = request.form.get("user_name", "user").replace(".", "-")

    if not instructions:
        return Response("Usage: /agent <your task>", content_type="text/plain")

    agent_name = f"slack-{user}-{int(time.time())}"

    def run():
        asyncio.run(run_agent_and_reply(agent_name, instructions, channel))

    threading.Thread(target=run, daemon=True).start()

    return Response(f"Running: _{instructions}_\nI'll post results here when done.",
                    content_type="text/plain")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3001)
