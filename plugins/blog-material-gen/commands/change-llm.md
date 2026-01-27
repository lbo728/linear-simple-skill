---
description: Change LLM provider, model, or API key without re-running full setup
allowed-tools: Read, Write, AskUserQuestion
---

# Change LLM Provider

**Command**: `/blog-material-gen:change-llm`

**Purpose**: Change LLM provider, model, or API key without re-running full setup.

**Prerequisites**:
- Configuration file exists at `~/.config/blog-material-gen/config.json`
- At least Notion API key and Database ID configured

**Workflow**:
1. Read current config
2. Display current LLM settings
3. Ask what to change (Provider, Model, API Key, Disable)
4. Update config.json
5. Confirm changes

## Step 1: Read Current Configuration

Use Read tool to load `~/.config/blog-material-gen/config.json`.

### If config.json doesn't exist:
- Show error: "❌ Configuration file not found. Please run `/blog-material-gen:setup` first."
- Exit command

### If config exists:
- Parse JSON
- Extract `llm` object (if exists)
- Proceed to Step 2

## Step 2: Display Current LLM Settings

### If `llm` object exists:
Show current configuration:
```
📌 현재 LLM 설정:
- Provider: {provider}
- Model: {model}
- API Key: {api_key first 10 chars}...
```

### If `llm` object doesn't exist:
Show message:
```
📌 현재 LLM이 설정되어 있지 않습니다.
```

Proceed to Step 3.

## Step 3: Ask What to Change

Use **AskUserQuestion**:
- Question: "무엇을 변경하시겠습니까?"
- Options:
  - **Provider** - "Provider 변경 (OpenAI, Anthropic, Google)"
  - **Model** - "Model 변경 (현재 provider 내)"
  - **API Key** - "API Key 업데이트"
  - **Disable** - "LLM 비활성화"
  - **Cancel** - "취소"

### If Provider Selected:
- Go to Step 4

### If Model Selected:
- Go to Step 5

### If API Key Selected:
- Go to Step 6

### If Disable Selected:
- Go to Step 7

### If Cancel:
- Exit command

## Step 4: Change Provider

Use **AskUserQuestion**:
- Question: "새로운 Provider를 선택해주세요."
- Options:
  - **OpenAI** - "OpenAI (gpt-4o-mini, gpt-4o)"
  - **Anthropic** - "Anthropic (Claude 3.5 Haiku, Sonnet)"
  - **Google** - "Google Gemini (Flash, Pro)"

### After selection:
1. Ask for new API key (same flow as setup.md Step 6)
2. Validate API key
3. Ask for model selection
4. Update config.json with new `llm` object
5. Go to Step 8 (Confirm)

### If OpenAI Selected:

#### Step 4.1: Get OpenAI API Key

Use **AskUserQuestion**:
- Question: "OpenAI API 키를 입력해주세요.\n\n📌 API 키 생성 방법:\n1. https://platform.openai.com/api-keys 접속\n2. 'Create new secret key' 클릭\n3. 키 복사 (sk-... 형식)"
- Text input required

#### Step 4.2: Validate OpenAI API Key

Test the API key:
```bash
curl -s -X GET 'https://api.openai.com/v1/models' \
  -H 'Authorization: Bearer API_KEY'
```

- If response contains `"object": "list"`: API key is valid, proceed to Step 4.3
- If response contains `"error"`: Show error "❌ API 키가 유효하지 않습니다. 키를 다시 확인해주세요."
  - Ask user to re-enter API key

#### Step 4.3: Ask for Model Selection

Use **AskUserQuestion**:
- Question: "사용할 모델을 선택해주세요."
- Options:
  - **gpt-4o-mini** - "gpt-4o-mini (기본, 비용 효율적)"
  - **gpt-4o** - "gpt-4o (고급, 더 정확함)"

### If Anthropic Selected:

#### Step 4.1: Get Anthropic API Key

Use **AskUserQuestion**:
- Question: "Anthropic API 키를 입력해주세요.\n\n📌 API 키 생성 방법:\n1. https://console.anthropic.com/settings/keys 접속\n2. 'Create Key' 클릭\n3. 키 복사 (sk-ant-... 형식)"
- Text input required

#### Step 4.2: Validate Anthropic API Key

Test the API key:
```bash
curl -s -X POST 'https://api.anthropic.com/v1/messages' \
  -H 'x-api-key: API_KEY' \
  -H 'anthropic-version: 2023-06-01' \
  -H 'content-type: application/json' \
  -d '{"model":"claude-3-5-haiku-20241022","max_tokens":1,"messages":[{"role":"user","content":"test"}]}'
```

- If response contains `"id"`: API key is valid, proceed to Step 4.3
- If response contains `"error"`: Show error "❌ API 키가 유효하지 않습니다. 키를 다시 확인해주세요."
  - Ask user to re-enter API key

#### Step 4.3: Ask for Model Selection

Use **AskUserQuestion**:
- Question: "사용할 모델을 선택해주세요."
- Options:
  - **claude-3-5-haiku-20241022** - "Claude 3.5 Haiku (기본, 빠름)"
  - **claude-3-5-sonnet-20241022** - "Claude 3.5 Sonnet (고급, 정확함)"
  - **claude-3-opus-20240229** - "Claude 3 Opus (최고급)"

### If Google Selected:

#### Step 4.1: Get Google API Key

Use **AskUserQuestion**:
- Question: "Google AI Studio API 키를 입력해주세요.\n\n📌 API 키 생성 방법:\n1. https://aistudio.google.com/app/apikey 접속\n2. 'Create API Key' 클릭\n3. 키 복사 (AIza... 형식)\n\n💡 무료 티어: 분당 15 요청, 일일 1500 요청"
- Text input required

#### Step 4.2: Validate Google API Key

Test the API key:
```bash
curl -s "https://generativelanguage.googleapis.com/v1beta/models?key=API_KEY"
```

- If response contains `"models"`: API key is valid, proceed to Step 4.3
- If response contains `"error"`: Show error "❌ API 키가 유효하지 않습니다. 키를 다시 확인해주세요."
  - Ask user to re-enter API key

#### Step 4.3: Ask for Model Selection

Use **AskUserQuestion**:
- Question: "사용할 모델을 선택해주세요."
- Options:
  - **gemini-1.5-flash** - "Gemini 1.5 Flash (기본, 무료 티어) - 추천 ⭐"
  - **gemini-1.5-pro** - "Gemini 1.5 Pro (고급, 더 정확함)"

## Step 5: Change Model (Same Provider)

### If current provider is OpenAI:
Use **AskUserQuestion**:
- Question: "새로운 모델을 선택해주세요."
- Options:
  - **gpt-4o-mini** - "gpt-4o-mini (기본, 비용 효율적)"
  - **gpt-4o** - "gpt-4o (고급, 더 정확함)"

### If current provider is Anthropic:
Use **AskUserQuestion**:
- Question: "새로운 모델을 선택해주세요."
- Options:
  - **claude-3-5-haiku-20241022** - "Claude 3.5 Haiku (기본, 빠름)"
  - **claude-3-5-sonnet-20241022** - "Claude 3.5 Sonnet (고급, 정확함)"
  - **claude-3-opus-20240229** - "Claude 3 Opus (최고급)"

### If current provider is Google:
Use **AskUserQuestion**:
- Question: "새로운 모델을 선택해주세요."
- Options:
  - **gemini-1.5-flash** - "Gemini 1.5 Flash (기본, 무료 티어) - 추천 ⭐"
  - **gemini-1.5-pro** - "Gemini 1.5 Pro (고급, 더 정확함)"

### After selection:
1. Update config.json `llm.model` field
2. Go to Step 8 (Confirm)

## Step 6: Update API Key

Use **AskUserQuestion**:
- Question: "새로운 API 키를 입력해주세요.\n\n현재 Provider: {current_provider}"
- Text input required

### After input:
1. Validate API key (same validation as setup.md)
2. If valid: Update config.json `llm.api_key` field
3. If invalid: Show error and ask to re-enter
4. Go to Step 8 (Confirm)

## Step 7: Disable LLM

Use **AskUserQuestion**:
- Question: "LLM 기능을 비활성화하시겠습니까?\n\n⚠️  블로그 초안 자동 생성 기능이 비활성화됩니다."
- Options:
  - **Yes** - "비활성화"
  - **No** - "취소"

### If Yes:
1. Remove `llm` object from config.json
2. Write updated config
3. Show message: "✅ LLM 기능이 비활성화되었습니다."
4. Exit command

### If No:
- Go back to Step 3

## Step 8: Confirm Changes

Show confirmation message based on what changed:

### If Provider changed:
```
✅ LLM Provider가 변경되었습니다!

📌 새로운 설정:
- Provider: {new_provider}
- Model: {new_model}
- API Key: {api_key first 10 chars}...

💡 다음 실행부터 새로운 Provider가 사용됩니다.
```

### If Model changed:
```
✅ Model이 변경되었습니다!

📌 새로운 설정:
- Provider: {provider}
- Model: {new_model}

💡 다음 실행부터 새로운 Model이 사용됩니다.
```

### If API Key changed:
```
✅ API Key가 업데이트되었습니다!

📌 현재 설정:
- Provider: {provider}
- Model: {model}
- API Key: {api_key first 10 chars}...
```

Exit command.
