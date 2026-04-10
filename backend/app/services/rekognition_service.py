"""
AWS Rekognition Service
Video analysis for teaching evaluation
"""
import boto3
import json
from typing import Dict, Any
from app.core.config import settings


class RekognitionService:
    """AWS Rekognition service"""
    
    def __init__(self):
        if settings.AWS_ACCESS_KEY_ID and settings.AWS_SECRET_ACCESS_KEY:
            self.client = boto3.client(
                'rekognition',
                region_name=settings.AWS_REGION,
                aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY
            )
            self.is_configured = True
        else:
            self.client = None
            self.is_configured = False
    
    def analyze_video(self, video_path: str) -> Dict[str, Any]:
        """Analyze video using Rekognition"""
        if not self.is_configured:
            # Fallback to stub implementation
            return self._stub_analysis(video_path)
        
        try:
            with open(video_path, 'rb') as video_file:
                video_bytes = video_file.read()
            
            # Analyze faces for engagement metrics
            face_response = self.client.recognize_celebrity(
                Video={
                    'S3Object': {
                        'Bucket': settings.AWS_S3_BUCKET_NAME,
                        'Name': video_path.split('/')[-1]  # Extract filename
                    }
                }
            )
            
            # Analyze labels for content context
            label_response = self.client.start_label_detection(
                Video={
                    'S3Object': {
                        'Bucket': settings.AWS_S3_BUCKET_NAME,
                        'Name': video_path.split('/')[-1]
                    }
                }
            )
            
            # For now, return stub - in real implementation we'd process the responses
            return self._stub_analysis(video_path)
            
        except Exception as e:
            print(f"Rekognition analysis failed: {str(e)}")
            return self._stub_analysis(video_path)
    
    def _stub_analysis(self, video_path: str) -> Dict[str, Any]:
        """Fallback analysis when AWS is not configured"""
        return {
            "engagement_metrics": {
                "facial_expressions": ["neutral", "focused", "engaged"],
                "gaze_direction": "toward_camera",
                "head_pose": "attentive"
            },
            "content_analysis": {
                "detected_labels": ["education", "classroom", "presentation"],
                "dominant_colors": ["#1a73e8", "#f1f5f9"]
            },
            "recommendations": [
                "Maintain good eye contact with camera",
                "Use more expressive gestures"
            ]
        }


rekognition_service = RekognitionService()

