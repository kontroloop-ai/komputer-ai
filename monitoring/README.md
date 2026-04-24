# Local monitoring stack

Prometheus + Grafana for testing komputer-ai metrics locally.

## Start

```bash
cd monitoring && docker compose up -d
```

- Prometheus: http://localhost:9090
- Grafana: http://localhost:3000 (anonymous login as Admin, or admin/admin)

The stack scrapes:
- `komputer-api` on `host.docker.internal:8080/api/metrics` and `/agent/metrics`
- `komputer-operator` on `host.docker.internal:8081/metrics`

So run those locally before starting docker-compose:

```bash
# Terminal 1 — API
cd komputer-api
KOMPUTER_METRICS_PER_AGENT=true go run .

# Terminal 2 — operator
cd komputer-operator
go run ./cmd/main.go --metrics-bind-address=:8081 --metrics-secure=false
```

The Komputer Overview dashboard auto-loads under the Komputer folder in Grafana.

## Test agent remote-write

The Prometheus container has `--web.enable-remote-write-receiver` enabled,
so the agent can push directly to it.

```bash
export KOMPUTER_METRICS_REMOTE_WRITE_URL=http://localhost:9090/api/v1/write
export KOMPUTER_METRICS_PER_AGENT=true
# Then start an agent that uses these env vars (kind cluster, or local agent process).
```

In Prometheus' web UI, query `komputer_agent_steering_total` etc.

## Linux note

On Linux without Docker Desktop, `host.docker.internal` may not resolve.
Either:

```bash
docker compose up -d --add-host=host.docker.internal:host-gateway
```

Or replace `host.docker.internal` with your actual host IP in `prometheus.yml`.

## Stop

```bash
docker compose down -v
```
