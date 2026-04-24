import pytest
import json

import manager_tools


@pytest.mark.asyncio
async def test_request_helper_uses_mock(mock_api):
    mock_api.set("GET", "/api/v1/agents/foo", {"name": "foo"})
    result = await manager_tools._request("GET", "/api/v1/agents/foo")
    assert not result.get("isError")
    assert mock_api.calls == [("GET", "/api/v1/agents/foo")]
