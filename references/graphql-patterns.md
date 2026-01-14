# Linear GraphQL Advanced Patterns

## Filtering Queries

### Get Issues by Status
```bash
curl -s -X POST https://api.linear.app/graphql \
  -H "Authorization: $LINEAR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"query{issues(filter:{state:{name:{eq:\"In Progress\"}},team:{key:{eq:\"BYU\"}}}){nodes{id identifier title}}}"}'
```

### Get Issues by Priority
```bash
curl -s -X POST https://api.linear.app/graphql \
  -H "Authorization: $LINEAR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"query{issues(filter:{priority:{eq:1},team:{key:{eq:\"BYU\"}}}){nodes{id identifier title priority}}}"}'
```

### Get Recently Updated Issues
```bash
curl -s -X POST https://api.linear.app/graphql \
  -H "Authorization: $LINEAR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"query{issues(first:10,orderBy:updatedAt,filter:{team:{key:{eq:\"BYU\"}}}){nodes{id identifier title updatedAt}}}"}'
```

## Detailed Queries

### Get Issue with Comments
```bash
curl -s -X POST https://api.linear.app/graphql \
  -H "Authorization: $LINEAR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"query{issue(id:\"BYU-125\"){id identifier title description state{name} comments{nodes{body createdAt}}}}"}'
```

### Get Issue with Labels
```bash
curl -s -X POST https://api.linear.app/graphql \
  -H "Authorization: $LINEAR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"query{issue(id:\"BYU-125\"){id identifier title labels{nodes{name color}}}}"}'
```

## Complex Mutations

### Create Issue (Full Options)
```bash
curl -s -X POST https://api.linear.app/graphql \
  -H "Authorization: $LINEAR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"mutation{issueCreate(input:{title:\"Title\" teamId:\"b0f5047d-bebe-4a1a-8376-58135e7514bb\" description:\"Description\" priority:2 stateId:\"8cae7728-307a-4dbb-8505-25a5c034750c\"}){issue{id identifier title url}}}"}'
```

### Bulk Update Issue
```bash
curl -s -X POST https://api.linear.app/graphql \
  -H "Authorization: $LINEAR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"mutation{issueUpdate(id:\"issue-uuid\",input:{title:\"New Title\" description:\"New Description\" priority:1 stateId:\"state-uuid\"}){issue{id identifier title state{name}}}}"}'
```

## Label Management

### List Labels
```bash
curl -s -X POST https://api.linear.app/graphql \
  -H "Authorization: $LINEAR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"query{issueLabels{nodes{id name color}}}"}'
```

### Add Label to Issue
```bash
curl -s -X POST https://api.linear.app/graphql \
  -H "Authorization: $LINEAR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"mutation{issueUpdate(id:\"issue-uuid\",input:{labelIds:[\"label-uuid\"]}){issue{id labels{nodes{name}}}}}"}'
```

## Search

### Text Search
```bash
curl -s -X POST https://api.linear.app/graphql \
  -H "Authorization: $LINEAR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"query{searchIssues(term:\"bug\",first:10){nodes{id identifier title}}}"}'
```

## Pagination

### Cursor-based Pagination
```bash
# First page
curl -s -X POST https://api.linear.app/graphql \
  -H "Authorization: $LINEAR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"query{issues(first:10,filter:{team:{key:{eq:\"BYU\"}}}){nodes{id identifier title}pageInfo{hasNextPage endCursor}}}"}'

# Next page (use endCursor value)
curl -s -X POST https://api.linear.app/graphql \
  -H "Authorization: $LINEAR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"query{issues(first:10,after:\"cursor-value\",filter:{team:{key:{eq:\"BYU\"}}}){nodes{id identifier title}pageInfo{hasNextPage endCursor}}}"}'
```

## Cycle/Sprint Management

### Get Active Cycle
```bash
curl -s -X POST https://api.linear.app/graphql \
  -H "Authorization: $LINEAR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"query{cycles(filter:{team:{key:{eq:\"BYU\"}},isActive:{eq:true}}){nodes{id name startsAt endsAt}}}"}'
```

### Add Issue to Cycle
```bash
curl -s -X POST https://api.linear.app/graphql \
  -H "Authorization: $LINEAR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"mutation{issueUpdate(id:\"issue-uuid\",input:{cycleId:\"cycle-uuid\"}){issue{id cycle{name}}}}"}'
```
