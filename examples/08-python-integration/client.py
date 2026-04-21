"""
komputer.ai Python integration example.

Creates an agent, streams its events via WebSocket, and prints a structured summary.
Requires: pip install httpx websockets
"""

import asyncio
import json
import httpx
import websockets

API_URL = "http://localhost:8080"
WS_URL  = "ws://localhost:8080"


async def run_agent(name: str, instructions: str) -> dict:
    async with httpx.AsyncClient() as http:
        resp = await http.post(f"{API_URL}/api/v1/agents", json={
            "name": name,
            "instructions": instructions,
            "model": "claude-sonnet-4-6",
        })
        resp.raise_for_status()
        print(f"Agent created: {resp.json()['name']}")

    result = {}
    uri = f"{WS_URL}/api/v1/agents/{name}/ws"

    async with websockets.connect(uri) as ws:
        async for raw in ws:
            event = json.loads(raw)
            etype = event.get("type")
            payload = event.get("payload", {})

            if etype == "task_started":
                print(f"\n[started] {payload.get('instructions', '')[:80]}...")
            elif etype == "thinking":
                print(f"[thinking] {payload.get('content', '')[:60]}...")
            elif etype == "tool_call":
                print(f"[tool] {payload.get('tool')}: {str(payload.get('input', ''))[:60]}")
            elif etype == "text":
                print(f"\n{payload.get('content', '')}")
            elif etype == "task_completed":
                result = payload
                print(f"\n[done] cost=${payload.get('cost_usd', 0):.4f}  "
                      f"duration={payload.get('duration_ms', 0)/1000:.1f}s  "
                      f"turns={payload.get('turns', 0)}")
                break
            elif etype == "error":
                print(f"[error] {payload.get('error')}")
                break

    return result


async def main():
    await run_agent(
        name="py-agent",
        instructions="List the files in /workspace and tell me how many there are.",
    )


if __name__ == "__main__":
    asyncio.run(main())
