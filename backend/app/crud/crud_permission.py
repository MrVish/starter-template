"""
CRUD operations for permissions
"""
from typing import List, Optional
from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.models.permission import Permission
from app.models.associations import role_permission
from app.schemas.permission import PermissionCreate, PermissionUpdate

class CRUDPermission(CRUDBase[Permission, PermissionCreate, PermissionUpdate]):
    """CRUD operations for permissions"""
    def get_by_name(self, db: Session, *, name: str) -> Optional[Permission]:
        """Get permission by name"""
        return db.query(Permission).filter(Permission.name == name).first()

    def create(self, db: Session, *, obj_in: PermissionCreate) -> Permission:
        """Create new permission"""
        db_obj = Permission(
            name=obj_in.name,
            description=obj_in.description,
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def get_all(self, db: Session) -> List[Permission]:
        """Get all permissions"""
        return db.query(Permission).all()

    def assign_permission_to_role(self, db: Session, *, role_id: int, permission_id: int) -> None:
        """Assign a permission to a role"""
        stmt = role_permission.insert().values(role_id=role_id, permission_id=permission_id)
        db.execute(stmt)
        db.commit()

crud_permission = CRUDPermission(Permission) 