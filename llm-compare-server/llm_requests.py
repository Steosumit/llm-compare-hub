from google import genai
import os
from dotenv import load_dotenv
from models import Response  # parameter type

# load all the env vars
load_dotenv()
API_KEY = os.getenv("API_KEY")

# Actual handling of the prompt request
## I will be creating a common class object to handle different LLM requests
class LLMRequestHandler:
    def __init__(self, response: Response):
        ### Store common attributes first
        self.chat_agent = None
        self.prompt = response.prompt
        self.model = response.model
        self.rememberHistory = response.rememberHistory
        # Create chat session once if history is enabled

        ### Identify the model
        if response.model == "gemini-2.5-flash":
            # Change the client object responsible for genai functions
            self.client = genai.Client(api_key=API_KEY)
            self.chat_agent = self.client.chats.create(model="gemini-2.5-flash")
    def send(self):
        if self.rememberHistory:
            res = self.chat_agent.send_message(self.prompt)
        else:
            res = self.client.models.generate_content(
                model=self.model,
                contents=self.prompt
            )
        ### Do all the processing here itself before sending
        res_to_send = res
        return res_to_send
