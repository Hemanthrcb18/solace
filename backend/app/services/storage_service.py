import boto3
import os
from app.utils.logging import logger
from app.core.config import settings

class StorageService:
    def __init__(self):
        self.s3 = None
        if settings.AWS_ACCESS_KEY_ID:
            try:
                self.s3 = boto3.client(
                    's3',
                    region_name=settings.AWS_REGION,
                    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY
                )
            except Exception as e:
                logger.error(f"Failed to initialize S3 client: {e}")

    def upload_video(self, file_path: str, filename: str):
        if self.s3 and settings.AWS_S3_BUCKET_NAME:
            try:
                self.s3.upload_file(file_path, settings.AWS_S3_BUCKET_NAME, filename)
                return f"s3://{settings.AWS_S3_BUCKET_NAME}/{filename}"
            except Exception as e:
                logger.error(f"S3 upload failed: {e}")
        
        # Fallback to local
        return f"local://uploads/{filename}"

storage_service = StorageService()
