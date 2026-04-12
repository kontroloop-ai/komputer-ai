"""Integration tests for offices."""

import pytest
from komputer_ai.models import CreateAgentRequest


MANAGER_NAME = "sdk-test-office-mgr"


@pytest.fixture(autouse=True)
def cleanup(client):
    _safe_delete(client, MANAGER_NAME)
    yield
    _safe_delete(client, MANAGER_NAME)


def _safe_delete(client, name):
    try:
        client.agents.delete_agent(name)
    except Exception:
        pass


class TestOffices:
    """Offices are created implicitly when a manager agent spawns workers.

    These tests verify the read-only office endpoints work correctly.
    """

    def test_list_offices(self, client):
        offices = client.offices.list_offices()
        assert offices is not None
        assert isinstance(offices.offices, list)

    def test_get_office_not_found(self, client):
        with pytest.raises(Exception):
            client.offices.get_office("nonexistent-office")
