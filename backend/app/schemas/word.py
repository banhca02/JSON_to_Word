from pydantic import BaseModel
from typing import Any, Dict

class JSONInput(BaseModel):
    data: Dict[str, Any]

class GenWordResponse(BaseModel):
    doc_id: str
    exist_time: int
