"""
Authentication endpoints
"""
from datetime import timedelta
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core import security
from app.core.config import settings
from app.schemas.user import User, UserCreate, UserLogin, UserResponse
from app.crud import crud_user
from app.schemas.token import Token
from app.db.deps import get_db

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/login", response_model=Token)
def login(
    *,
    db: Session = Depends(get_db),
    user_in: UserLogin
) -> Any:
    """
    Login with email and password to get access token
    """
    user = crud_user.authenticate(
        db, email=user_in.email, password=user_in.password
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    elif not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    
    # Create tokens
    access_token = security.create_access_token(user.id)
    refresh_token = security.create_refresh_token(user.id)
    
    # Serialize user for frontend
    user_response = UserResponse.model_validate(user).model_dump()

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": user_response
    }

@router.post("/refresh", response_model=Token)
def refresh_token(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Refresh access token
    """
    return {
        "access_token": security.create_access_token(current_user.id),
        "refresh_token": security.create_refresh_token(current_user.id),
        "token_type": "bearer"
    }

@router.post("/register", response_model=User)
def register(
    *,
    db: Session = Depends(get_db),
    user_in: UserCreate,
) -> Any:
    """
    Register new user
    """
    user = crud_user.get_by_email(db, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The user with this email already exists in the system",
        )
    user = crud_user.create(db, obj_in=user_in)
    return user

# Import at the end to avoid circular imports
from app.api import deps
from app.db.deps import get_db
from app.api.deps import get_current_user 