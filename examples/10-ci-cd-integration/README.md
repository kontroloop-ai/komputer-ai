# 10 — CI/CD Integration

Trigger a komputer.ai agent from a GitHub Actions workflow and wait for it to complete.

## What it does

A GitHub Actions workflow that:
1. Creates (or re-tasks) a named agent via the komputer.ai HTTP API
2. Polls the agent status every 10 seconds
3. Fails the workflow if the task errors or times out
4. Fetches and prints the final task result

## Setup

### 1. Add the secret to your GitHub repository

```
Settings → Secrets and variables → Actions → New repository secret
Name: KOMPUTER_API_URL
Value: http://your-komputer-api.example.com:8080
```

### 2. Copy the workflow

```bash
cp .github/workflows/agent-task.yml .github/workflows/
```

## Trigger the workflow

**From the GitHub UI:**  
Actions → Run Agent Task → Run workflow → fill in agent name + instructions

**From the CLI:**
```bash
gh workflow run agent-task.yml \
  -f agent_name=ci-agent \
  -f instructions="Run the test suite and report any failures"
```

**From another workflow:**
```yaml
- name: Run AI agent
  uses: actions/github-script@v7
  with:
    script: |
      await github.rest.actions.createWorkflowDispatch({
        owner: context.repo.owner,
        repo: context.repo.repo,
        workflow_id: 'agent-task.yml',
        ref: 'main',
        inputs: {
          agent_name: 'ci-agent',
          instructions: 'Analyze the test failures in the latest run and suggest fixes'
        }
      })
```

## Extending the workflow

**Run after tests fail:**
```yaml
- name: Ask agent to investigate failures
  if: failure()
  run: |
    curl -X POST "$KOMPUTER_API/api/v1/agents" \
      -H "Content-Type: application/json" \
      -d "{\"name\":\"failure-investigator\",\"instructions\":\"The CI tests failed. Analyze the logs and suggest a fix.\",\"lifecycle\":\"AutoDelete\"}"
```

**Save agent output as an artifact:**
```yaml
- name: Download agent results
  run: |
    # If agent saved files to /workspace, fetch them via a follow-up task
    curl "$KOMPUTER_API/api/v1/agents/ci-agent/events?limit=1" \
      | jq -r '.events[0].payload.result' > agent-result.txt
      
- uses: actions/upload-artifact@v4
  with:
    name: agent-result
    path: agent-result.txt
```

## Key concepts

- **`lifecycle: Sleep`** — the agent survives between CI runs; send it follow-up tasks without losing workspace state
- **Polling vs WebSocket** — CI environments can use simple HTTP polling; use WebSocket streaming for real-time output in interactive tools
- **`KOMPUTER_API_URL` secret** — never hardcode the API URL; use GitHub Secrets
- The komputer.ai API URL must be reachable from GitHub Actions runners (use a public LoadBalancer or tunnel)
