import asyncio

from claude_agent_sdk import (
    AssistantMessage,
    ClaudeAgentOptions,
    HookMatcher,
    ResultMessage,
    TextBlock,
    ThinkingBlock,
    ToolUseBlock,
    query,
)


async def run_agent(instructions: str, model: str, publisher):
    """Run a Claude agent with the given instructions using the Claude Agent SDK."""
    publisher.publish("task_started", {"instructions": instructions})

    async def post_tool_hook(input, session_id, ctx):
        publisher.publish(
            "tool_result",
            {
                "tool": input.get("tool_name", ""),
                "input": input.get("tool_input", {}),
                "output": str(input.get("tool_response", ""))[:1000],
            },
        )
        return {}

    options = ClaudeAgentOptions(
        tools=["Bash", "WebSearch"],
        permission_mode="bypassPermissions",
        model=model,
        cwd="/workspace",
        hooks={
            "PostToolUse": [
                HookMatcher(matcher=None, hooks=[post_tool_hook]),
            ],
        },
    )

    result = None
    async for message in query(prompt=instructions, options=options):
        if isinstance(message, AssistantMessage):
            for block in message.content:
                if isinstance(block, TextBlock):
                    publisher.publish("text", {"content": block.text})
                elif isinstance(block, ThinkingBlock):
                    publisher.publish("thinking", {"content": block.thinking[:500]})
                elif isinstance(block, ToolUseBlock):
                    publisher.publish("tool_call", {
                        "id": block.id,
                        "tool": block.name,
                        "input": block.input,
                    })
        elif isinstance(message, ResultMessage):
            result = message

    if result:
        publisher.publish("task_completed", {
            "result": result.result or "",
            "cost_usd": result.total_cost_usd,
            "duration_ms": result.duration_ms,
            "turns": result.num_turns,
            "stop_reason": result.stop_reason,
        })

    return result


def run_agent_sync(instructions: str, model: str, publisher):
    """Synchronous wrapper for run_agent, for use in threads."""
    asyncio.run(run_agent(instructions, model, publisher))
