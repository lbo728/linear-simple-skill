---
description: Create PR and update Linear issue (add comment + change status to In Review)
allowed-tools: Bash(curl:*), Bash(cat:*), Bash(git:*), Bash(gh:*), AskUserQuestion
---

# PR Update - Combined Action

Create PR and update Linear issue.

## Step 1: Check Configs

```bash
USER_CONFIG=$(cat ~/.config/linear-simple/config.json 2>/dev/null)
PROJECT_CONFIG=$(cat .claude/linear-simple.json 2>/dev/null)
```

## Step 2: Validate API Key

If no `api_key`:
- "Linear API 키가 설정되지 않았습니다. `/linear-simple:setup`을 실행해주세요."
- **STOP HERE**

## Step 3: Check Project Config (IMPORTANT!)

**If `PROJECT_CONFIG` is empty:**

You MUST use **AskUserQuestion**:
- Question: "이 워크스페이스에 Linear 팀/프로젝트 설정이 없습니다. 지금 설정할까요?"
- Options:
  - **Yes** - "워크스페이스별 설정을 생성합니다"
  - **No** - "기본 팀 설정으로 진행합니다"

**If Yes:** → `/linear-simple:setup` → **STOP**
**If No:** → Check default_team → if missing, **STOP**

## Step 4: Identify Linear Issue

```bash
git branch --show-current
```

Extract issue identifier from branch (e.g., `feature/BYU-125-xxx`).
If not found, ask user which issue to update.

## Step 5: Create PR

```bash
git push -u origin $(git branch --show-current)
gh pr create --title "PR_TITLE" --body "PR_BODY"
```

Capture PR URL.

## Step 6: Get Issue UUID

```bash
API_KEY=$(echo $USER_CONFIG | grep -o '"api_key":"[^"]*"' | cut -d'"' -f4)

curl -s -X POST https://api.linear.app/graphql \
  -H "Authorization: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"query{issue(id:\"ISSUE_ID\"){id}}"}'
```

## Step 7: Add PR Comment

```bash
curl -s -X POST https://api.linear.app/graphql \
  -H "Authorization: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"mutation{commentCreate(input:{issueId:\"UUID\",body:\"🔗 PR: URL\"}){comment{id}}}"}'
```

## Step 8: Update Status to "In Review"

```bash
# Get In Review state ID
curl -s -X POST https://api.linear.app/graphql \
  -H "Authorization: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"query{workflowStates(filter:{name:{eq:\"In Review\"}}){nodes{id}}}"}'

# Update issue
curl -s -X POST https://api.linear.app/graphql \
  -H "Authorization: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"mutation{issueUpdate(id:\"UUID\",input:{stateId:\"STATE_ID\"}){issue{state{name}}}}"}'
```

## Step 9: Confirm

- ✓ PR created: [URL]
- ✓ Comment added to [ISSUE]
- ✓ Status: In Review
