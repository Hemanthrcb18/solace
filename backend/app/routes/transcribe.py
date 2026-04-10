"""
Transcription Route
"""
from fastapi import APIRouter, HTTPException
from app.models.requests import TranscribeRequest
from app.models.responses import TranscribeResponse
from app.services.transcribe_service import TranscriptionService

router = APIRouter()

@router.post("", response_model=TranscribeResponse)
async def transcribe_video(request: TranscribeRequest):
    """Transcribe audio from video file"""
    try:
        result = TranscriptionService.transcribe_video(request.video_path)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Transcription failed: {str(e)}"
        )

