---
name: linear-simple
description: |
  Linear GraphQL API를 직접 호출하는 skill. MCP 없이 curl로 이슈 CRUD 수행.
  사용 시점: (1) Linear 이슈 생성/조회/수정/삭제, (2) 이슈에 코멘트 추가,
  (3) BYU-XXX 형식의 이슈 identifier 언급 시, (4) "linear" 키워드 포함 시.
  트리거 예시: "BYU-125 조회해줘", "이슈 만들어줘", "상태를 Done으로 변경해"
---

# Linear Simple Skill

Linear GraphQL API 직접 호출 가이드.

## Setup

환경변수 설정 (`.zshrc` 또는 `.bashrc`):
```bash
export LINEAR_API_KEY="lin_api_xxxxx"
```

## API Endpoint

`https://api.linear.app/graphql`

## Team Info

- **Team ID**: `b0f5047d-bebe-4a1a-8376-58135e7514bb`
- **Team Key**: `BYU`

## Workflow States

| Name | ID | Type |
|------|-----|------|
| Backlog | `ea0fd788-c9ca-42c3-8a1e-360ba329bbe6` | backlog |
| Todo | `8cae7728-307a-4dbb-8505-25a5c034750c` | unstarted |
| In Progress | `1999cc0d-e1dc-4cd5-ad45-48efd0def367` | started |
| In Review | `6c8f58ae-c489-4fc0-bbe3-15bfbcdc517e` | started |
| Done | `71f4723c-162f-4f3b-b073-97ec170a5aba` | completed |
| Canceled | `8ebc3a3a-2584-44cf-b9a0-e33de021f409` | canceled |

## Quick Reference

### 이슈 조회 (by identifier)
```bash
curl -s -X POST https://api.linear.app/graphql \
  -H "Authorization: $LINEAR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"query{issue(id:\"BYU-125\"){id identifier title description state{name} priority url}}"}'
```

### 이슈 목록 조회
```bash
curl -s -X POST https://api.linear.app/graphql \
  -H "Authorization: $LINEAR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"query{issues(first:10,filter:{team:{key:{eq:\"BYU\"}}}){nodes{id identifier title state{name} priority}}}"}'
```

### 이슈 생성
```bash
curl -s -X POST https://api.linear.app/graphql \
  -H "Authorization: $LINEAR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"mutation{issueCreate(input:{title:\"제목\" teamId:\"b0f5047d-bebe-4a1a-8376-58135e7514bb\" description:\"설명\" priority:3}){issue{id identifier title url}}}"}'
```

Priority: 0=none, 1=urgent, 2=high, 3=medium, 4=low

### 이슈 상태 변경
```bash
curl -s -X POST https://api.linear.app/graphql \
  -H "Authorization: $LINEAR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"mutation{issueUpdate(id:\"issue-uuid\",input:{stateId:\"state-uuid\"}){issue{id identifier state{name}}}}"}'
```

### 코멘트 추가
```bash
curl -s -X POST https://api.linear.app/graphql \
  -H "Authorization: $LINEAR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"mutation{commentCreate(input:{issueId:\"issue-uuid\",body:\"코멘트 내용\"}){comment{id body}}}"}'
```

### 이슈 삭제
```bash
curl -s -X POST https://api.linear.app/graphql \
  -H "Authorization: $LINEAR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"mutation{issueDelete(id:\"issue-uuid\"){success}}"}'
```

## Workflow Examples

### 1. 이슈 조회 후 상태 변경
```bash
# 1. 이슈 조회하여 ID 획득
ISSUE=$(curl -s -X POST https://api.linear.app/graphql \
  -H "Authorization: $LINEAR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"query{issue(id:\"BYU-125\"){id}}"}')

# 2. In Progress로 상태 변경
curl -s -X POST https://api.linear.app/graphql \
  -H "Authorization: $LINEAR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"mutation{issueUpdate(id:\"extracted-id\",input:{stateId:\"1999cc0d-e1dc-4cd5-ad45-48efd0def367\"}){issue{state{name}}}}"}'
```

### 2. PR 완료 후 이슈 업데이트
이슈에 코멘트 추가 + Done 상태로 변경:
```bash
# 코멘트 추가
curl -s -X POST https://api.linear.app/graphql \
  -H "Authorization: $LINEAR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"mutation{commentCreate(input:{issueId:\"issue-uuid\",body:\"PR merged: https://github.com/...\"}){comment{id}}}"}'

# Done으로 변경
curl -s -X POST https://api.linear.app/graphql \
  -H "Authorization: $LINEAR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"mutation{issueUpdate(id:\"issue-uuid\",input:{stateId:\"71f4723c-162f-4f3b-b073-97ec170a5aba\"}){issue{state{name}}}}"}'
```

## Error Handling

- **401**: API 키 확인
- **400**: GraphQL 쿼리 문법 오류
- **429**: Rate limit, 잠시 후 재시도

## Advanced Queries

상세 쿼리 패턴은 [references/graphql-patterns.md](references/graphql-patterns.md) 참조.
