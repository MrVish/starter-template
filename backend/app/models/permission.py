"""
Permission model
"""
from sqlalchemy import Column, String
from sqlalchemy.orm import relationship
from app.models.base import Base
from app.models.associations import role_permission

class Permission(Base):
    """Permission model for role permissions"""
    __tablename__ = "permission"

    name = Column(String(50), unique=True, index=True, nullable=False)
    description = Column(String(255), nullable=True)
    
    # Relationships
    roles = relationship("Role", secondary=role_permission, back_populates="permissions")

    def __repr__(self) -> str:
        return f"<Permission {self.name}>" 