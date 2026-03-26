import claude_agent_sdk


def run_agent(instructions: str, model: str, publisher):
    """Run a Claude agent with the given instructions."""
    publisher.publish("message", {"content": f"Starting task: {instructions[:100]}"})

    # NOTE: The claude_agent_sdk API below may need adjustment to match
    # the actual package's constructor, method names, and hook signatures.
    agent = claude_agent_sdk.Agent(
        model=model,
        tools=[
            claude_agent_sdk.tools.BashTool(),
            claude_agent_sdk.tools.WebSearchTool(),
        ],
    )

    result = agent.run(
        instructions,
        hooks={
            "on_tool_call": lambda tool_name, tool_input, tool_output: publisher.publish(
                "tool_call",
                {"tool": tool_name, "input": str(tool_input)[:500], "output": str(tool_output)[:500]},
            ),
            "on_message": lambda message: publisher.publish(
                "message", {"content": str(message)[:1000]}
            ),
        },
    )

    publisher.publish("completion", {"result": str(result)[:2000]})
    return result
