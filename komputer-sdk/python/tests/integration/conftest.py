"""Shared fixtures for integration tests."""

import os
import pytest
from komputer_ai.client import KomputerClient


@pytest.fixture(scope="session")
def base_url():
    return os.environ.get("KOMPUTER_API_URL", "http://localhost:8080")


@pytest.fixture(scope="session")
def client(base_url):
    with KomputerClient(base_url) as c:
        yield c
