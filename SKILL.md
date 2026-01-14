---
name: linear-simple
description: |
  Direct Linear GraphQL API calls without MCP. Performs issue CRUD via curl.
  Use when: (1) Creating/reading/updating/deleting Linear issues, (2) Adding comments,
  (3) BYU-XXX format identifier mentioned, (4) "linear" keyword included.
  Trigger examples: "Get BYU-125", "Create issue", "Change status to Done"
---

# Linear Simple Skill

Direct Linear GraphQL API call guide.

## Setup

Set environment variable in `.zshrc` or `.bashrc`:
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

### Get Issue (by identifier)
```bash
curl -s -X POST https://api.linear.app/graphql \
  -H "Authorization: $LINEAR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"query{issue(id:\"BYU-125\"){id identifier title description state{name} priority url}}"}'
```

### List Issues
```bash
curl -s -X POST https://api.linear.app/graphql \
  -H "Authorization: $LINEAR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"query{issues(first:10,filter:{team:{key:{eq:\"BYU\"}}}){nodes{id identifier title state{name} priority}}}"}'
```

### Create Issue
```bash
curl -s -X POST https://api.linear.app/graphql \
  -H "Authorization: $LINEAR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"mutation{issueCreate(input:{title:\"Title\" teamId:\"b0f5047d-bebe-4a1a-8376-58135e7514bb\" description:\"Description\" priority:3}){issue{id identifier title url}}}"}'
```

Priority: 0=none, 1=urgent, 2=high, 3=medium, 4=low

### Update Issue Status
```bash
curl -s -X POST https://api.linear.app/graphql \
  -H "Authorization: $LINEAR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"mutation{issueUpdate(id:\"issue-uuid\",input:{stateId:\"state-uuid\"}){issue{id identifier state{name}}}}"}'
```

### Add Comment
```bash
curl -s -X POST https://api.linear.app/graphql \
  -H "Authorization: $LINEAR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"mutation{commentCreate(input:{issueId:\"issue-uuid\",body:\"Comment content\"}){comment{id body}}}"}'
```

### Delete Issue
```bash
curl -s -X POST https://api.linear.app/graphql \
  -H "Authorization: $LINEAR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"mutation{issueDelete(id:\"issue-uuid\"){success}}"}'
```

## Workflow Examples

### 1. Get Issue and Update Status
```bash
# 1. Get issue to obtain ID
ISSUE=$(curl -s -X POST https://api.linear.app/graphql \
  -H "Authorization: $LINEAR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"query{issue(id:\"BYU-125\"){id}}"}')

# 2. Change status to In Progress
curl -s -X POST https://api.linear.app/graphql \
  -H "Authorization: $LINEAR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"mutation{issueUpdate(id:\"extracted-id\",input:{stateId:\"1999cc0d-e1dc-4cd5-ad45-48efd0def367\"}){issue{state{name}}}}"}'
```

### 2. Update Issue After PR Merge
Add comment + change status to Done:
```bash
# Add comment
curl -s -X POST https://api.linear.app/graphql \
  -H "Authorization: $LINEAR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"mutation{commentCreate(input:{issueId:\"issue-uuid\",body:\"PR merged: https://github.com/...\"}){comment{id}}}"}'

# Change to Done
curl -s -X POST https://api.linear.app/graphql \
  -H "Authorization: $LINEAR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"mutation{issueUpdate(id:\"issue-uuid\",input:{stateId:\"71f4723c-162f-4f3b-b073-97ec170a5aba\"}){issue{state{name}}}}"}'
```

## Error Handling

- **401**: Check API key
- **400**: GraphQL query syntax error
- **429**: Rate limit, retry later

## Advanced Queries

See [references/graphql-patterns.md](references/graphql-patterns.md) for detailed query patterns.
