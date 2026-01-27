---
description: 현재 브랜치의 커밋과 PR을 분석하여 오늘 날짜로 Notion에 블로그 소재 추가
allowed-tools: Bash(curl:*), Bash(npx:*), Bash(find:*), Bash(cat:*), Bash(cd:*), Read, AskUserQuestion
---

# Blog Material Generator (Current Branch)

현재 브랜치의 작업 내용을 분석하여 오늘 날짜로 Notion '긴 글쓰기' DB에 추가합니다.

## Step 1: Check Configuration

```bash
cat ~/.config/blog-material-gen/config.json 2>/dev/null
```

### If no config or invalid:
```
Blog Material Generator가 설정되지 않았습니다.
/blog-material-gen:setup 을 먼저 실행해주세요.
```
Exit.

## Step 2: Validate Notion Connection

```bash
# Extract from config and test
API_KEY=$(cat ~/.config/blog-material-gen/config.json | grep -o '"api_key"[^,]*' | cut -d'"' -f4)
DATABASE_ID=$(cat ~/.config/blog-material-gen/config.json | grep -o '"database_id"[^,]*' | cut -d'"' -f4)

curl -s -X GET "https://api.notion.com/v1/databases/$DATABASE_ID" \
  -H "Authorization: Bearer $API_KEY" \
  -H 'Notion-Version: 2022-06-28' | head -c 200
```

If fails, show error and suggest re-setup.

## Step 3: Run Pipeline

```bash
PLUGIN_DIR=$(find ~/.claude/plugins -path "*blog-material-gen" -name "blog-material-gen" -type d 2>/dev/null | grep -v skills | head -1)
if [ -z "$PLUGIN_DIR" ] || [ ! -f "$PLUGIN_DIR/scripts/pipeline.ts" ]; then
  echo "Plugin directory not found."
  exit 1
fi
cd "$PLUGIN_DIR" && npx tsx scripts/pipeline.ts --current-branch "WORKING_DIRECTORY"
```

Replace `WORKING_DIRECTORY` with actual working directory path.

## Step 4: Report Result

### Success:
```
블로그 소재 생성 완료!

Notion 페이지: [URL]
분석된 브랜치: [BRANCH_NAME]

오늘 날짜로 Notion 페이지가 생성/업데이트되었습니다.
```

### Failure:
```
블로그 소재 생성 실패

원인: [ERROR]
```
