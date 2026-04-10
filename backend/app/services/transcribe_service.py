from app.utils.logging import logger

class TranscriptionService:
    async def transcribe_video(self, video_path: str):
        logger.info(f"Transcribing video: {video_path}")
        return "This is a mock transcription for the demo video."

transcribe_service = TranscriptionService()
