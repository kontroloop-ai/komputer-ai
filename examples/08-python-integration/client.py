"""
komputer.ai Python integration example.

Creates an agent and streams its events in real time using the official SDK.
Requires: pip install komputer-ai-sdk
"""

from komputer_ai.client import KomputerClient

API_URL = "http://localhost:8080"


def run_agent(name: str, instructions: str) -> dict:
    with KomputerClient(API_URL) as client:
        client.create_agent(name=name, instructions=instructions, model="claude-sonnet-4-6")
        print(f"Agent created: {name}")

        for event in client.watch_agent(name):
            if event.type == "task_started":
                print(f"\n[started] {event.payload.get('instructions', '')[:80]}...")
            elif event.type == "thinking":
                print(f"[thinking] {event.payload.get('content', '')[:60]}...")
            elif event.type == "tool_call":
                print(f"[tool] {event.payload.get('tool')}: {str(event.payload.get('input', ''))[:60]}")
            elif event.type == "text":
                print(f"\n{event.payload.get('content', '')}")
            elif event.type == "task_completed":
                p = event.payload
                print(f"\n[done] cost=${p.get('cost_usd', 0):.4f}  "
                      f"duration={p.get('duration_ms', 0) / 1000:.1f}s  "
                      f"turns={p.get('turns', 0)}")
                return p
            elif event.type == "error":
                print(f"[error] {event.payload.get('error')}")
                break

    return {}


if __name__ == "__main__":
    run_agent(
        name="py-agent",
        instructions="List the files in /workspace and tell me how many there are.",
    )
