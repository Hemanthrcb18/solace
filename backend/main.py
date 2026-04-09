from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import shutil
import os

from utils import transcribe_audio
from scoring import generate_scores
from ai_feedback import generate_feedback

app = FastAPI(title="Mentora Lite API")

# Configure CORS for local UI 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TextAnalysisRequest(BaseModel):
    text: str
    duration_seconds: int = 60
    syllabus: str = ""

@app.get("/")
def read_root():
    return {"status": "Mentora Lite Backend is Running!"}

@app.post("/analyze/text")
def analyze_text(request: TextAnalysisRequest):
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Transcript is empty.")
    
    scores = generate_scores(request.text, request.duration_seconds, request.syllabus)
    feedback = generate_feedback(request.text, scores)
    
    return {
        "transcript": request.text,
        "scores": scores,
        "feedback": feedback
    }

@app.post("/analyze/audio")
async def analyze_audio(file: UploadFile = File(...), syllabus: str = Form("")):
    # Save file temporarily
    temp_file_path = f"temp_{file.filename}"
    try:
        with open(temp_file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Audio to Text
        transcript = transcribe_audio(temp_file_path)
        
        # We assume a fixed dummy duration for MVP if we can't extract it easily
        # In a real app we'd use librosa/ffmpeg to get true duration.
        duration_seconds = 60 
        
        # Analyze
        scores = generate_scores(transcript, duration_seconds, syllabus)
        feedback = generate_feedback(transcript, scores)
        
        return {
            "transcript": transcript,
            "scores": scores,
            "feedback": feedback
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
