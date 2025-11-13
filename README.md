# llm-compare-hub

> Build by: steosumit (steosumit@gmail.com)

> Inspired by: Prompt Engineering with ChatGPT by Vanderbilt University on Coursera

## Overview
llm-compare-hub is a personal problem inspiration tool I decided to build to study the behavior of prompts on LLM.
It hunched me while studying the course: Prompt Engineering with ChatGPT by Vanderbilt University on Coursera. 
The tool has the initial draft built with lovable for quick UI development, followed by manual edits, and
a mostly hand-written FastAPI server that was the other inspiration for building this application.

## Features
- Multi-Pattern Support: 20+ pre-defined research based prompt engineering patterns
- Multi-Model Comparison: Compare responses across different LLM providers (Gemini, GPT, Claude)
- Chat History: Optional conversation context preservation
- Flexible Card System: Enable/disable prompts, batch sending, copy/delete functionality [main functionality]
- Response Evaluation: Real-time evaluatio and tracking

## Technology Stack

### Frontend
- **React 18** + **TypeScript** + **Vite**
- **UI**: Radix UI (shadcn/ui) + Tailwind CSS [mostly AI assistent UI]
- **State**: React Hooks + TanStack Query[partial human intervention needed for backed integration]
- **Routing**: React Router DOM

### Backend [mostly self coded]
- **FastAPI** (Python) 
- **LLM Integration**: Google Gemini API
- **Validation**: Pydantic models
- **Server**: Uvicorn (ASGI)

## Quick Start

### Prerequisites
- Node.js (v18+)
- Python (3.12+)
- Google Gemini API key

### Frontend Setup
```bash
npm install
npm run dev
```

### Backend Setup
```bash
cd llm-compare-server
pip install fastapi uvicorn google-generativeai python-dotenv
# Create .env file with your API key
echo "API_KEY=your_gemini_api_key" > .env
python main.py
```

## Project Structure
```
llm-compare-hub/
├── src/                      # Frontend React application
│   ├── components/           # UI components (Toolbar, PromptCard, etc.)
│   ├── pages/                # Page components (Index, NotFound)
│   ├── lib/                  # Utilities and templates
│   └── hooks/                # Custom React hooks
├── llm-compare-server/       # Backend FastAPI application
│   ├── main.py               # API server and endpoints
│   ├── llm_requests.py       # LLM request handler
│   └── models.py             # Pydantic data models
└── public/                   # Static assets
```

## Documentation
📚 **[Detailed Architecture Documentation](./ARCHITECTURE.md)** - Complete breakdown of:
- System architecture and data flow
- Component-level documentation with all functions and their purposes
- API endpoint specifications
- Security considerations
- Future enhancement roadmap

## Current Status
✅ Working Features:
- Session management and initialization
- Prompt pattern templates
- Individual prompt sending with Gemini
- Chat history preservation toggle
- API token configuration (UI only, backend only for Gemini)

🚧 In Development:
- OpenAI and Claude API integration (low priority)
- Response comparison and evaluation tool (high priority)
- Prompt library management (future work)

## Contributing
This is a personal learning project based on real world prompt engineering problem

## License
MIT License

## Acknowledgments
- Course: Prompt Engineering with ChatGPT by Vanderbilt University (Coursera)
- Research papers read:
https://arxiv.org/abs/2303.07839
https://arxiv.org/pdf/2201.11903
