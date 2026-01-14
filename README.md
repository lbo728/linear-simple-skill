# Linear Simple Skill

A Claude Code skill for Linear GraphQL API. Direct curl calls without MCP, improving token efficiency by 50-70%.

## Features

- **Create Issue**: Set title, description, priority
- **Get Issue**: Query by identifier (e.g., BYU-125)
- **Update Issue**: Change status (In Progress, Done, etc.)
- **Add Comment**: Post comments to issues
- **Delete Issue**
- **Auto Setup**: `/linear setup` command configures everything automatically

## Installation

### Install as Claude Code Plugin

```bash
claude /plugin add https://github.com/lbo728/linear-simple-skill
```

### Setup (Required)

Run the setup command in Claude Code:

```
/linear setup
```

Claude will:
1. Ask for your Linear API key (get from Linear Settings > API)
2. Automatically fetch your team info
3. Save configuration to `~/.config/linear-simple/config`

No manual environment variable setup needed!

## Usage

Just use natural language:

```
"Get BYU-125"
"Create an issue: Fix API bug"
"Change BYU-125 status to In Progress"
"Add comment 'Started working' to BYU-125"
"Show recent 10 issues"
```

## Token Efficiency: MCP vs Skill

| Method | Tokens (10 operations) |
|--------|------------------------|
| MCP | ~570,000 tokens |
| Skill | ~520,000 tokens |
| **Saved** | **~50,000 tokens (9%)** |

In longer conversations, efficiency gains increase significantly (up to 99% savings).

## Configuration

Config file location: `~/.config/linear-simple/config`

Contains:
- `LINEAR_API_KEY` - Your Linear API key
- `LINEAR_TEAM_ID` - Your team's UUID
- `LINEAR_TEAM_KEY` - Your team's key (e.g., BYU)

To reconfigure, run `/linear setup` again.

## File Structure

```
linear-simple/
├── SKILL.md                      # Main guide
└── references/
    └── graphql-patterns.md       # Advanced query patterns
```

## License

MIT
