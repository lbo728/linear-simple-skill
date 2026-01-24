---
description: Configure Notion API key, database settings, and install dependencies
allowed-tools: Bash(curl:*), Bash(mkdir:*), Bash(cat:*), Bash(npm:*), Bash(find:*), Write, Read, AskUserQuestion
---

# Blog Material Generator Setup

Set up Notion API configuration and install dependencies for blog material generation.

## Step 0: Install Dependencies

Find plugin directory and install npm dependencies:

```bash
PLUGIN_DIR=$(find ~/.claude/plugins -path "*blog-material-gen" -name "blog-material-gen" -type d 2>/dev/null | grep -v skills | head -1)
if [ -n "$PLUGIN_DIR" ] && [ -f "$PLUGIN_DIR/package.json" ]; then
  cd "$PLUGIN_DIR" && npm install --silent 2>/dev/null
  echo "✅ Dependencies installed at: $PLUGIN_DIR"
else
  echo "⚠️ Plugin directory not found. Skipping dependency installation."
fi
```

## Step 1: Check User Config (API Key)

Check if API key exists:
```bash
cat ~/.config/blog-material-gen/config.json 2>/dev/null
```

If no config file or no API key configured:
1. Ask user for their Notion API key using **AskUserQuestion**:
   - Question: "Notion API 키를 입력해주세요. (https://www.notion.so/my-integrations 에서 Internal Integration Token 복사)"
   - Text input required

2. Create user config directory:
```bash
mkdir -p ~/.config/blog-material-gen
```

## Step 2: Validate API Key

Test the API key by fetching user info:
```bash
curl -s -X GET 'https://api.notion.com/v1/users/me' \
  -H 'Authorization: Bearer API_KEY' \
  -H 'Notion-Version: 2022-06-28'
```

### If response contains `"object": "user"`:
- API key is valid, proceed to Step 3

### If response contains `"code": "unauthorized"`:
- Show error: "❌ API 키가 유효하지 않습니다. Notion Integration 설정을 확인해주세요."
- Ask user to re-enter API key

### If response contains other error:
- Show error message and ask user to check their internet connection

## Step 3: Ask for Database ID

Use **AskUserQuestion**:
- Question: "Notion 데이터베이스 ID를 입력해주세요.\n\n📌 데이터베이스 ID 찾는 방법:\n1. Notion에서 대상 데이터베이스 페이지 열기\n2. URL에서 ID 복사: https://notion.so/workspace/[DATABASE_ID]?v=...\n3. Integration을 데이터베이스에 연결 (Share → Invite)"
- Text input required

## Step 4: Validate Database Access

Test database access:
```bash
curl -s -X GET 'https://api.notion.com/v1/databases/DATABASE_ID' \
  -H 'Authorization: Bearer API_KEY' \
  -H 'Notion-Version: 2022-06-28'
```

### If response contains `"object": "database"`:
- Database access confirmed
- Extract database title from response: `title[0].plain_text`
- Proceed to Step 5

### If response contains `"code": "object_not_found"`:
- Show error: "❌ 데이터베이스를 찾을 수 없습니다."
- Show help:
  ```
  💡 해결 방법:
  1. Notion에서 해당 데이터베이스 페이지 열기
  2. 우측 상단 "Share" 클릭
  3. "Invite" 입력란에서 Integration 이름 검색
  4. Integration 선택 후 "Invite" 클릭
  ```
- Use **AskUserQuestion** with options:
  - **Retry** - "다시 시도 (Integration 연결 후)"
  - **Re-enter** - "다른 데이터베이스 ID 입력"
  - **Cancel** - "설정 취소"

### If response contains `"code": "unauthorized"`:
- Show error: "❌ 데이터베이스에 접근 권한이 없습니다."
- Show same help as above
- Ask user to retry or re-enter

## Step 5: Ask for Slack Notification (Optional)

Use **AskUserQuestion**:
- Question: "Slack 알림을 설정하시겠습니까? (블로그 소재 생성 완료 시 알림)"
- Options:
  - **Yes** - "Slack 알림 설정"
  - **No** - "나중에 설정 (스킵)"

### If Yes:

Use **AskUserQuestion**:
- Question: "Slack Incoming Webhook URL을 입력해주세요.\n\n📌 Webhook URL 생성 방법:\n1. https://api.slack.com/apps 접속\n2. 'Create New App' → 'From scratch'\n3. 'Incoming Webhooks' 활성화\n4. 'Add New Webhook to Workspace' 클릭\n5. 채널 선택 후 Webhook URL 복사"
- Text input required

#### Validate Slack Webhook

Test the webhook:
```bash
curl -s -X POST 'WEBHOOK_URL' \
  -H 'Content-Type: application/json' \
  -d '{"text":"✅ Blog Material Generator 연결 테스트 성공!"}'
```

- If response is `ok`: Webhook valid, proceed to Step 6
- If error: Show error and ask to re-enter or skip

### If No:
- Skip Slack setup, proceed to Step 6 without slack_webhook_url

## Step 6: Save Configuration

Use Write tool to create `~/.config/blog-material-gen/config.json`:

### With Slack:
```json
{
  "api_key": "USER_API_KEY",
  "database_id": "DATABASE_ID",
  "database_name": "DATABASE_NAME",
  "slack_webhook_url": "WEBHOOK_URL"
}
```

### Without Slack:
```json
{
  "api_key": "USER_API_KEY",
  "database_id": "DATABASE_ID",
  "database_name": "DATABASE_NAME"
}
```

## Step 7: Confirmation Message

After setup complete, show:

### With Slack:
```
✅ Blog Material Generator 설정 완료

✓ Notion API 키: 설정됨
✓ 데이터베이스: "DATABASE_NAME" 연결됨
✓ Slack 알림: 설정됨

설정 파일 위치: ~/.config/blog-material-gen/config.json

이제 "/blog-material-gen" 또는 "블로그 소재 생성해줘"로 사용할 수 있습니다.
```

### Without Slack:
```
✅ Blog Material Generator 설정 완료

✓ Notion API 키: 설정됨
✓ 데이터베이스: "DATABASE_NAME" 연결됨
✓ Slack 알림: 미설정 (나중에 config.json에 slack_webhook_url 추가 가능)

설정 파일 위치: ~/.config/blog-material-gen/config.json

이제 "/blog-material-gen" 또는 "블로그 소재 생성해줘"로 사용할 수 있습니다.
```

Now begin setup by installing dependencies and checking if config exists.
