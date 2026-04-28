---
title: Local stack
description: Run Prometheus + Grafana locally with docker-compose to test metrics without a cluster.
---

For testing without a cluster:

```bash
cd monitoring && docker compose up -d
# Prometheus: http://localhost:9090
# Grafana: http://localhost:3000
```

See `monitoring/README.md` for full instructions including how to test agent remote-write locally.
