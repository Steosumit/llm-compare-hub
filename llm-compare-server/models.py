from pydantic import BaseModel
from datetime import datetime

## Parameter model
class Response(BaseModel):
        id: str
        model: str
        prompt: str
        response: str = None
        timestamp: datetime
        status: str = None
        rememberHistory: bool = False
