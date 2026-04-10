"""
Request Logging Middleware
"""
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response
from app.utils.logging import logger
import uuid


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        request_id = str(uuid.uuid4())
        # Store request_id in the request scope instead of request.state
        request.scope['request_id'] = request_id
        
        logger.info("Request started", request_id=request_id, metadata={
            "method": request.method,
            "url": str(request.url)
        })
        
        try:
            response = await call_next(request)
            logger.info("Request completed", request_id=request_id, metadata={
                "status_code": response.status_code
            })
            return response
        except Exception as e:
            logger.error(f"Request failed: {str(e)}", request_id=request_id)
            raise