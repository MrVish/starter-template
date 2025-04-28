"""
Token schemas
"""
from typing import Optional
from pydantic import BaseModel, ConfigDict
from app.schemas.user import UserResponse

class Token(BaseModel):
    """
    Token response schema
    """
    access_token: str
    refresh_token: str
    token_type: str
    user: Optional[UserResponse] = None

    model_config = ConfigDict(from_attributes=True)

class TokenPayload(BaseModel):
    """
    Token payload schema
    """
    sub: Optional[int] = None
    exp: Optional[int] = None
    is_refresh: Optional[bool] = False

    model_config = ConfigDict(from_attributes=True) 