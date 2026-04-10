import random
import time
from app.models.responses import TranscribeResponse

class TranscriptionService:
    @staticmethod
    def transcribe_video(video_path: str) -> TranscribeResponse:
        """
        Placeholder transcription service.
        In production, this would use Whisper or similar ASR service.
        """
        # Simulate processing time
        time.sleep(1)
        
        # Generate placeholder transcription
        sample_transcriptions = [
            "Today we'll be discussing the fundamentals of machine learning. Machine learning is a subset of artificial intelligence that enables computers to learn and make decisions from data without being explicitly programmed for every task.",
            "Welcome to our physics lecture on Newton's laws of motion. The first law states that an object at rest stays at rest and an object in motion stays in motion unless acted upon by an external force.",
            "In today's mathematics class, we'll explore calculus derivatives. A derivative represents the rate of change of a function with respect to its variable.",
            "Let's begin our chemistry lesson on molecular bonding. Covalent bonds form when atoms share electrons to achieve stable electron configurations."
        ]
        
        transcribed_text = random.choice(sample_transcriptions)
        
        return TranscribeResponse(
            transcribed_text=transcribed_text,
            duration=random.uniform(300, 1800),  # 5-30 minutes
            confidence=random.uniform(0.85, 0.98)
        )