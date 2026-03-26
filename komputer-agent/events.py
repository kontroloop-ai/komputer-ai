import json
import time
import redis


class EventPublisher:
    def __init__(self, redis_config: dict, agent_name: str):
        self.agent_name = agent_name
        self.stream_prefix = redis_config.get("stream_prefix", "komputer-events")
        password = redis_config.get("password") or None
        self.client = redis.Redis(
            host=redis_config["address"].split(":")[0],
            port=int(redis_config["address"].split(":")[1]),
            password=password,
            db=redis_config.get("db", 0),
        )

    def publish(self, event_type: str, payload: dict):
        event = {
            "agentName": self.agent_name,
            "type": event_type,
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "payload": json.dumps(payload),
        }
        stream_key = f"{self.stream_prefix}:{self.agent_name}"
        self.client.xadd(stream_key, event, maxlen=200, approximate=True)
