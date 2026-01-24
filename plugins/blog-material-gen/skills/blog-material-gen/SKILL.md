---
name: blog-material-gen
description: Daily 브랜치 작업 내용을 분석하여 Notion '긴 글쓰기' DB에 블로그 소재를 자동 생성
trigger:
  - "블로그 소재 생성"
  - "글쓰기 소재"
  - "daily 브랜치 분석"
  - "작업 내용 정리"
allowed-tools: Bash, Read, Write, AskUserQuestion
---

# Blog Material Generator

Daily 브랜치의 모든 하위 feature 브랜치를 분석하고 Notion '긴 글쓰기' 데이터베이스에 기술 블로그 소재를 자동 생성합니다.

## Step 1: Check Configuration

First, check if config exists:
```bash
cat ~/.config/blog-material-gen/config.json 2>/dev/null
```

### If no config file exists:
Show message and redirect to setup:
```
⚠️ Blog Material Generator가 아직 설정되지 않았습니다.

설정을 시작하려면 Notion API 키와 데이터베이스 ID가 필요합니다.

📌 준비사항:
1. Notion Integration 생성 (https://www.notion.so/my-integrations)
2. 대상 데이터베이스에 Integration 연결 (Share → Invite)
```

Then use **AskUserQuestion**:
- Question: "Blog Material Generator 설정을 시작할까요?"
- Options:
  - **Yes** - "설정 시작"
  - **No** - "나중에 설정"

If Yes: Execute `/blog-material-gen:setup` command
If No: Exit with message "나중에 `/blog-material-gen:setup`으로 설정할 수 있습니다."

### If config exists but invalid (missing api_key or database_id):
Show error and redirect to setup:
```
⚠️ 설정 파일이 불완전합니다. 다시 설정해주세요.
```
Execute `/blog-material-gen:setup` command

## Step 2: Validate Configuration

Test Notion connection:
```bash
curl -s -X GET 'https://api.notion.com/v1/databases/DATABASE_ID' \
  -H 'Authorization: Bearer API_KEY' \
  -H 'Notion-Version: 2022-06-28'
```

### If connection fails:
Show error with specific reason and offer to re-setup:
- `unauthorized`: "API 키가 만료되었거나 유효하지 않습니다."
- `object_not_found`: "데이터베이스에 접근할 수 없습니다. Integration 연결을 확인해주세요."

Use **AskUserQuestion**:
- Question: "설정을 다시 진행할까요?"
- Options:
  - **Yes** - "설정 다시 시작"
  - **No** - "취소"

## Step 3: Get Daily Branch

If user didn't specify a branch, ask for it:

Use **AskUserQuestion**:
- Question: "분석할 Daily 브랜치를 입력해주세요. (예: daily/2026-01-23)\n\n빈 값을 입력하면 현재 브랜치를 분석합니다."
- Text input (optional)

If empty, get current branch:
```bash
git branch --show-current
```

## Step 4: Find Plugin Directory and Run Pipeline

Find the plugin directory and run the pipeline:
```bash
PLUGIN_DIR=$(find ~/.claude/plugins -path "*blog-material-gen" -name "blog-material-gen" -type d 2>/dev/null | grep -v skills | head -1)
if [ -z "$PLUGIN_DIR" ] || [ ! -f "$PLUGIN_DIR/scripts/pipeline.ts" ]; then
  echo "❌ Plugin directory not found. Please reinstall the plugin."
  exit 1
fi
cd "$PLUGIN_DIR" && npx tsx scripts/pipeline.ts "BRANCH_NAME" "WORKING_DIRECTORY"
```

Where:
- `BRANCH_NAME`: The daily branch from Step 3
- `WORKING_DIRECTORY`: Current working directory where user invoked the command

## Step 5: Report Result

After pipeline completes, show result:

### If success:
```
✅ 블로그 소재 생성 완료!

📄 Notion 페이지: [URL]
📊 분석된 브랜치: N개
💡 생성된 블로그 아이디어: N개

생성된 페이지에서 글쓰기 재료를 확인하세요.
```

### If failed:
```
❌ 블로그 소재 생성 실패

원인: [ERROR_MESSAGE]

해결 방법:
- [SPECIFIC_HELP_BASED_ON_ERROR]
```

---

## 코드 마스킹

파이프라인에서 다음 민감 정보가 자동으로 마스킹됩니다:

- API 키 (OpenAI, Anthropic, Notion, Supabase, GitHub, AWS)
- Bearer 토큰
- 비밀번호
- 내부 URL
- 데이터베이스 연결 문자열
- 이메일 주소
- UUID

---

## 생성되는 내용

Notion 페이지에 다음 내용이 자동 생성됩니다:

1. **작업 총정리**: 브랜치 수, 커밋 수, 변경 파일 수 요약
2. **기술 블로그 소재 목록**: 각 브랜치별 블로그 아이디어
3. **브랜치별 상세 재료**:
   - 요구사항
   - 주요 기술
   - 코드 예제 (민감 정보 마스킹됨)
   - 트러블슈팅 내역
   - 배운 점
   - 초안 포스트 아이디어
