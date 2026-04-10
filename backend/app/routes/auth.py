"""
Authentication Routes
Demo Mode: Hardcoded demo user
"""
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.core.security import create_jwt_token, get_current_user, User

router = APIRouter()

class AuthResponse(BaseModel):
    token: str
    token_type: str = "bearer"
    user: dict

@router.post("/demo-token")
async def get_demo_token():
    """Get demo token for quick access"""
    token = create_jwt_token(
        user_id="demo-user-001",
        email="demo@mentora.ai",
        role="demo",
        name="Demo User"
    )
    
    return AuthResponse(
        token=token,
        user={
            "id": "demo-user-001",
            "email": "demo@mentora.ai",
            "role": "demo",
            "name": "Demo User"
        }
    )

@router.get("/me")
async def get_current_user_profile(user: User = Depends(get_current_user)):
    """Get current authenticated user profile"""
    return {
        "id": user.id,
        "email": user.email,
        "role": user.role,
        "name": user.name
    }

