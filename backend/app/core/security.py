"""
JWT Authentication and Security
Demo Mode: Hardcoded demo user
"""
import jwt
from datetime import datetime, timedelta
from typing import Optional
from fastapi import HTTPException, Security, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel

from .config import settings

security = HTTPBearer()

class User(BaseModel):
    id: str
    email: str
    role: str
    name: str

def create_jwt_token(user_id: str, email: str, role: str = "demo", name: str = "Demo User") -> str:
    """Create JWT token for demo user"""
    payload = {
        "sub": user_id,
        "email": email,
        "role": role,
        "name": name,
        "exp": datetime.utcnow() + timedelta(hours=settings.JWT_EXPIRATION_HOURS),
        "iat": datetime.utcnow()
    }
    return jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)

def verify_jwt_token(token: str) -> dict:
    """Verify JWT token"""
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Security(security)
) -> User:
    """Get current authenticated user"""
    token = credentials.credentials
    payload = verify_jwt_token(token)
    return User(
        id=payload.get("sub"),
        email=payload.get("email"),
        role=payload.get("role", "demo"),
        name=payload.get("name", "Demo User")
    )

