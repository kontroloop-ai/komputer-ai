"""High-level convenience client for the komputer.ai API."""

import json
import threading
from dataclasses import dataclass, field
from typing import Any, Callable, Iterator, Optional

from komputer_ai import Configuration, ApiClient
from komputer_ai.api.agents_api import AgentsApi
from komputer_ai.api.offices_api import OfficesApi
from komputer_ai.api.schedules_api import SchedulesApi
from komputer_ai.api.memories_api import MemoriesApi
from komputer_ai.api.skills_api import SkillsApi
from komputer_ai.api.secrets_api import SecretsApi
from komputer_ai.api.connectors_api import ConnectorsApi


@dataclass
class AgentEvent:
    """A single event from an agent's WebSocket stream."""

    agent_name: str
    type: str
    timestamp: str = ""
    payload: dict = field(default_factory=dict)


class AgentEventStream:
    """Iterable stream of agent events over WebSocket.

    Usage:
        for event in client.watch_agent("my-agent"):
            print(event.type, event.payload)

        # Or stop on task completion:
        for event in client.watch_agent("my-agent"):
            if event.type == "task_completed":
                break
    """

    def __init__(self, ws_url: str, agent_name: str):
        try:
            import websocket
        except ImportError:
            raise ImportError(
                "websocket-client is required for watch_agent(). "
                "Install it with: pip install websocket-client"
            )

        self._agent_name = agent_name
        self._ws = websocket.WebSocket()
        self._ws.connect(f"{ws_url}/api/v1/agents/{agent_name}/ws")

    def __iter__(self) -> Iterator[AgentEvent]:
        return self

    def __next__(self) -> AgentEvent:
        try:
            raw = self._ws.recv()
            if not raw:
                raise StopIteration
            data = json.loads(raw)
            return AgentEvent(
                agent_name=data.get("agentName", self._agent_name),
                type=data.get("type", ""),
                timestamp=data.get("timestamp", ""),
                payload=data.get("payload", {}),
            )
        except Exception:
            self.close()
            raise StopIteration

    def close(self):
        try:
            self._ws.close()
        except Exception:
            pass

    def __enter__(self):
        return self

    def __exit__(self, *args):
        self.close()


class KomputerClient:
    """Convenience wrapper around the auto-generated komputer.ai API client.

    Usage:
        client = KomputerClient("http://localhost:8080")
        agents = client.agents.list_agents()
    """

    def __init__(self, base_url: str = "http://localhost:8080"):
        self._base_url = base_url.rstrip("/")
        config = Configuration(host=f"{self._base_url}/api/v1")
        api_client = ApiClient(config)

        self.agents = AgentsApi(api_client)
        self.offices = OfficesApi(api_client)
        self.schedules = SchedulesApi(api_client)
        self.memories = MemoriesApi(api_client)
        self.skills = SkillsApi(api_client)
        self.secrets = SecretsApi(api_client)
        self.connectors = ConnectorsApi(api_client)
        self._api_client = api_client

    def watch_agent(self, name: str) -> AgentEventStream:
        """Stream real-time events from an agent via WebSocket.

        Returns an iterable of AgentEvent objects. Events include:
        task_started, thinking, tool_use, tool_result, text,
        task_completed, task_cancelled, error.

        Requires: pip install websocket-client

        Usage:
            for event in client.watch_agent("my-agent"):
                if event.type == "text":
                    print(event.payload.get("text", ""))
                elif event.type == "task_completed":
                    break
        """
        ws_url = self._base_url.replace("http://", "ws://").replace(
            "https://", "wss://"
        )
        return AgentEventStream(ws_url, name)

    def close(self):
        self._api_client.__exit__(None, None, None)

    def __enter__(self):
        return self

    def __exit__(self, *args):
        self._api_client.__exit__(*args)
