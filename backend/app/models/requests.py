"""
Request Models
"""
from pydantic import BaseModel
from typing import Optional

class TranscribeRequest(BaseModel):
    video_path: str

class EvaluateRequest(BaseModel):
    transcribed_text: str
    syllabus_text: str
    teaching_objectives: Optional[str] = None

