---
name: blog-material-gen-current
description: 현재 브랜치의 커밋과 PR을 분석하여 오늘 날짜로 Notion '긴 글쓰기' DB에 블로그 소재 추가
trigger:
  - "현재 브랜치 블로그 소재"
  - "이 브랜치 분석"
  - "current branch blog material"
  - "작업 내용 노션에 추가"
allowed-tools: Bash, Read, Write, AskUserQuestion
---

# Blog Material Generator (Current Branch)

현재 브랜치의 커밋과 PR 정보를 분석하여 오늘 날짜로 Notion '긴 글쓰기' 데이터베이스에 블로그 소재를 추가합니다.

## Step 1: Check Configuration

First, check if config exists:
```bash
cat ~/.config/blog-material-gen/config.json 2>/dev/null
```

### If no config file exists:
Show message and redirect to setup:
```
Blog Material Generator가 아직 설정되지 않았습니다.

설정을 시작하려면 Notion API 키와 데이터베이스 ID가 필요합니다.

준비사항:
1. Notion Integration 생성 (https://www.notion.so/my-integrations)
2. 대상 데이터베이스에 Integration 연결 (Share -> Invite)
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
설정 파일이 불완전합니다. 다시 설정해주세요.
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

## Step 3: Find Plugin Directory and Run Pipeline

Find the plugin directory and run the pipeline with `--current-branch` flag:
```bash
PLUGIN_DIR=$(find ~/.claude/plugins -path "*blog-material-gen" -name "blog-material-gen" -type d 2>/dev/null | grep -v skills | head -1)
if [ -z "$PLUGIN_DIR" ] || [ ! -f "$PLUGIN_DIR/scripts/pipeline.ts" ]; then
  echo "Plugin directory not found. Please reinstall the plugin."
  exit 1
fi
cd "$PLUGIN_DIR" && npx tsx scripts/pipeline.ts --current-branch "WORKING_DIRECTORY"
```

Where:
- `WORKING_DIRECTORY`: Current working directory where user invoked the command

## Step 4: Report Result

After pipeline completes, show result:

### If success:
```
블로그 소재 생성 완료!

Notion 페이지: [URL]
분석된 브랜치: [BRANCH_NAME]
생성된 블로그 아이디어: 1개

생성된 페이지에서 글쓰기 재료를 확인하세요.
```

### If failed:
```
블로그 소재 생성 실패

원인: [ERROR_MESSAGE]

해결 방법:
- [SPECIFIC_HELP_BASED_ON_ERROR]
```

---

## 동작 방식

1. **베이스 브랜치 자동 감지**: main, master, develop, daily/* 중 공통 조상이 있는 브랜치를 자동 감지
2. **커밋 분석**: 베이스 브랜치 대비 현재 브랜치의 커밋들을 분석
3. **PR 정보 수집**: GitHub PR 정보가 있으면 함께 수집
4. **오늘 날짜로 저장**: 같은 날짜 페이지가 있으면 append, 없으면 새로 생성

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

1. **작업 요약**: 커밋 수, 변경 파일 수 요약
2. **기술 블로그 소재**: 브랜치 작업 기반 블로그 아이디어
3. **상세 재료**:
   - 🔗 **PR 링크**: GitHub PR URL (있는 경우)
   - 🔗 **커밋 링크**: 각 커밋의 GitHub URL (최대 5개)
   - 📝 **블로그 초안** (OpenAI API 키 설정 시):
     - 제목
     - 핵심 포인트 3-5개
     - 코드 예제 설명
   - 요구사항
   - 주요 기술
   - 코드 예제 (민감 정보 마스킹됨)
   - 트러블슈팅 내역
   - 배운 점
   - 초안 포스트 아이디어

**OpenAI 통합 (선택사항)**:
- OpenAI API 키를 설정하면 더 풍부하고 구조화된 블로그 초안이 자동 생성됩니다.
- 설정하지 않아도 기존처럼 정상 동작합니다.
- 설정 방법: `/blog-material-gen:setup` 실행 시 Step 6에서 API 키 입력
