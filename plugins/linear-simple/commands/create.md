---
description: Create a new Linear issue
argument-hint: [title]
allowed-tools: Bash(curl:*), Bash(cat:*), AskUserQuestion
---

# Create Linear Issue

Create new issue with title: $ARGUMENTS

## Step 1: Check Configs

```bash
USER_CONFIG=$(cat ~/.config/linear-simple/config.json 2>/dev/null)
PROJECT_CONFIG=$(cat .claude/linear-simple.json 2>/dev/null)
```

## Step 2: Validate API Key

If `USER_CONFIG` is empty or doesn't contain `api_key`:
- Tell user: "Linear API 키가 설정되지 않았습니다. `/linear-simple:setup`을 실행해주세요."
- **STOP HERE**

## Step 3: Check Project Config (IMPORTANT!)

**If `PROJECT_CONFIG` is empty:**

You MUST use **AskUserQuestion**:
- Question: "이 워크스페이스에 Linear 팀/프로젝트 설정이 없습니다. 지금 설정할까요?"
- Options:
  - **Yes** - "워크스페이스별 설정을 생성합니다"
  - **No** - "기본 팀 설정으로 진행합니다"

**If Yes:** Tell user to run `/linear-simple:setup` → **STOP**
**If No:** Check default_team in user config → if missing, **STOP**

## Step 4: Check Title Parameter

If `$ARGUMENTS` is empty:
- Use AskUserQuestion: "어떤 제목과 설명으로 이슈를 생성할까요?"
- Wait for response

## Step 5: Extract Values

```bash
API_KEY=$(echo $USER_CONFIG | grep -o '"api_key":"[^"]*"' | cut -d'"' -f4)

if [ -n "$PROJECT_CONFIG" ]; then
  TEAM_ID=$(echo $PROJECT_CONFIG | grep -o '"team_id":"[^"]*"' | cut -d'"' -f4)
  PROJECT_ID=$(echo $PROJECT_CONFIG | grep -o '"project_id":"[^"]*"' | cut -d'"' -f4)
else
  TEAM_ID=$(echo $USER_CONFIG | grep -o '"default_team_id":"[^"]*"' | cut -d'"' -f4)
  PROJECT_ID=""
fi
```

## Step 6: Create Issue

**With project_id:**
```bash
curl -s -X POST https://api.linear.app/graphql \
  -H "Authorization: $API_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"query\":\"mutation{issueCreate(input:{title:\\\"TITLE\\\" teamId:\\\"$TEAM_ID\\\" projectId:\\\"$PROJECT_ID\\\" description:\\\"DESC\\\" priority:3}){issue{id identifier title url project{name}}}}\"}"
```

**Without project_id:**
```bash
curl -s -X POST https://api.linear.app/graphql \
  -H "Authorization: $API_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"query\":\"mutation{issueCreate(input:{title:\\\"TITLE\\\" teamId:\\\"$TEAM_ID\\\" description:\\\"DESC\\\" priority:3}){issue{id identifier title url}}}\"}"
```

## Step 7: Confirm

Show created issue details and URL.
