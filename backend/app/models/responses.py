"""
Response Models
"""
from pydantic import BaseModel
from typing import Optional, List

class UploadResponse(BaseModel):
    message: str
    filename: str
    file_path: str
    file_size: int

class TranscribeResponse(BaseModel):
    transcribed_text: str
    duration: Optional[float] = None
    confidence: Optional[float] = None

class EvaluationScore(BaseModel):
    engagement_score: float
    concept_coverage_score: float
    clarity_score: float
    pedagogy_score: float
    overall_score: float

class EvaluateResponse(BaseModel):
    scores: EvaluationScore
    reasoning: List[str]
    improvements: List[str]

class HealthResponse(BaseModel):
    status: str
    message: str

class AWSStatusResponse(BaseModel):
    aws_region: str
    services: dict
    status: str

