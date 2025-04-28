from fastapi import APIRouter, Depends, HTTPException, status
from fastapi_jwt_auth import AuthJWT
from sqlalchemy.orm import Session
from extensions import get_db
from models.dim_users import DimUser
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(prefix="/api/v1/users", tags=["users"])

class UserProfileResponse(BaseModel):
    id: int
    username: str
    email: str
    first_name: Optional[str]
    last_name: Optional[str]
    roles: List[str]
    created_at: Optional[str]

    class Config:
        orm_mode = True

@router.get("/profile", response_model=UserProfileResponse)
def get_profile(Authorize: AuthJWT = Depends(), db: Session = Depends(get_db)):
    Authorize.jwt_required()
    user_id = Authorize.get_jwt_subject()
    user = db.query(DimUser).get(int(user_id))
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    roles = [role.name for role in user.roles] if user.roles else []
    return UserProfileResponse(
        id=user.id,
        username=user.username,
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
        roles=roles,
        created_at=user.created_at.isoformat() if user.created_at else None
    ) 