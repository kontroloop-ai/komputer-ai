"""Prompt templates prepended to user instructions based on agent role and environment."""

import os

MANAGER_PROMPT = (
    "Keep your final summary concise — a short paragraph is enough. "
    "Only produce a detailed report if the user explicitly asks for one."
)


def build_prompt(instructions: str) -> str:
    """Build the full prompt by prepending behavioral guidelines to user instructions."""
    parts = []

    if os.environ.get("KOMPUTER_ROLE") == "manager":
        parts.append(MANAGER_PROMPT)

    # Hint available secrets so the agent knows what credentials it has.
    secret_keys = [k for k in os.environ if k.startswith("SECRET_")]
    if secret_keys:
        parts.append(
            f"Available secrets as env vars: {', '.join(secret_keys)}. "
            "Use these when credentials are needed."
        )

    parts.append(instructions)
    return "\n\n".join(parts)
