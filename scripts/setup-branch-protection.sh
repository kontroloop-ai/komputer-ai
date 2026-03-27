#!/bin/bash
# Setup branch protection for komputer-ai
# Run this after making the repo public:
#   gh repo edit kontroloop-ai/komputer-ai --visibility public
#   ./scripts/setup-branch-protection.sh

set -euo pipefail

REPO="kontroloop-ai/komputer-ai"

echo "Setting up branch protection for $REPO..."

gh api "repos/$REPO/branches/main/protection" \
  --method PUT \
  --input - << 'EOF'
{
  "required_status_checks": {
    "strict": false,
    "contexts": ["Detect Changes", "Build Operator", "Build API", "Build Agent"]
  },
  "enforce_admins": false,
  "required_pull_request_reviews": {
    "required_approving_review_count": 1,
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": false
  },
  "restrictions": null,
  "required_conversation_resolution": true,
  "allow_force_pushes": false,
  "allow_deletions": false,
  "block_creations": false,
  "required_linear_history": false
}
EOF

echo "✔ Branch protection enabled on main"
echo ""
echo "Rules:"
echo "  - PRs required with 1 approval"
echo "  - Stale reviews dismissed on new push"
echo "  - CI status checks must pass"
echo "  - Conversations must be resolved"
echo "  - No force push or branch deletion"
