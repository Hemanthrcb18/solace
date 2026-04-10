"""
File Utility Functions
"""
import os
import uuid

def generate_unique_filename(original_filename: str) -> str:
    """Generate unique filename while preserving extension"""
    name, ext = os.path.splitext(original_filename)
    unique_id = str(uuid.uuid4())[:8]
    return f"{name}_{unique_id}{ext}"

def is_video_file(filename: str) -> bool:
    """Check if file is a video file"""
    video_extensions = {'.mp4', '.avi', '.mov', '.mkv', '.wmv', '.flv', '.webm'}
    _, ext = os.path.splitext(filename.lower())
    return ext in video_extensions

