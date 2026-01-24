# Blog Material Generator

[English](README.md) | [한국어](README.ko.md)

| | |
|---|---|
| **이름** | blog-material-gen |
| **설명** | Daily Git 브랜치에서 Notion으로 블로그 소재 자동 생성 (Slack 알림 지원) |
| **버전** | 1.0.0 |
| **트리거** | "블로그 소재", "daily 브랜치 분석", "글쓰기 소재 생성" |

---

Daily Git 브랜치를 자동 분석하여 Notion 데이터베이스에 블로그 소재를 생성하는 Claude Code 플러그인.

## 기능

- Git 브랜치/커밋 분석 → 블로그 아이디어 자동 추출
- 날짜 기반 Notion 페이지 생성
- 같은 날짜 다른 워크스페이스 → 기존 페이지에 `[워크스페이스명]` 태그로 추가
- 민감 정보 자동 마스킹 (API 키, 토큰, 비밀번호 등)
- Slack 알림 (선택)

## 설치

### 방법 1: 마켓플레이스 (권장)

```bash
# 1단계: 마켓플레이스 추가
/plugin marketplace add lbo728/opengiver-skills

# 2단계: 플러그인 설치
/plugin install blog-material-gen@opengiver-skills

# 3단계: Claude Code 재시작
```

### 방법 2: UI로 설치

```bash
# 플러그인 매니저 열기
/plugin

# "Marketplaces" 탭 → Add → 입력: lbo728/opengiver-skills
# "Discover" 탭으로 이동 → "blog-material-gen" 찾기 → Install
```

## 설정

### 1. Notion Integration 생성

1. [Notion Integrations](https://www.notion.so/my-integrations) 페이지 방문
2. "New integration" 클릭
3. 이름 입력 (예: "Blog Material Gen")
4. Associated workspace 선택
5. "Submit" → API Key 복사 (`secret_xxx...`)

### 2. Notion Database 연결

1. Notion에서 대상 데이터베이스 열기
2. 우측 상단 `...` → "Connections" → "Connect to" → 생성한 Integration 선택
3. Database ID 확인 (URL에서 추출):
   ```
   https://notion.so/myworkspace/abc123def456...?v=...
                               ^^^^^^^^^^^^^^^^
                               이 부분이 Database ID
   ```

### 3. 설정 명령어 실행

```bash
/blog-material-gen:setup
```

Agent가 다음 정보를 순서대로 요청합니다:

| 항목 | 필수 | 설명 |
|------|------|------|
| Notion API Key | O | `secret_` 로 시작하는 키 |
| Database ID | O | 32자리 hex 문자열 |
| Slack Webhook URL | X | 알림 받을 채널의 Webhook URL |

설정은 `~/.config/blog-material-gen/config.json`에 저장됩니다.

## Slack 알림 설정 (선택)

### Webhook URL 생성

1. [Slack API](https://api.slack.com/apps) → "Create New App" → "From scratch"
2. App 이름 입력, Workspace 선택
3. "Incoming Webhooks" → "Activate Incoming Webhooks" ON
4. "Add New Webhook to Workspace" → 채널 선택 → "Allow"
5. Webhook URL 복사 (`https://hooks.slack.com/services/...`)

### 알림 내용

파이프라인 성공 시 다음 정보가 Slack으로 전송됩니다:

- 날짜
- 워크스페이스명
- 분석된 브랜치 수
- 생성된 블로그 아이디어 수
- Notion 페이지 링크 버튼

## 사용법

### 자동 실행 (권장)

AGENTS.md에 Blog Material Generation Protocol이 포함되어 있으면, daily → dev PR 머지 완료 시 Agent가 자동으로 실행합니다.

### 수동 실행

```bash
/blog-material-gen
```

또는 특정 브랜치 지정:

```
"daily/2026-01-24 브랜치 분석해줘"
"블로그 소재 생성해줘"
```

## 출력 결과

### Notion 페이지 구조

```
📝 2026-01-24 글쓰기 소재

## 오늘의 요약
오늘은 3개의 feature 브랜치에서 15개의 커밋을 통해...

## 블로그 아이디어
1. TypeScript에서 JWT 인증 구현하기
2. React Query로 서버 상태 관리 최적화

## [opengiver-skills] 작업 상세
### feature/add-auth
- 요구사항: 사용자 인증 기능 추가
- 기술: TypeScript, React
- 코드 예제: ...
- 트러블슈팅: ...
- 배운 점: ...

## [another-project] 작업 상세  ← 같은 날짜 다른 워크스페이스
### feature/update-ui
...
```

## 플러그인 구조

```
blog-material-gen/
├── .claude-plugin/
│   └── plugin.json           # 플러그인 매니페스트
├── commands/
│   └── setup.md              # /blog-material-gen:setup
├── skills/
│   └── blog-material-gen/
│       └── SKILL.md          # 자연어 스킬
├── scripts/
│   ├── types.ts              # 타입 정의
│   ├── git-analyzer.ts       # Git 분석
│   ├── code-masker.ts        # 민감 정보 마스킹
│   ├── notion-client.ts      # Notion API 클라이언트
│   └── pipeline.ts           # 메인 파이프라인
├── package.json              # 의존성
├── README.md
└── README.ko.md
```

## 문제 해결

### "설정이 완료되지 않았습니다"

```bash
/blog-material-gen:setup
```

### "Failed to connect to Notion"

1. API Key가 `secret_` 로 시작하는지 확인
2. Database에 Integration이 연결되었는지 확인
3. Database ID가 정확한지 확인

### Slack 알림이 안 옴

1. Webhook URL이 `https://hooks.slack.com/services/` 로 시작하는지 확인
2. Slack App이 해당 채널에 접근 권한이 있는지 확인

## 라이선스

MIT
