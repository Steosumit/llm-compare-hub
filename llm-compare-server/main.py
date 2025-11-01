from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from llm_requests import LLMRequestHandler  #  custom object for handling requests
from models import Response
import uvicorn
import uuid

app = FastAPI()

# Dictionary to store LLMRequestHandler instances by conversation ID
chat_sessions = {}

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Add your frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods including POST
    allow_headers=["*"],  # Allows all headers
)

@app.get("/")
async def root():
    # Generate unique session ID
    session_id = str(uuid.uuid4())
    return {
        "message": "server is working, cool...",
        "session_id": session_id,
        "status": "connected"
    }

@app.get("/hello/{name}")
async def say_hello(name: str):
    return {"message": f"Hello {name}"}

# Prompt request endpoint
## Request handling
@app.post("/send")
async def handle_prompt_request(request: Response):
        try:
            # Check if we have an existing chat session for this ID
            if request.id in chat_sessions and request.rememberHistory:
                # Reuse existing handler to preserve history
                llm = chat_sessions[request.id]
                # Update prompt for the next message
                llm.prompt = request.prompt
            else:
                # Create new handler
                llm = LLMRequestHandler(request)
                # Store it if history is enabled
                if request.rememberHistory:
                    chat_sessions[request.id] = llm

            res = llm.send()
            ### Create the response json with updated values
            request.response = res.text
            request.status = "success"
            return request
        except Exception as e:
            request.response = str(e)
            request.status = "error"
            return request

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
