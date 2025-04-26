from typing import List, Dict, Any, Optional, Type, TypeVar, Generic
from sqlalchemy.orm import Session
from extensions import db

T = TypeVar('T')

class BaseRepository(Generic[T]):
    """Base repository for database operations"""
    
    def __init__(self, model: Type[T]):
        self.model = model
        
    def get_by_id(self, id: Any) -> Optional[T]:
        """Get entity by ID"""
        return db.session.query(self.model).filter_by(id=id).first()
        
    def get_all(self) -> List[T]:
        """Get all entities"""
        return db.session.query(self.model).all()
        
    def find(self, **kwargs) -> List[T]:
        """Find entities by attributes"""
        return db.session.query(self.model).filter_by(**kwargs).all()
        
    def find_one(self, **kwargs) -> Optional[T]:
        """Find one entity by attributes"""
        return db.session.query(self.model).filter_by(**kwargs).first()
        
    def create(self, **kwargs) -> T:
        """Create a new entity"""
        instance = self.model(**kwargs)
        return self.save(instance)
        
    def save(self, instance: T) -> T:
        """Save an entity"""
        db.session.add(instance)
        db.session.commit()
        return instance
        
    def update(self, instance: T, **kwargs) -> T:
        """Update an entity"""
        for key, value in kwargs.items():
            setattr(instance, key, value)
        return self.save(instance)
        
    def delete(self, instance: T) -> None:
        """Delete an entity"""
        db.session.delete(instance)
        db.session.commit()
        
    def delete_by_id(self, id: Any) -> bool:
        """Delete entity by ID"""
        instance = self.get_by_id(id)
        if instance:
            self.delete(instance)
            return True
        return False
        
    def count(self, **kwargs) -> int:
        """Count entities matching criteria"""
        return db.session.query(self.model).filter_by(**kwargs).count()
        
    def exists(self, **kwargs) -> bool:
        """Check if entity exists"""
        return db.session.query(db.exists().where(
            *[getattr(self.model, k) == v for k, v in kwargs.items()]
        )).scalar() 