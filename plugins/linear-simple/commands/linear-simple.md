---
description: Linear API integration - issue CRUD, comments, status changes. Use '/linear-simple setup' to configure.
argument-hint: [action] [args...]
allowed-tools: Bash(curl:*), Bash(mkdir:*), Bash(echo:*), Bash(source:*), Bash(cat:*)
---

# Linear Simple Command

You are handling a Linear API request. The user said: "$ARGUMENTS"

## Available Actions

### Setup (when user says "setup")
1. Ask user for their Linear API key (from Linear Settings > API)
2. Create config directory and save API key:
```bash
mkdir -p ~/.config/linear-simple
echo 'export LINEAR_API_KEY="USER_API_KEY"' > ~/.config/linear-simple/config
```
3. Fetch team info automatically:
```bash
source ~/.config/linear-simple/config
curl -s -X POST https://api.linear.app/graphql \
  -H "Authorization: $LINEAR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"query{teams{nodes{id name key}}}"}'
```
4. Save team ID and key to config
5. Fetch workflow states and save to config
6. Confirm setup complete

### Get Issue (when user mentions XXX-NNN identifier)
```bash
source ~/.config/linear-simple/config
curl -s -X POST https://api.linear.app/graphql \
  -H "Authorization: $LINEAR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"query{issue(id:\"IDENTIFIER\"){id identifier title description state{name} priority url}}"}'
```

### List Issues
```bash
source ~/.config/linear-simple/config
curl -s -X POST https://api.linear.app/graphql \
  -H "Authorization: $LINEAR_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"query\":\"query{issues(first:10,filter:{team:{key:{eq:\\\"$LINEAR_TEAM_KEY\\\"}}}){nodes{id identifier title state{name} priority}}}\"}"
```

### Create Issue
```bash
source ~/.config/linear-simple/config
curl -s -X POST https://api.linear.app/graphql \
  -H "Authorization: $LINEAR_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"query\":\"mutation{issueCreate(input:{title:\\\"TITLE\\\" teamId:\\\"$LINEAR_TEAM_ID\\\" description:\\\"DESC\\\" priority:3}){issue{id identifier title url}}}\"}"
```

### Update Status
1. Get issue ID from identifier
2. Get target state ID
3. Update issue:
```bash
source ~/.config/linear-simple/config
curl -s -X POST https://api.linear.app/graphql \
  -H "Authorization: $LINEAR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"mutation{issueUpdate(id:\"ISSUE_ID\",input:{stateId:\"STATE_ID\"}){issue{id identifier state{name}}}}"}'
```

### Add Comment
```bash
source ~/.config/linear-simple/config
curl -s -X POST https://api.linear.app/graphql \
  -H "Authorization: $LINEAR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"mutation{commentCreate(input:{issueId:\"ISSUE_ID\",body:\"COMMENT\"}){comment{id body}}}"}'
```

## Config Location
`~/.config/linear-simple/config`

## Priority Values
0=none, 1=urgent, 2=high, 3=medium, 4=low

Now execute the appropriate action based on the user's request: "$ARGUMENTS"
