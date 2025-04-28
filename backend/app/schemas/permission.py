"""
Permission schemas for request/response validation
"""
from typing import Optional
from pydantic import BaseModel, ConfigDict
from datetime import datetime

class PermissionBase(BaseModel):
    """Base permission schema"""
    name: str
    description: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class PermissionCreate(PermissionBase):
    """Permission create schema"""
    pass

class PermissionUpdate(PermissionBase):
    """Permission update schema"""
    name: Optional[str] = None

class PermissionInDBBase(PermissionBase):
    """Permission in DB base schema"""
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class PermissionInDB(PermissionInDBBase):
    """Permission in DB schema"""
    pass

class Permission(PermissionInDBBase):
    """Permission schema (from DB)"""
    pass 