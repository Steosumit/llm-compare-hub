# Function Reference Guide

Quick reference for all functions in the LLM Compare Hub codebase.
> Suggestion: read code directly if you understand TS/Python well.

---

## Frontend Functions

### App.tsx
| Function | Purpose |
|----------|---------|
| `App()` | Root component that sets up providers, routing, and global UI elements |

---

### Index.tsx (Main Page)

| Function | Purpose | Parameters | Returns |
|----------|---------|------------|---------|
| `fetchSessionId()` | Initialize session with backend, get unique session ID | - | `void` |
| `addPromptCard(patternType?)` | Create new prompt card with optional pattern template | `patternType?: string` | `void` |
| `deletePromptCard(id)` | Remove prompt card from UI | `id: string` | `void` |
| `handleEnableToggle(id, enabled)` | Toggle enable/disable state of prompt card | `id: string, enabled: boolean` | `void` |
| `handleSendPrompt(cardId, prompt, model)` | Send individual prompt to backend API | `cardId: string, prompt: string, model: string` | `Promise<void>` |
| `handleSendAllPrompts()` | Batch send all enabled prompts with staggered timing | - | `void` |

**State Variables:**
- `promptCards`: Array of prompt card configurations
- `responses`: Array of LLM responses with status
- `settingsOpen`: Boolean for settings dialog visibility
- `rememberChatHistory`: Boolean for chat history feature
- `sessionId`: Unique session identifier string

---

### Components

#### Toolbar.tsx
| Function | Purpose | Parameters | Returns |
|----------|---------|------------|---------|
| `handleCopySessionId()` | Copy session ID to clipboard | - | `Promise<void>` |

**Props:**
- `onAddPromptPattern: (pattern: PatternType) => void`
- `onSettingsClick: () => void`
- `sessionId?: string`

---

#### PromptCard.tsx
| Function | Purpose | Parameters | Returns |
|----------|---------|------------|---------|
| `handleCopy()` | Copy prompt text to clipboard | - | `Promise<void>` |
| `handleSend()` | Validate and send prompt to parent handler | - | `void` |

**Props:**
- `id: string` - Unique card identifier
- `initialPrompt?: string` - Pre-filled prompt text
- `patternType?: PatternType` - Type of prompt pattern
- `enabled?: boolean` - Card active state
- `onDelete: (id: string) => void` - Delete callback
- `onSend: (id: string, prompt: string, model: string) => void` - Send callback
- `onEnableToggle?: (id: string, enabled: boolean) => void` - Toggle callback

**State Variables:**
- `prompt`: Current prompt text
- `selectedModel`: Selected LLM model

---

#### EvaluationPanel.tsx
| Function | Purpose | Parameters | Returns |
|----------|---------|------------|---------|
| `getStatusColor(status)` | Return CSS class for status badge color | `status: string` | `string` |

**Props:**
- `responses: Response[]` - Array of response objects to display

---

#### SettingsDialog.tsx
| Function | Purpose | Parameters | Returns |
|----------|---------|------------|---------|
| `toggleTokenVisibility(provider)` | Show/hide API token for provider | `provider: string` | `void` |
| `handleTokenChange(provider, value)` | Update token value for provider | `provider: string, value: string` | `void` |
| `handleSave()` | Save API tokens to localStorage | - | `void` |

**Props:**
- `open: boolean` - Dialog visibility
- `onOpenChange: (open: boolean) => void` - Visibility change handler

**State Variables:**
- `showTokens`: Record<string, boolean> - Token visibility per provider
- `tokens`: Object with openai, gemini, claude token values

---

### Utility Files

#### patternTemplates.ts
| Export | Type | Purpose |
|--------|------|---------|
| `patternTemplates` | `const object` | Contains all prompt template strings (20+ patterns) |
| `PatternType` | `type` | TypeScript type for pattern keys |
| `patternNames` | `Record<PatternType, string>` | Human-readable names for UI display |

**Pattern Categories:**
1. **Basic**: cot, meta, persona, template, refinement, alternatives
2. **Requirements**: requirementsSimulator, specificationDisambiguation
3. **System Design**: apiGenerator, apiSimulator, fewShotCodeExampleGeneration, dslCreation, architecturalPossibilities, changeRequestSimulation
4. **Code Quality**: codeClustering, intermediateAbstraction, principledCode, hiddenAssumptions
5. **Refactoring**: pseudoCodeRefactoring, dataGuidedRefactoring

---

## Backend Functions

### main.py (FastAPI Server)

| Endpoint | Method | Function | Purpose | Parameters | Returns |
|----------|--------|----------|---------|------------|---------|
| `/` | GET | `root()` | Initialize session and health check | - | `{message, session_id, status}` |
| `/hello/{name}` | GET | `say_hello(name)` | Simple health check | `name: str` | `{message}` |
| `/send` | POST | `handle_prompt_request(request)` | Process prompt and return LLM response | `request: Response` | `Response` |

**Global Variables:**
- `app`: FastAPI application instance
- `chat_sessions`: Dictionary storing LLMRequestHandler instances by ID

**Middleware:**
- CORS middleware with wildcard origins for development

---

### llm_requests.py

#### Class: LLMRequestHandler

| Method | Purpose | Parameters | Returns |
|--------|---------|------------|---------|
| `__init__(response)` | Initialize LLM handler with request details | `response: Response` | - |
| `send()` | Send prompt to LLM API and return response | - | Response object |

**Instance Attributes:**
- `chat_agent`: Chat session object for history preservation
- `prompt`: User prompt text
- `model`: LLM model identifier
- `rememberHistory`: Boolean for context preservation
- `client`: LLM API client (Google Gemini)

**Logic Flow:**
```
if rememberHistory:
    → Use chat_agent.send_message() (preserves context)
else:
    → Use client.models.generate_content() (stateless)
```

---

### models.py

#### Class: Response (Pydantic Model)

| Field | Type | Default | Purpose |
|-------|------|---------|---------|
| `id` | `str` | Required | Unique identifier for request/response |
| `model` | `str` | Required | LLM model identifier |
| `prompt` | `str` | Required | User input prompt |
| `response` | `str \| None` | `None` | LLM response text |
| `timestamp` | `datetime` | Required | Request creation time |
| `status` | `str \| None` | `None` | Status: "pending", "success", "error" |
| `rememberHistory` | `bool` | `False` | Enable conversation history |

---

## Data Interfaces

### Response Interface (Frontend)
```typescript
interface Response {
  id: string;
  model: string;
  prompt: string;
  response: string;
  timestamp: Date;
  status: 'pending' | 'success' | 'error';
  rememberHistory: boolean;
}
```

### PromptCardData Interface
```typescript
interface PromptCardData {
  id: string;
  prompt: string;
  patternType?: string;
  enabled: boolean;
}
```

### SessionResponse Interface
```typescript
interface SessionResponse {
  message: string;
  session_id: string;
  status: string;
}
```

---

## API Endpoints Reference

### GET /
**Purpose:** Initialize session and check server health

**Response:**
```json
{
  "message": "server is working, cool...",
  "session_id": "uuid-v4-string",
  "status": "connected"
}
```

---

### POST /send
**Purpose:** Send prompt to LLM and receive response

**Request:**
```json
{
  "id": "session-or-request-id",
  "model": "gemini-2.5-flash",
  "prompt": "Your prompt text here",
  "timestamp": "2025-11-13T12:00:00.000Z",
  "rememberHistory": true
}
```

**Response (Success):**
```json
{
  "id": "session-or-request-id",
  "model": "gemini-2.5-flash",
  "prompt": "Your prompt text here",
  "response": "LLM generated response text",
  "timestamp": "2025-11-13T12:00:00.000Z",
  "status": "success",
  "rememberHistory": true
}
```

**Response (Error):**
```json
{
  "id": "session-or-request-id",
  "model": "gemini-2.5-flash",
  "prompt": "Your prompt text here",
  "response": "Error message or exception string",
  "timestamp": "2025-11-13T12:00:00.000Z",
  "status": "error",
  "rememberHistory": true
}
```

---

## Common Workflows

### 1. Adding a New Prompt Pattern
1. Add pattern template to `patternTemplates` object in `patternTemplates.ts`
2. Add pattern name to `patternNames` record
3. Add pattern to appropriate group in `Toolbar.tsx` `patternGroups`
4. TypeScript will automatically include in `PatternType` union

### 2. Adding a New LLM Provider
**Backend (llm_requests.py):**
```python
# In __init__ method:
if response.model == "gpt-4":
    self.client = OpenAI(api_key=OPENAI_KEY)
    # Create chat session if needed
```

**Frontend (PromptCard.tsx):**
```typescript
// Add to models array:
{ value: "gpt-4", label: "GPT-4" }
```

### 3. Processing a Prompt Request
```
User fills prompt → PromptCard.handleSend() 
  → Index.handleSendPrompt() 
  → POST /send 
  → main.handle_prompt_request() 
  → LLMRequestHandler.send() 
  → Gemini API 
  → Response updated → UI updated
```

### 4. Enabling Chat History
```
User toggles "Remember Chat History" 
  → rememberChatHistory = true 
  → handleSendPrompt() includes history flag 
  → Backend checks chat_sessions 
  → Reuses existing LLMRequestHandler 
  → Context preserved across requests
```

---

## Environment Variables

### Backend (.env)
```
API_KEY=your_google_gemini_api_key
```

### Frontend (localStorage)
```
openai_token=sk-...
gemini_token=AI...
claude_token=sk-ant-...
```

---

## Development Commands

### Frontend
```bash
npm run dev          # Start dev server (Vite)
npm run build        # Production build
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

### Backend
```bash
python main.py       # Start FastAPI server
uvicorn main:app --reload --port 8000  # Dev mode with auto-reload
```

---

## Error Handling Patterns

### Frontend
```typescript
try {
  const res = await fetch(SEND_URL, {...});
  if (!res.ok) throw new Error("Network response was not ok");
  // Success handling
} catch (error: any) {
  // Error handling with toast notification
  setResponses(prev => prev.map(resp => 
    resp.id === id ? {...resp, status: 'error', response: error.message} : resp
  ));
}
```

### Backend
```python
try:
    # Process request
    return request  # Success
except Exception as e:
    request.response = str(e)
    request.status = "error"
    return request  # Error with details
```

---

## Testing Endpoints

### Using curl
```bash
# Health check
curl http://127.0.0.1:8000/

# Send prompt
curl -X POST http://127.0.0.1:8000/send \
  -H "Content-Type: application/json" \
  -d '{
    "id": "test-123",
    "model": "gemini-2.5-flash",
    "prompt": "Hello, how are you?",
    "timestamp": "2025-11-13T12:00:00",
    "rememberHistory": false
  }'
```

### Using test_main.http
See `llm-compare-server/test_main.http` for ready-to-use HTTP requests.

---

## Debugging Tips

1. **Frontend not connecting to backend:**
   - Check `SEND_URL` in Index.tsx points to correct port
   - Verify CORS middleware in main.py allows frontend origin
   - Check browser console for CORS errors

2. **API key errors:**
   - Ensure `.env` file exists in `llm-compare-server/`
   - Verify `API_KEY` is set correctly
   - Check `load_dotenv()` is called before accessing `os.getenv()`

3. **Chat history not working:**
   - Verify `rememberChatHistory` toggle is ON
   - Check backend `chat_sessions` dictionary has entry for session ID
   - Confirm same `id` is used across requests

4. **Responses not showing:**
   - Check Network tab for API call success
   - Verify response status in state
   - Check EvaluationPanel is receiving responses array

---

## Performance Considerations

- **Frontend**: TanStack Query provides caching and deduplication
- **Backend**: Session dictionary grows indefinitely (TODO: implement cleanup)
- **API Calls**: Staggered timing (200ms) for batch sends to avoid rate limits
- **UI Updates**: React state batching for efficient re-renders

---

## Security Best Practices

1. **Never commit API keys** - Use `.env` and `.gitignore`
2. **Validate all inputs** - Pydantic models on backend
3. **Sanitize prompts** - Prevent injection attacks
4. **Use HTTPS** - In production environments
5. **Implement rate limiting** - Prevent abuse
6. **Add authentication** - For production deployment

---

This reference guide provides quick access to all functions and their purposes. For detailed architecture and data flow, see [ARCHITECTURE.md](./ARCHITECTURE.md).

