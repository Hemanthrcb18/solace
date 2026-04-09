import os
from openai import OpenAI

# Initialize client if API key is present
api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key) if api_key else None

def transcribe_audio_mock() -> str:
    # Fallback to ensure demo never fails
    return "This is a sample transcription of the teaching session. The teacher is trying to explain the core concepts of software engineering clearly. However, there might be some concepts that are not covered completely."

def transcribe_audio(file_path: str) -> str:
    """Uses Whisper if key is available, else returns mock."""
    if not client:
        return transcribe_audio_mock()
    try:
        with open(file_path, "rb") as audio_file:
            transcript = client.audio.transcriptions.create(
                model="whisper-1", 
                file=audio_file
            )
        return transcript.text
    except Exception as e:
        print(f"Whisper API Failed: {e}. Falling back to mock data.")
        return transcribe_audio_mock()
