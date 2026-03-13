
# LLM Compare Hub

![Python](https://img.shields.io/badge/Python-3.12-3776AB?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-Frontend-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-Build_Tool-646CFF?logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-UI-06B6D4?logo=tailwindcss&logoColor=white)
![Gemini API](https://img.shields.io/badge/Gemini-LLM_API-8E75B2?logo=google&logoColor=white)

⚠️ **Update**  
Just discovered a similar but robust platform, been using it:  
https://eu.smith.langchain.com/o/d06a25ae-7832-46f3-947f-edf6ecd278bc/playground

---

👨‍💻 **Built by**  
Steosumit — steosumit@gmail.com  

🎓 **Inspired by**  
*Prompt Engineering with ChatGPT*  
Vanderbilt University — Coursera
# LLM Compare Hub


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
