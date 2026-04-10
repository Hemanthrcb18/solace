"""
Mentora Configuration
AWS-First Configuration Management
"""
import os
from typing import List
from dotenv import load_dotenv

load_dotenv()

class Settings:
    def __init__(self):
        # App
        self.APP_ENV = os.getenv("APP_ENV", "development")
        self.DEBUG = os.getenv("DEBUG", "true").lower() == "true"
        
        # AWS (optional for demo)
        self.AWS_REGION = os.getenv("AWS_REGION", "ap-south-1")
        self.AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID", "")
        self.AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY", "")
        self.AWS_S3_BUCKET_NAME = os.getenv("AWS_S3_BUCKET_NAME", "")
        self.AWS_BEDROCK_MODEL_ID = os.getenv("AWS_BEDROCK_MODEL_ID", "anthropic.claude-3-sonnet-20240229-v1:0")
        
        # JWT
        self.JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "mentora-demo-secret-key-change-in-production")
        self.JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
        self.JWT_EXPIRATION_HOURS = int(os.getenv("JWT_EXPIRATION_HOURS", "24"))
        
        # Storage
        self.UPLOAD_DIR = os.getenv("UPLOAD_DIR", "./uploads")
        self.MAX_FILE_SIZE = int(os.getenv("MAX_FILE_SIZE", "100000000"))  # 100MB
        
        # CORS
        self.CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:3001")

settings = Settings()

