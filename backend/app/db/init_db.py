"""
Database initialization
"""
from sqlalchemy.orm import Session
from app.core.config import settings
from app.schemas.user import UserCreate
from app.schemas.role import RoleCreate
from app.schemas.permission import PermissionCreate
from app.core.security import get_password_hash

def get_admin_password_hash() -> str:
    """Get the hashed password for the admin user"""
    return get_password_hash("admin")

def init_db(db: Session) -> None:
    """Initialize database with first superuser and default roles"""
    # Import crud modules here to avoid circular imports
    from app.crud import crud_user, crud_role, crud_permission
    
    # Create default roles if they don't exist
    admin_role = crud_role.get_by_name(db, name="admin")
    if not admin_role:
        role_in = RoleCreate(
            name="admin",
            description="Administrator with full access"
        )
        admin_role = crud_role.create(db, obj_in=role_in)

    user_role = crud_role.get_by_name(db, name="user")
    if not user_role:
        role_in = RoleCreate(
            name="user",
            description="Regular user with limited access"
        )
        user_role = crud_role.create(db, obj_in=role_in)

    # Create first superuser if it doesn't exist
    user = crud_user.get_by_email(db, email=settings.FIRST_SUPERUSER)
    if not user:
        user_in = UserCreate(
            email=settings.FIRST_SUPERUSER,
            password=settings.FIRST_SUPERUSER_PASSWORD,
            username="admin",
            is_superuser=True,
        )
        user = crud_user.create(db, obj_in=user_in)
        if admin_role:
            user.roles.append(admin_role)
            db.commit()
            db.refresh(user)

    # Create permissions if they don't exist
    permission_names = [
        "create_user", "read_user", "update_user", "delete_user",
        "create_item", "read_item", "update_item", "delete_item"
    ]
    
    for name in permission_names:
        permission = crud_permission.get_by_name(db, name=name)
        if not permission:
            description = f"Can {name.replace('_', ' ')}"
            permission_in = PermissionCreate(
                name=name,
                description=description
            )
            permission = crud_permission.create(db, obj_in=permission_in)

    # Grant all permissions to admin role
    admin_permissions = crud_permission.get_all(db)
    for permission in admin_permissions:
        try:
            crud_permission.assign_permission_to_role(db, role_id=admin_role.id, permission_id=permission.id)
        except Exception:
            # Permission might already be assigned, ignore the error
            db.rollback()

    # Grant read permissions to user role
    user_permissions = crud_permission.get_all(db)
    for permission in user_permissions:
        if permission.name.startswith("read_"):
            try:
                crud_permission.assign_permission_to_role(db, role_id=user_role.id, permission_id=permission.id)
            except Exception:
                # Permission might already be assigned, ignore the error
                db.rollback() 