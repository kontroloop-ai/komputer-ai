import pytest
import json

import manager_tools


@pytest.mark.asyncio
async def test_request_helper_uses_mock(mock_api):
    mock_api.set("GET", "/api/v1/agents/foo", {"name": "foo"})
    result = await manager_tools._request("GET", "/api/v1/agents/foo")
    assert not result.get("isError")
    assert mock_api.calls == [("GET", "/api/v1/agents/foo")]


# --- sleep_agent ---

@pytest.mark.asyncio
async def test_sleep_agent_patches_lifecycle(mock_api):
    mock_api.set("PATCH", "/api/v1/agents/foo", {"name": "foo", "lifecycle": "Sleep"})
    result = await manager_tools.sleep_agent.handler({"name": "foo"})
    assert not result.get("isError")
    assert mock_api.last_json == {"lifecycle": "Sleep"}


@pytest.mark.asyncio
async def test_sleep_agent_defaults_to_self(mock_api):
    mock_api.set("PATCH", "/api/v1/agents/self", {"name": "self", "lifecycle": "Sleep"})
    result = await manager_tools.sleep_agent.handler({})
    assert not result.get("isError")
    assert mock_api.calls == [("PATCH", "/api/v1/agents/self")]


# --- wake_agent ---

@pytest.mark.asyncio
async def test_wake_agent_posts_with_instructions(mock_api):
    mock_api.set("POST", "/api/v1/agents", {"name": "foo", "status": "Pending"})
    result = await manager_tools.wake_agent.handler({"name": "foo", "instructions": "do X"})
    assert not result.get("isError")
    assert mock_api.last_json["name"] == "foo"
    assert mock_api.last_json["instructions"] == "do X"


@pytest.mark.asyncio
async def test_wake_agent_requires_instructions(mock_api):
    result = await manager_tools.wake_agent.handler({"name": "foo"})
    assert result.get("isError")


# --- list_agents ---

@pytest.mark.asyncio
async def test_list_agents(mock_api):
    mock_api.set("GET", "/api/v1/agents", {"agents": [{"name": "a"}, {"name": "b"}]})
    result = await manager_tools.list_agents.handler({})
    assert not result.get("isError")
    body = json.loads(result["content"][0]["text"])
    assert len(body["agents"]) == 2


# --- get_agent ---

@pytest.mark.asyncio
async def test_get_agent_returns_full_spec(mock_api):
    mock_api.set("GET", "/api/v1/agents/foo", {"name": "foo", "model": "claude-haiku-4-5", "skills": ["a"]})
    result = await manager_tools.get_agent.handler({"name": "foo"})
    assert not result.get("isError")
    body = json.loads(result["content"][0]["text"])
    assert body["model"] == "claude-haiku-4-5"
