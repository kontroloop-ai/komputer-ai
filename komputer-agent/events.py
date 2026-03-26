import json
import time
import redis


class EventPublisher:
    def __init__(self, redis_config: dict, agent_name: str):
        self.agent_name = agent_name
        self.queue = redis_config.get("queue", "komputer-events")
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
            "payload": payload,
        }
        self.client.rpush(self.queue, json.dumps(event))
