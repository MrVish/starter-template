"""
User schemas for request/response validation
"""
from typing import Optional, List
from pydantic import BaseModel, ConfigDict, EmailStr, computed_field
from datetime import datetime
from .role import Role
from .permission import Permission

class UserBase(BaseModel):
    """Base user schema"""
    email: EmailStr
    username: str
    is_active: bool = True
    is_superuser: bool = False

    model_config = ConfigDict(from_attributes=True)

class UserCreate(UserBase):
    """User create schema"""
    password: str

class UserUpdate(UserBase):
    """User update schema"""
    email: Optional[EmailStr] = None
    username: Optional[str] = None
    password: Optional[str] = None
    is_active: Optional[bool] = None
    is_superuser: Optional[bool] = None

class UserLogin(BaseModel):
    """User login schema"""
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    """User response schema"""
    id: int
    email: EmailStr
    username: str
    is_active: bool
    is_superuser: bool
    roles: List[Role]

    model_config = ConfigDict(from_attributes=True)

    @computed_field
    @property
    def role(self) -> str:
        """Get primary role name"""
        return self.roles[0].name if self.roles else ""

    @computed_field
    @property
    def role_names(self) -> List[str]:
        """Get list of role names"""
        return [role.name for role in self.roles]

    @computed_field
    @property
    def permissions(self) -> List[str]:
        """Get list of permission names from all roles"""
        all_permissions = set()
        for role in self.roles:
            for perm in role.permissions:
                all_permissions.add(perm.name)
        return list(all_permissions)

class UserInDBBase(UserBase):
    """User in DB base schema"""
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class UserInDB(UserInDBBase):
    """User in DB schema"""
    hashed_password: str

class User(UserInDBBase):
    """User schema (from DB)"""
    roles: List[Role] = []
    permissions: List[Permission] = [] 