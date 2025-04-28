"""
User model for authentication and user management
"""
from datetime import datetime
from typing import List
from sqlalchemy import Column, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.models.base import Base
from app.models.associations import user_roles

class User(Base):
    """User model"""
    __tablename__ = "user"

    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)

    # Relationships
    items = relationship("Item", back_populates="owner")
    roles = relationship("Role", secondary=user_roles, back_populates="users")

    def __repr__(self) -> str:
        return f"<User {self.email}>" 