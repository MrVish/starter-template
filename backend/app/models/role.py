"""
Role model
"""
from sqlalchemy import Column, String
from sqlalchemy.orm import relationship
from app.models.base import Base
from app.models.associations import user_roles, role_permission

class Role(Base):
    """Role model for user roles"""
    __tablename__ = "role"

    name = Column(String(50), unique=True, index=True, nullable=False)
    description = Column(String(255), nullable=True)
    
    # Relationships
    users = relationship("User", secondary=user_roles, back_populates="roles")
    permissions = relationship("Permission", secondary=role_permission, back_populates="roles")

    def __repr__(self) -> str:
        return f"<Role {self.name}>" 