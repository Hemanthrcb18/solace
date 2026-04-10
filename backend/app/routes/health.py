"""
Health Check Route
"""
from fastapi import APIRouter
from app.models.responses import HealthResponse

router = APIRouter()

@router.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return HealthResponse(
        status="healthy",
        message="Mentora API is running successfully"
    )

@router.get("/aws-status")
async def aws_status():
    """AWS service status (stub)"""
    from app.models.responses import AWSStatusResponse
    
    return AWSStatusResponse(
        aws_region="ap-south-1",
        status="ready",
        services={
            "bedrock": {"status": "stub", "ready": True},
            "transcribe": {"status": "stub", "ready": True},
            "rekognition": {"status": "stub", "ready": True},
            "s3": {"status": "local_fallback", "ready": True}
        }
    )

