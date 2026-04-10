"""
Logging utilities for Mentora
"""
import sys
from loguru import logger

# Remove default handlers to avoid duplicate logs
logger.remove()
# Add custom handler
logger.add(sys.stdout, format="{time} {level} {message}", level="INFO")

# Create a custom logger class to match expected interface
class Logger:
    def info(self, message: str, request_id: str = None, metadata: dict = None):
        if metadata:
            logger.info(f"[{request_id}] {message} - {metadata}")
        elif request_id:
            logger.info(f"[{request_id}] {message}")
        else:
            logger.info(message)
    
    def error(self, message: str, request_id: str = None):
        logger.error(f"[{request_id}] {message}" if request_id else message)
    
    def warning(self, message: str, request_id: str = None):
        logger.warning(f"[{request_id}] {message}" if request_id else message)

logger = Logger()