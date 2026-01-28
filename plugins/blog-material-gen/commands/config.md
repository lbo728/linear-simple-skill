---
description: Open config.json in editor for direct editing
allowed-tools: Bash(ls:*), Bash(open:*), Bash(xdg-open:*), Bash(code:*), Bash(vim:*), Bash(nano:*)
---

# Open Config File

**Command**: `/blog-material-gen:config`

**Purpose**: Open the config.json file in your default editor for direct editing.

**Prerequisites**:
- Configuration file exists at `~/.config/blog-material-gen/config.json`

**Workflow**:
1. Check if config file exists
2. Open file in user's default editor

---

## Step 1: Check Config File

Check if config file exists:

```bash
ls ~/.config/blog-material-gen/config.json 2>/dev/null
```

### If config.json doesn't exist:
- Show message: "❌ Config file not found. Please run `/blog-material-gen:setup` first."
- Exit command

### If config exists:
- Proceed to Step 2

---

## Step 2: Open in Editor

Open the config file in the user's default editor.

**macOS**:
```bash
open ~/.config/blog-material-gen/config.json
```

**Linux**:
```bash
xdg-open ~/.config/blog-material-gen/config.json
```

**Windows (WSL)**:
```bash
explorer.exe $(wslpath -w ~/.config/blog-material-gen/config.json)
```

**Alternative (if VS Code is installed)**:
```bash
code ~/.config/blog-material-gen/config.json
```

After opening, show this message:

```
✅ Opening config file in your default editor...

📝 Config file location:
~/.config/blog-material-gen/config.json

💡 Tips:
- Available providers: "openai", "anthropic", "google"
- After editing, save the file
- Changes take effect on next run

⚠️  Important:
- Ensure valid JSON format
- Required fields: api_key, database_id
- LLM config is optional
```

---

## Config Schema Reference

### Minimal Config (Notion only)
```json
{
  "api_key": "secret_xxx",
  "database_id": "abc123"
}
```

### Full Config (All features)
```json
{
  "api_key": "secret_xxx",
  "database_id": "abc123",
  "database_name": "Blog Ideas",
  "slack_webhook_url": "https://hooks.slack.com/services/...",
  "llm": {
    "provider": "google",
    "api_key": "AIza...",
    "model": "gemini-1.5-flash"
  }
}
```

### LLM Providers

**OpenAI**:
```json
"llm": {
  "provider": "openai",
  "api_key": "sk-...",
  "model": "gpt-4o-mini"
}
```

**Anthropic**:
```json
"llm": {
  "provider": "anthropic",
  "api_key": "sk-ant-...",
  "model": "claude-3-5-haiku-20241022"
}
```

**Google Gemini** (Recommended - Free tier):
```json
"llm": {
  "provider": "google",
  "api_key": "AIza...",
  "model": "gemini-1.5-flash"
}
```

---

## Tips

1. **Backup before editing**: Copy config.json before making changes
2. **JSON Validation**: Ensure valid JSON syntax (use jsonlint.com)
3. **API Keys**: Get keys from provider websites:
   - OpenAI: https://platform.openai.com/api-keys
   - Anthropic: https://console.anthropic.com/settings/keys
   - Google: https://aistudio.google.com/app/apikey
4. **Test after editing**: Run `/blog-material-gen` to verify changes

---

## Troubleshooting

### Invalid JSON
- Error message will show syntax error location
- Use online JSON validator to fix
- Restore from backup if needed

### Missing Required Fields
- `api_key` and `database_id` are required
- Other fields are optional
