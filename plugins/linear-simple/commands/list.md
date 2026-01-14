---
description: List recent Linear issues
argument-hint: [count]
allowed-tools: Bash(curl:*), Bash(cat:*), AskUserQuestion
---

# List Linear Issues

List recent issues. Count: $ARGUMENTS

## Step 1: Check Configs

```bash
# Check user config (API key)
USER_CONFIG=$(cat ~/.config/linear-simple/config.json 2>/dev/null)

# Check project config
PROJECT_CONFIG=$(cat .claude/linear-simple.json 2>/dev/null)
```

## Step 2: Validate API Key

If `USER_CONFIG` is empty or doesn't contain `api_key`:
- Tell user: "Linear API 키가 설정되지 않았습니다. `/linear-simple:setup`을 실행해주세요."
- **STOP HERE**

## Step 3: Check Project Config (IMPORTANT!)

**If `PROJECT_CONFIG` is empty (file doesn't exist):**

You MUST use **AskUserQuestion** to ask:
- Question: "이 워크스페이스에 Linear 팀/프로젝트 설정이 없습니다. 지금 설정할까요?"
- Options:
  - **Yes** - "워크스페이스별 설정을 생성합니다"
  - **No** - "기본 팀 설정으로 진행합니다"

**If user selects Yes:**
- Tell user to run `/linear-simple:setup` first
- **STOP HERE**

**If user selects No:**
- Check if `USER_CONFIG` has `default_team_key`
- If no default team, tell user to run `/linear-simple:setup`
- If default team exists, continue

## Step 4: Check Count Parameter

If `$ARGUMENTS` is empty or not a number:
- Use AskUserQuestion: "몇 개의 이슈를 가져올까요?"
- Options: "5", "10", "20", "50"

## Step 5: Extract Values

```bash
API_KEY=$(echo $USER_CONFIG | grep -o '"api_key":"[^"]*"' | cut -d'"' -f4)

if [ -n "$PROJECT_CONFIG" ]; then
  TEAM_KEY=$(echo $PROJECT_CONFIG | grep -o '"team_key":"[^"]*"' | cut -d'"' -f4)
  PROJECT_ID=$(echo $PROJECT_CONFIG | grep -o '"project_id":"[^"]*"' | cut -d'"' -f4)
else
  TEAM_KEY=$(echo $USER_CONFIG | grep -o '"default_team_key":"[^"]*"' | cut -d'"' -f4)
  PROJECT_ID=""
fi
```

## Step 6: Fetch Issues

**If project_id is set** (filter by project):
```bash
curl -s -X POST https://api.linear.app/graphql \
  -H "Authorization: $API_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"query\":\"query{issues(first:COUNT,filter:{team:{key:{eq:\\\"$TEAM_KEY\\\"}},project:{id:{eq:\\\"$PROJECT_ID\\\"}}}){nodes{id identifier title state{name} priority project{name}}}}\"}"
```

**If no project_id**:
```bash
curl -s -X POST https://api.linear.app/graphql \
  -H "Authorization: $API_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"query\":\"query{issues(first:COUNT,filter:{team:{key:{eq:\\\"$TEAM_KEY\\\"}}}){nodes{id identifier title state{name} priority project{name}}}}\"}"
```

## Step 7: Display

Display issues in a table format.
