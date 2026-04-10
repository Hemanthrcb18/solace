"""
Video Upload Route
"""
import os
from fastapi import APIRouter, UploadFile, File, HTTPException, Request
from app.models.responses import UploadResponse
from app.utils.file_utils import generate_unique_filename, is_video_file
from app.utils.logging import logger

router = APIRouter()

@router.post("/video", response_model=UploadResponse)
async def upload_video(file: UploadFile = File(...), request: Request = None):  # type: ignore
    """Upload a lecture video file"""
    request_id = request.scope.get('request_id') if request else None
    
    logger.info(f"Video upload initiated: {file.filename}", request_id=request_id)
    
    if not is_video_file(file.filename):
        logger.warn(f"Invalid file type attempted: {file.filename}", request_id=request_id)
        raise HTTPException(
            status_code=400,
            detail="Invalid file type. Please upload a video file."
        )
    
    max_size = int(os.getenv("MAX_FILE_SIZE", "100000000"))  # 100MB
    
    try:
        unique_filename = generate_unique_filename(file.filename)
        upload_dir = os.getenv("UPLOAD_DIR", "./uploads")
        file_path = os.path.join(upload_dir, unique_filename)
        
        content = await file.read()
        file_size = len(content)
        
        logger.debug(f"File read: {file_size} bytes", request_id=request_id, metadata={"filename": unique_filename})
        
        if file_size > max_size:
            logger.warn(f"File too large: {file_size} bytes", request_id=request_id)
            raise HTTPException(
                status_code=413,
                detail=f"File too large. Maximum size is {max_size // 1000000}MB."
            )
        
        with open(file_path, "wb") as buffer:
            buffer.write(content)
        
        logger.info(f"Video uploaded successfully: {unique_filename}", request_id=request_id, metadata={
            "filename": unique_filename,
            "file_size": file_size,
            "file_path": file_path
        })
        
        return UploadResponse(
            message="Video uploaded successfully",
            filename=unique_filename,
            file_path=file_path,
            file_size=file_size
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Upload failed: {str(e)}", request_id=request_id)
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

