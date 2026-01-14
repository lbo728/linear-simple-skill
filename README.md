# Linear Simple Skill

Claude Code용 Linear GraphQL API skill. MCP 없이 curl로 직접 호출하여 토큰 효율을 50-70% 향상시킵니다.

## 기능

- **이슈 생성**: 제목, 설명, 우선순위 설정
- **이슈 조회**: identifier(BYU-125 등)로 조회
- **이슈 업데이트**: 상태 변경 (In Progress, Done 등)
- **코멘트 추가**: 이슈에 코멘트 달기
- **이슈 삭제**

## 설치

### Claude Code Plugin으로 설치

```bash
claude /plugin add https://github.com/lbo728/linear-simple-skill
```

### 환경변수 설정

`~/.zshrc` 또는 `~/.bashrc`에 추가:

```bash
export LINEAR_API_KEY="lin_api_xxxxx"
```

## 사용법

자연어로 지시하면 됩니다:

```
"BYU-125 조회해줘"
"API 버그 수정 이슈 만들어줘"
"BYU-125 상태를 In Progress로 변경해"
"BYU-125에 '작업 시작' 코멘트 달아줘"
"최근 이슈 10개 보여줘"
```

## MCP vs Skill 토큰 효율 비교

| 방식 | 10번 작업 시 토큰 |
|------|------------------|
| MCP | ~570,000 토큰 |
| Skill | ~520,000 토큰 |
| **절약** | **~50,000 토큰 (9%)** |

긴 대화에서는 효율 차이가 더 커집니다 (최대 99% 절약 가능).

## 파일 구조

```
linear-simple/
├── SKILL.md                      # 메인 가이드
└── references/
    └── graphql-patterns.md       # 고급 쿼리 패턴
```

## 라이선스

MIT
