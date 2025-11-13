# LLM Compare Hub - Architecture Documentation
## Overview
llm-compare-hub is a personal problem inspiration tool I decided to build to study the behavior of prompts on LLM. It hunched me while studying the course: Prompt Engineering with ChatGPT by Vunderbilt University on coursera. The tool has the initial draft built with lovable for quicy UI development, followed by manual edits, and a mostly hand written FastAPI server that was the other inspiration for building this application
> Build by: steosumit (steosumit@gmail.com)

> Inspired by: Prompt Engineering with ChatGPT by Vanderbilt University on Coursera

---
## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                   FRONTEND (React + Vite)               │
├─────────────────────────────────────────────────────────┤
│  Components Layer:                                      │
│  ├── Toolbar (Pattern selection, Session management)    │
│  ├── PromptCard (Individual prompt with model selector) │
│  ├── EvaluationPanel (Response display)                 │
│  └── SettingsDialog (API token configuration)           │
├─────────────────────────────────────────────────────────┤
│  Pages Layer:                                           │
│  ├── Index (Main application page)                      │
│  └── NotFound (404 page)                                │
├─────────────────────────────────────────────────────────┤
│  State Management:                                      │
│  ├── React Hooks (useState, useEffect)                  │
│  └── TanStack Query (React Query)                       │
├─────────────────────────────────────────────────────────┤
│  Utilities:                                             │
│  ├── patternTemplates.ts (Prompt engineering patterns)  │
│  └── utils.ts (Helper functions)                        │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼ HTTP/REST API
┌─────────────────────────────────────────────────────────┐
│                   BACKEND (FastAPI)                     │
├─────────────────────────────────────────────────────────┤
│  API Endpoints:                                         │
│  ├── GET  / (Session initialization)                    │
│  ├── POST /send (Prompt processing)                     │
│  └── GET  /hello/{name} (Health check)                  │
├─────────────────────────────────────────────────────────┤
│  Request Handling:                                      │
│  ├── LLMRequestHandler (LLM abstraction layer)          │
│  ├── Chat session management                            │
│  └── History preservation                               │
├─────────────────────────────────────────────────────────┤
│  Data Models:                                           │
│  └── Response (Pydantic model)                          │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│              EXTERNAL LLM APIS                          │
│  ├── Google Gemini (gemini-2.5-flash)(Cuurent working)                   │
│  ├── OpenAI GPT (gpt-4, gpt-3.5-turbo)                  │
│  └── Anthropic Claude (claude-3)                        │
└─────────────────────────────────────────────────────────┘
```

---

## Frontend Architecture (Function and Purpose)

### Core Components

#### **1. App.tsx**
**Purpose:** Root application component with routing and global providers.

**Functions:**
- `App()`: Main application wrapper
  - Initializes QueryClient for React Query
  - Provides TooltipProvider for UI tooltips
  - Sets up BrowserRouter for client-side routing
  - Configures toast notifications (Toaster, Sonner)
  - Defines application routes (Index, NotFound)

---

#### **2. Index.tsx** (Main Page)
**Purpose:** Primary application interface for prompt comparison.

**State Management:**
- `promptCards`: Array of prompt card configurations
- `responses`: Array of LLM responses
- `settingsOpen`: Settings dialog visibility state
- `rememberChatHistory`: Chat history persistence toggle
- `sessionId`: Unique session identifier for backend communication

**Functions:**

- `fetchSessionId()`: **[useEffect]**
  - Fetches unique session ID from backend on component mount
  - Generates fallback session ID if backend unavailable
  - Purpose: Initialize communication channel with backend

- `addPromptCard(patternType)`:
  - Creates new prompt card with unique ID
  - Optionally initializes with pattern template
  - Purpose: Add new prompt input area

- `deletePromptCard(id)`:
  - Removes prompt card from state
  - Purpose: Clean up unused prompt cards

- `handleEnableToggle(id, enabled)`:
  - Toggles enabled/disabled state of prompt card
  - Purpose: Control which prompts are active

- `handleSendPrompt(cardId, prompt, model)`:
  - Validates card is enabled
  - Creates response object with pending status
  - Sends POST request to `/send` endpoint
  - Updates response status based on API result
  - Includes chat history if `rememberChatHistory` is enabled
  - Purpose: Send individual prompt to LLM backend

- `handleSendAllPrompts()`:
  - Filters enabled cards with valid prompts
  - Sends all prompts sequentially with staggered timing
  - Purpose: Batch process multiple prompts

**UI Sections:**
- Toolbar with pattern selection
- Chat history toggle
- Prompt cards grid (left panel)
- Evaluation/Response panel (right panel)

---

### Component Details

#### **3. Toolbar.tsx**
**Purpose:** Top navigation bar with pattern selection and session management.

**Props:**
- `onAddPromptPattern`: Callback to add pattern-based prompt
- `onSettingsClick`: Callback to open settings dialog
- `sessionId`: Current session identifier

**State:**
- `copied`: Clipboard copy status indicator

**Functions:**

- `handleCopySessionId()`:
  - Copies session ID to clipboard
  - Shows success/error toast notification
  - Purpose: Allow users to save session ID

**UI Features:**
- Quick access buttons for basic patterns (COT, Meta, Persona, etc.)
- Dropdown menu for developer patterns (Requirements, System Design, Code Quality, Refactoring)
- Session ID display with copy functionality
- Settings button

**Pattern Groups:**
- **Basic Patterns**: cot, meta, persona, template, refinement, alternatives
- **Requirements**: requirementsSimulator, specificationDisambiguation
- **System Design**: apiGenerator, apiSimulator, fewShotCodeExampleGeneration, dslCreation, architecturalPossibilities, changeRequestSimulation
- **Code Quality**: codeClustering, intermediateAbstraction, principledCode, hiddenAssumptions
- **Refactoring**: pseudoCodeRefactoring, dataGuidedRefactoring

---

#### **4. PromptCard.tsx**
**Purpose:** Individual prompt input card with model selection.

**Props:**
- `id`: Unique card identifier
- `initialPrompt`: Pre-filled prompt text
- `patternType`: Type of prompt pattern
- `enabled`: Card active/inactive state
- `onDelete`: Callback to delete card
- `onSend`: Callback to send prompt
- `onEnableToggle`: Callback to toggle card state

**State:**
- `prompt`: Current prompt text
- `selectedModel`: Selected LLM model

**Functions:**

- `handleCopy()`:
  - Copies prompt text to clipboard
  - Shows toast notification
  - Purpose: Allow prompt reuse

- `handleSend()`:
  - Validates card is enabled
  - Validates prompt is not empty
  - Calls `onSend` with prompt and model
  - Purpose: Submit prompt to backend

**UI Features:**
- Model selector dropdown (GPT-4, GPT-3.5, Gemini, Claude)
- Pattern type badge
- Copy, enable/disable, delete buttons
- Textarea for prompt input
- Send button with model name

---

#### **5. EvaluationPanel.tsx**
**Purpose:** Display LLM responses with status indicators.

**Props:**
- `responses`: Array of response objects

**Functions:**

- `getStatusColor(status)`:
  - Returns CSS class for status badge
  - Maps: success → green, error → red, pending → yellow
  - Purpose: Visual status indication

**UI Features:**
- Scrollable response list
- Status badges (success, error, pending)
- Model identification
- Timestamp display
- Prompt preview
- Response text display
- Error message handling

---

#### **6. SettingsDialog.tsx**
**Purpose:** Configuration dialog for API tokens and preferences.

**Props:**
- `open`: Dialog visibility state
- `onOpenChange`: Callback to control dialog state

**State:**
- `showTokens`: Token visibility toggle per provider
- `tokens`: API token values (OpenAI, Gemini, Claude)

**Functions:**

- `toggleTokenVisibility(provider)`:
  - Toggles password/text input type
  - Purpose: Show/hide sensitive API tokens

- `handleTokenChange(provider, value)`:
  - Updates token state for specific provider
  - Purpose: Track token input changes

- `handleSave()`:
  - Saves tokens to localStorage
  - Shows success toast notification
  - Closes dialog
  - Purpose: Persist API configuration

**UI Sections:**
- **API Tokens**: OpenAI, Google Gemini, Anthropic Claude
- **Personal Information**: Name, Role, Company (optional)
- **Preferences**: Theme, Language, Request Timeout
- **Advanced Settings**: Max Tokens, Temperature, Top P, Custom Endpoint

---

### Utilities

#### **7. patternTemplates.ts**
**Purpose:** Define prompt engineering patterns and templates.

**Exports:**

- `patternTemplates`: Object containing all prompt templates
  - Basic patterns (cot, meta, persona, template, refinement, alternatives)
  - Requirements elicitation patterns
  - System design and simulation patterns
  - Code quality patterns
  - Refactoring patterns

- `PatternType`: TypeScript type for pattern keys

- `patternNames`: Human-readable display names for patterns

**Pattern Categories:**
1. **Basic Patterns** (6): Chain of Thought, Meta Language, Persona, Template, Refinement, Alternatives
2. **Requirements** (2): Requirements Simulator, Specification Disambiguation
3. **System Design** (6): API Generator, API Simulator, Few-Shot Examples, DSL Creation, Architectural Possibilities, Change Request Simulation
4. **Code Quality** (4): Code Clustering, Intermediate Abstraction, Principled Code, Hidden Assumptions
5. **Refactoring** (2): Pseudo-Code Refactoring, Data-Guided Refactoring

---

## Backend Architecture

### Core Files

#### **8. main.py** (FastAPI Server)
**Purpose:** REST API server for handling LLM requests.

**Global State:**
- `app`: FastAPI application instance
- `chat_sessions`: Dictionary storing LLMRequestHandler instances by conversation ID

**Middleware:**
- **CORS**: Allows cross-origin requests from frontend
  - Origins: "*" (all)
  - Methods: All
  - Headers: All
  - Credentials: Enabled

**API Endpoints:**

- `GET /`:
  - **Purpose**: Initialize session and health check
  - **Returns**: Session ID, status message
  - **Function**: Generates unique UUID for session tracking

- `GET /hello/{name}`:
  - **Purpose**: Simple health check endpoint
  - **Parameters**: `name` (path parameter)
  - **Returns**: Greeting message

- `POST /send`:
  - **Purpose**: Process prompt and return LLM response
  - **Request Body**: `Response` model (Pydantic)
  - **Function**:
    1. Checks if session exists and history is enabled
    2. Reuses existing handler (preserves history) or creates new one
    3. Calls `llm.send()` to get LLM response
    4. Updates response object with result
    5. Stores handler in `chat_sessions` if history enabled
  - **Returns**: Updated `Response` model with LLM output
  - **Error Handling**: Catches exceptions and returns error status

**Server Configuration:**
- Host: 0.0.0.0
- Port: 8000
- ASGI Server: Uvicorn

---

#### **9. llm_requests.py**
**Purpose:** Abstraction layer for LLM API interactions.

**Dependencies:**
- `google.genai`: Google Gemini API client
- `dotenv`: Environment variable loading
- `os`: Environment access

**Environment Variables:**
- `API_KEY`: Google Gemini API key

**Class: LLMRequestHandler**

**Purpose:** Unified interface for different LLM providers.

**Constructor: `__init__(self, response: Response)`**
- **Parameters**: `response` - Pydantic Response model
- **Attributes Initialized**:
  - `chat_agent`: Chat session object (None initially)
  - `prompt`: User prompt text
  - `model`: Model identifier
  - `rememberHistory`: History persistence flag
- **Model Initialization**:
  - Detects model type from `response.model`
  - Creates appropriate client (currently Gemini only)
  - Creates chat session if history enabled

**Method: `send(self)`**
- **Purpose**: Send prompt to LLM and get response
- **Logic**:
  - If `rememberHistory` is True: Uses `chat_agent.send_message()` (preserves context)
  - If `rememberHistory` is False: Uses `client.models.generate_content()` (stateless)
- **Returns**: Raw response object from LLM API
- **Future**: Can be extended to support multiple LLM providers (OpenAI, Claude, etc.)

---

#### **10. models.py**
**Purpose:** Data models for request/response validation.

**Class: Response** (Pydantic BaseModel)

**Purpose**: Define standard structure for prompt requests and LLM responses.

**Fields:**
- `id`: **str** - Unique identifier for request/response
- `model`: **str** - LLM model identifier (e.g., "gemini-2.5-flash")
- `prompt`: **str** - User input prompt text
- `response`: **str | None** - LLM response text (default: None)
- `timestamp`: **datetime** - Request creation time
- `status`: **str | None** - Request status (pending/success/error, default: None)
- `rememberHistory`: **bool** - Enable conversation history (default: False)

**Features:**
- Automatic validation using Pydantic
- JSON serialization support
- Type safety for API contracts

---

## Data Flow

### 1. Session Initialization Flow
```
Frontend (Index.tsx)
  └─► useEffect (on mount)
      └─► GET http://127.0.0.1:8000/
          └─► Backend (main.py): root()
              └─► Generate UUID session ID
              └─► Return {message, session_id, status}
          ◄─── Response
      ◄─── Store session_id in state
```

### 2. Prompt Submission Flow
```
Frontend (PromptCard.tsx)
  └─► User clicks "Send" button
      └─► handleSend()
          └─► Validate card enabled & prompt not empty
              └─► onSend(id, prompt, model) → Index.tsx
                  └─► handleSendPrompt(cardId, prompt, model)
                      ├─► Create Response object (pending status)
                      ├─► Update UI with pending response
                      └─► POST http://127.0.0.1:8000/send
                          └─► Backend (main.py): handle_prompt_request()
                              ├─► Check chat_sessions for existing handler
                              ├─► Create/Reuse LLMRequestHandler
                              │   └─► llm_requests.py: __init__()
                              │       └─► Initialize Gemini client
                              │       └─► Create chat session (if history enabled)
                              └─► Call llm.send()
                                  └─► llm_requests.py: send()
                                      └─► Call Gemini API
                                      ◄─── Get LLM response
                                  ◄─── Return response text
                              └─► Update Response object (success/error status)
                          ◄─── Return updated Response
                      ◄─── Update UI with final response
```

### 3. Chat History Flow
```
If rememberChatHistory = True:
  ├─► Backend stores LLMRequestHandler in chat_sessions dict
  ├─► Subsequent requests with same ID reuse handler
  └─► Gemini chat_agent maintains conversation context

If rememberChatHistory = False:
  ├─► New LLMRequestHandler created each time
  ├─► Stateless generate_content() call
  └─► No context preservation
```

---

## Technology Stack

### Frontend
- **Framework**: React 18.3.1
- **Build Tool**: Vite
- **Language**: TypeScript
- **UI Library**: Radix UI (shadcn/ui components)
- **State Management**: React Hooks, TanStack Query
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router DOM

### Backend
- **Framework**: FastAPI
- **Language**: Python 3.12/3.13
- **Validation**: Pydantic
- **LLM Integration**: Google Gemini API (current working setup)
- **Server**: Uvicorn (ASGI)
- **Environment**: python-dotenv

### External Services
- Google Gemini API (gemini-2.5-flash)
- OpenAI API (planned)
- Anthropic Claude API (planned)

---

## Key Features

### 1. Multi-Pattern Support
- 20+ pre-defined prompt engineering patterns
- Categorized by use case (Basic, Requirements, Design, Quality, Refactoring)
- Template-based initialization

### 2. Multi-Model Comparison
- Support for multiple LLM providers
- Side-by-side response comparison
- Model-specific configuration

### 3. Session Management
- Unique session IDs for tracking
- Chat history preservation option
- Conversation context maintenance

### 4. Flexible Card System
- Enable/disable individual prompts
- Batch sending capability
- Copy/delete functionality

### 5. Response Evaluation
- Real-time Evaluation (implementation pending)
- Timestamp tracking and Response history

### 6. Configuration
- Secure API token storage (localStorage)
- Per-provider configuration
- Advanced LLM parameters (temperature, max tokens, etc.)

---

## Security Considerations(Needs validation)

### Frontend
- API tokens stored in browser localStorage (client-side only)
- No token transmission to backend
- HTTPS recommended for production

### Backend
- API keys loaded from environment variables
- CORS configured for specific origins (currently wildcard for development)
- Request validation using Pydantic models

### Recommendations
- Use environment variables for all secrets
- Implement authentication/authorization
- Rate limiting for API endpoints
- Input sanitization for prompts
- Secure session management

---

## File Structure Summary

```
llm-compare-hub/
├── src/                          # Frontend source
│   ├── App.tsx                   # Root component with routing
│   ├── main.tsx                  # Application entry point
│   ├── pages/
│   │   ├── Index.tsx             # Main application page
│   │   └── NotFound.tsx          # 404 error page
│   ├── components/
│   │   ├── Toolbar.tsx           # Top navigation bar
│   │   ├── PromptCard.tsx        # Individual prompt card
│   │   ├── EvaluationPanel.tsx   # Response display
│   │   ├── SettingsDialog.tsx    # Configuration dialog
│   │   └── ui/                   # Radix UI components
│   ├── lib/
│   │   ├── patternTemplates.ts   # Prompt patterns
│   │   └── utils.ts              # Utility functions
│   └── hooks/
│       └── use-toast.ts          # Toast notification hook
├── llm-compare-server/           # Backend source
│   ├── main.py                   # FastAPI server
│   ├── llm_requests.py           # LLM request handler
│   └── models.py                 # Pydantic models
├── public/                       # Static assets
├── package.json                  # Frontend dependencies
├── vite.config.ts                # Vite configuration
├── tailwind.config.ts            # Tailwind CSS config
└── tsconfig.json                 # TypeScript config
```

---

## Development Setup

### Frontend
```bash
npm install        # Install dependencies
npm run dev        # Start development server (Vite)
npm run build      # Build for production
```

### Backend
```bash
cd llm-compare-server
pip install fastapi uvicorn google-generativeai python-dotenv
# Create .env file with API_KEY=your_gemini_api_key
python main.py     # Start FastAPI server
```

---

## API Documentation

### Base URL
- Development: `http://127.0.0.1:8000`

### Endpoints

#### `GET /`
Initialize session and health check.

**Response:**
```json
{
  "message": "server is working, cool...",
  "session_id": "uuid-string",
  "status": "connected"
}
```

#### `POST /send`
Send prompt to LLM and get response.

**Request Body:**
```json
{
  "id": "session-id",
  "model": "gemini-2.5-flash",
  "prompt": "Your prompt text",
  "timestamp": "2025-11-13T12:00:00",
  "rememberHistory": true
}
```

**Response:**
```json
{
  "id": "session-id",
  "model": "gemini-2.5-flash",
  "prompt": "Your prompt text",
  "response": "LLM response text",
  "timestamp": "2025-11-13T12:00:00",
  "status": "success",
  "rememberHistory": true
}
```

---

## Conclusion

LLM Compare Hub provides a robust, extensible architecture for comparing prompts across multiple LLM providers. The separation of concerns between frontend and backend, combined with a flexible pattern system, makes it an ideal tool for prompt engineering research and development.

