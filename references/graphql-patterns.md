# Linear GraphQL Advanced Patterns

## 필터링 쿼리

### 상태별 이슈 조회
```bash
curl -s -X POST https://api.linear.app/graphql \
  -H "Authorization: $LINEAR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"query{issues(filter:{state:{name:{eq:\"In Progress\"}},team:{key:{eq:\"BYU\"}}}){nodes{id identifier title}}}"}'
```

### 우선순위별 이슈 조회
```bash
curl -s -X POST https://api.linear.app/graphql \
  -H "Authorization: $LINEAR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"query{issues(filter:{priority:{eq:1},team:{key:{eq:\"BYU\"}}}){nodes{id identifier title priority}}}"}'
```

### 최근 수정된 이슈
```bash
curl -s -X POST https://api.linear.app/graphql \
  -H "Authorization: $LINEAR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"query{issues(first:10,orderBy:updatedAt,filter:{team:{key:{eq:\"BYU\"}}}){nodes{id identifier title updatedAt}}}"}'
```

## 상세 정보 조회

### 이슈 + 코멘트 조회
```bash
curl -s -X POST https://api.linear.app/graphql \
  -H "Authorization: $LINEAR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"query{issue(id:\"BYU-125\"){id identifier title description state{name} comments{nodes{body createdAt}}}}"}'
```

### 이슈 + 라벨 조회
```bash
curl -s -X POST https://api.linear.app/graphql \
  -H "Authorization: $LINEAR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"query{issue(id:\"BYU-125\"){id identifier title labels{nodes{name color}}}}"}'
```

## 복합 수정

### 이슈 생성 (전체 옵션)
```bash
curl -s -X POST https://api.linear.app/graphql \
  -H "Authorization: $LINEAR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"mutation{issueCreate(input:{title:\"제목\" teamId:\"b0f5047d-bebe-4a1a-8376-58135e7514bb\" description:\"상세 설명\" priority:2 stateId:\"8cae7728-307a-4dbb-8505-25a5c034750c\"}){issue{id identifier title url}}}"}'
```

### 이슈 복합 업데이트
```bash
curl -s -X POST https://api.linear.app/graphql \
  -H "Authorization: $LINEAR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"mutation{issueUpdate(id:\"issue-uuid\",input:{title:\"새 제목\" description:\"새 설명\" priority:1 stateId:\"state-uuid\"}){issue{id identifier title state{name}}}}"}'
```

## 라벨 관리

### 라벨 목록 조회
```bash
curl -s -X POST https://api.linear.app/graphql \
  -H "Authorization: $LINEAR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"query{issueLabels{nodes{id name color}}}"}'
```

### 이슈에 라벨 추가
```bash
curl -s -X POST https://api.linear.app/graphql \
  -H "Authorization: $LINEAR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"mutation{issueUpdate(id:\"issue-uuid\",input:{labelIds:[\"label-uuid\"]}){issue{id labels{nodes{name}}}}}"}'
```

## 검색

### 텍스트 검색
```bash
curl -s -X POST https://api.linear.app/graphql \
  -H "Authorization: $LINEAR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"query{searchIssues(term:\"버그\",first:10){nodes{id identifier title}}}"}'
```

## 페이지네이션

### 커서 기반 페이지네이션
```bash
# 첫 페이지
curl -s -X POST https://api.linear.app/graphql \
  -H "Authorization: $LINEAR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"query{issues(first:10,filter:{team:{key:{eq:\"BYU\"}}}){nodes{id identifier title}pageInfo{hasNextPage endCursor}}}"}'

# 다음 페이지 (endCursor 값 사용)
curl -s -X POST https://api.linear.app/graphql \
  -H "Authorization: $LINEAR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"query{issues(first:10,after:\"cursor-value\",filter:{team:{key:{eq:\"BYU\"}}}){nodes{id identifier title}pageInfo{hasNextPage endCursor}}}"}'
```

## 사이클/스프린트 관리

### 현재 사이클 조회
```bash
curl -s -X POST https://api.linear.app/graphql \
  -H "Authorization: $LINEAR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"query{cycles(filter:{team:{key:{eq:\"BYU\"}},isActive:{eq:true}}){nodes{id name startsAt endsAt}}}"}'
```

### 이슈를 사이클에 추가
```bash
curl -s -X POST https://api.linear.app/graphql \
  -H "Authorization: $LINEAR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"mutation{issueUpdate(id:\"issue-uuid\",input:{cycleId:\"cycle-uuid\"}){issue{id cycle{name}}}}"}'
```
