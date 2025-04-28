"""
Item model for user's items
"""
from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.orm import relationship
from app.models.base import Base

class Item(Base):
    """Item model"""
    __tablename__ = "item"

    title = Column(String, index=True)
    description = Column(String, index=True, nullable=True)
    owner_id = Column(ForeignKey("user.id"))

    # Relationships
    owner = relationship("User", back_populates="items")

    def __repr__(self) -> str:
        return f"<Item {self.title}>" 