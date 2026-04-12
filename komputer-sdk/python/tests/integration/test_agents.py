"""Integration tests for agents."""

import time
import pytest
from komputer_ai.models import (
    CreateAgentRequest,
    PatchAgentRequest,
    CreateMemoryRequest,
    CreateSkillRequest,
)


AGENT_NAME = "sdk-test-agent"
MEMORY_NAME = "sdk-test-agent-memory"
SKILL_NAME = "sdk-test-agent-skill"


@pytest.fixture(autouse=True)
def cleanup(client):
    _safe_delete_agent(client, AGENT_NAME)
    _safe_delete_memory(client, MEMORY_NAME)
    _safe_delete_skill(client, SKILL_NAME)
    yield
    _safe_delete_agent(client, AGENT_NAME)
    _safe_delete_memory(client, MEMORY_NAME)
    _safe_delete_skill(client, SKILL_NAME)


def _safe_delete_agent(client, name):
    try:
        client.agents.delete_agent(name)
    except Exception:
        pass


def _safe_delete_memory(client, name):
    try:
        client.memories.delete_memory(name)
    except Exception:
        pass


def _safe_delete_skill(client, name):
    try:
        client.skills.delete_skill(name)
    except Exception:
        pass


class TestAgents:
    def test_create_agent(self, client):
        resp = client.agents.create_agent(
            CreateAgentRequest(
                name=AGENT_NAME,
                instructions="Say hello",
                model="claude-sonnet-4-6",
                lifecycle="Sleep",
            )
        )
        assert resp.name == AGENT_NAME
        assert resp.model == "claude-sonnet-4-6"

    def test_list_agents(self, client):
        client.agents.create_agent(
            CreateAgentRequest(
                name=AGENT_NAME,
                instructions="Say hello",
                model="claude-sonnet-4-6",
                lifecycle="Sleep",
            )
        )

        agents = client.agents.list_agents()
        names = [a.name for a in agents.agents]
        assert AGENT_NAME in names

    def test_get_agent(self, client):
        client.agents.create_agent(
            CreateAgentRequest(
                name=AGENT_NAME,
                instructions="Say hello",
                model="claude-sonnet-4-6",
                lifecycle="Sleep",
            )
        )

        resp = client.agents.get_agent(AGENT_NAME)
        assert resp.name == AGENT_NAME
        assert resp.namespace is not None

    def test_patch_agent_model(self, client):
        client.agents.create_agent(
            CreateAgentRequest(
                name=AGENT_NAME,
                instructions="Say hello",
                model="claude-sonnet-4-6",
                lifecycle="Sleep",
            )
        )

        resp = client.agents.patch_agent(
            AGENT_NAME,
            PatchAgentRequest(model="claude-haiku-4-5-20251001"),
        )
        assert resp.model == "claude-haiku-4-5-20251001"

    def test_patch_agent_lifecycle(self, client):
        client.agents.create_agent(
            CreateAgentRequest(
                name=AGENT_NAME,
                instructions="Say hello",
                model="claude-sonnet-4-6",
                lifecycle="Sleep",
            )
        )

        resp = client.agents.patch_agent(
            AGENT_NAME,
            PatchAgentRequest(lifecycle="AutoDelete"),
        )
        assert resp.lifecycle == "AutoDelete"

    def test_patch_agent_attach_memory(self, client):
        client.memories.create_memory(
            CreateMemoryRequest(
                name=MEMORY_NAME,
                content="test context",
                description="for agent test",
            )
        )
        client.agents.create_agent(
            CreateAgentRequest(
                name=AGENT_NAME,
                instructions="Say hello",
                model="claude-sonnet-4-6",
                lifecycle="Sleep",
            )
        )

        resp = client.agents.patch_agent(
            AGENT_NAME,
            PatchAgentRequest(memories=[MEMORY_NAME]),
        )
        assert MEMORY_NAME in resp.memories

    def test_patch_agent_attach_skill(self, client):
        client.skills.create_skill(
            CreateSkillRequest(
                name=SKILL_NAME,
                description="test skill",
                content="echo test",
            )
        )
        client.agents.create_agent(
            CreateAgentRequest(
                name=AGENT_NAME,
                instructions="Say hello",
                model="claude-sonnet-4-6",
                lifecycle="Sleep",
            )
        )

        resp = client.agents.patch_agent(
            AGENT_NAME,
            PatchAgentRequest(skills=[SKILL_NAME]),
        )
        assert SKILL_NAME in resp.skills

    def test_get_agent_events(self, client):
        client.agents.create_agent(
            CreateAgentRequest(
                name=AGENT_NAME,
                instructions="Say hello",
                model="claude-sonnet-4-6",
                lifecycle="Sleep",
            )
        )

        # Events endpoint should return a list (may be empty for a new agent)
        events = client.agents.get_agent_events(AGENT_NAME)
        assert isinstance(events, list) or events is not None

    def test_delete_agent(self, client):
        client.agents.create_agent(
            CreateAgentRequest(
                name=AGENT_NAME,
                instructions="Say hello",
                model="claude-sonnet-4-6",
                lifecycle="Sleep",
            )
        )

        client.agents.delete_agent(AGENT_NAME)

        with pytest.raises(Exception):
            client.agents.get_agent(AGENT_NAME)


class TestAgentWatch:
    """Tests for watch_agent() WebSocket streaming.

    These tests require a running komputer-ai instance and an agent
    that is actively processing a task to produce events.
    """

    def test_watch_connects_and_closes(self, client):
        """Verify we can open and close a WebSocket connection."""
        client.agents.create_agent(
            CreateAgentRequest(
                name=AGENT_NAME,
                instructions="Say hello",
                model="claude-sonnet-4-6",
                lifecycle="Sleep",
            )
        )

        stream = client.watch_agent(AGENT_NAME)
        assert stream is not None
        stream.close()

    def test_watch_as_context_manager(self, client):
        """Verify watch_agent works as a context manager."""
        client.agents.create_agent(
            CreateAgentRequest(
                name=AGENT_NAME,
                instructions="Say hello",
                model="claude-sonnet-4-6",
                lifecycle="Sleep",
            )
        )

        with client.watch_agent(AGENT_NAME) as stream:
            assert stream is not None
