---
description: Update issue status (e.g., In Progress, Done)
argument-hint: [issue-identifier] [status]
allowed-tools: Bash(curl:*), Bash(cat:*), AskUserQuestion
---

# Update Issue Status

Update status for: $ARGUMENTS

## Step 1: Check Configs

```bash
USER_CONFIG=$(cat ~/.config/linear-simple/config.json 2>/dev/null)
PROJECT_CONFIG=$(cat .claude/linear-simple.json 2>/dev/null)
```

## Step 2: Validate API Key

If no `api_key` in `USER_CONFIG`:
- Tell user: "Linear API 키가 설정되지 않았습니다. `/linear-simple:setup`을 실행해주세요."
- **STOP HERE**

## Step 3: Check Project Config (IMPORTANT!)

**If `PROJECT_CONFIG` is empty:**

You MUST use **AskUserQuestion**:
- Question: "이 워크스페이스에 Linear 팀/프로젝트 설정이 없습니다. 지금 설정할까요?"
- Options:
  - **Yes** - "워크스페이스별 설정을 생성합니다"
  - **No** - "기본 팀 설정으로 진행합니다"

**If Yes:** → Run `/linear-simple:setup` → **STOP**
**If No:** → Check default_team → if missing, **STOP**

## Step 4: Parse Arguments

Extract issue identifier and target status.
If status not provided, ask user.

## Step 5: Get Issue UUID

```bash
API_KEY=$(echo $USER_CONFIG | grep -o '"api_key":"[^"]*"' | cut -d'"' -f4)

curl -s -X POST https://api.linear.app/graphql \
  -H "Authorization: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"query{issue(id:\"IDENTIFIER\"){id}}"}'
```

## Step 6: Get Target State UUID

```bash
curl -s -X POST https://api.linear.app/graphql \
  -H "Authorization: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"query{workflowStates(filter:{name:{eq:\"TARGET_STATUS\"}}){nodes{id name}}}"}'
```

## Step 7: Update Issue

```bash
curl -s -X POST https://api.linear.app/graphql \
  -H "Authorization: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"mutation{issueUpdate(id:\"ISSUE_UUID\",input:{stateId:\"STATE_UUID\"}){issue{id identifier state{name}}}}"}'
```

## Step 8: Confirm

Show updated status.
