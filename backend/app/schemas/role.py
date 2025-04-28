"""
Role schemas for request/response validation
"""
from typing import Optional, List
from pydantic import BaseModel, ConfigDict
from datetime import datetime

from app.schemas.permission import Permission

class PermissionBase(BaseModel):
    """Base permission schema"""
    name: str
    description: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class RoleBase(BaseModel):
    """Base role schema"""
    name: str
    description: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class RoleCreate(RoleBase):
    """Role create schema"""
    pass

class RoleUpdate(RoleBase):
    """Role update schema"""
    name: Optional[str] = None

class RoleInDBBase(RoleBase):
    """Role in DB base schema"""
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class RoleInDB(RoleInDBBase):
    """Role in DB schema"""
    pass

class Role(RoleInDBBase):
    """Role schema (from DB)"""
    permissions: List[Permission] = [] 