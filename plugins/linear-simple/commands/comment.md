---
description: Add a comment to a Linear issue
argument-hint: [issue-identifier] [comment]
allowed-tools: Bash(curl:*), Bash(cat:*), AskUserQuestion
---

# Add Comment to Issue

Add comment to: $ARGUMENTS

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

## Step 4: Parse Arguments

- If issue identifier not provided, check branch name (e.g., `feature/BYU-125-xxx`)
- If comment not provided, ask user

## Step 5: Get Issue UUID

```bash
API_KEY=$(echo $USER_CONFIG | grep -o '"api_key":"[^"]*"' | cut -d'"' -f4)

curl -s -X POST https://api.linear.app/graphql \
  -H "Authorization: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"query{issue(id:\"IDENTIFIER\"){id}}"}'
```

## Step 6: Add Comment

```bash
curl -s -X POST https://api.linear.app/graphql \
  -H "Authorization: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"mutation{commentCreate(input:{issueId:\"ISSUE_UUID\",body:\"COMMENT_TEXT\"}){comment{id body url}}}"}'
```

## Step 7: Confirm

Show comment URL.
