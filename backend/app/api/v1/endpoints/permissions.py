"""
Permission endpoints for role permission management
"""
from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api import deps
from app.schemas.permission import Permission, PermissionCreate, PermissionUpdate
from app.crud import crud_permission
from app.models.user import User

router = APIRouter()

@router.get("/", response_model=List[Permission])
def read_permissions(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_superuser),
) -> Any:
    """
    Retrieve permissions.
    """
    permissions = crud_permission.get_multi(db, skip=skip, limit=limit)
    return permissions

@router.post("/", response_model=Permission)
def create_permission(
    *,
    db: Session = Depends(deps.get_db),
    permission_in: PermissionCreate,
    current_user: User = Depends(deps.get_current_superuser),
) -> Any:
    """
    Create new permission.
    """
    permission = crud_permission.get_by_name(db, name=permission_in.name)
    if permission:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The permission with this name already exists in the system.",
        )
    permission = crud_permission.create(db, obj_in=permission_in)
    return permission

@router.put("/{permission_id}", response_model=Permission)
def update_permission(
    *,
    db: Session = Depends(deps.get_db),
    permission_id: int,
    permission_in: PermissionUpdate,
    current_user: User = Depends(deps.get_current_superuser),
) -> Any:
    """
    Update a permission.
    """
    permission = crud_permission.get(db, id=permission_id)
    if not permission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Permission not found",
        )
    permission = crud_permission.update(db, db_obj=permission, obj_in=permission_in)
    return permission

@router.delete("/{permission_id}", response_model=Permission)
def delete_permission(
    *,
    db: Session = Depends(deps.get_db),
    permission_id: int,
    current_user: User = Depends(deps.get_current_superuser),
) -> Any:
    """
    Delete a permission.
    """
    permission = crud_permission.get(db, id=permission_id)
    if not permission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Permission not found",
        )
    permission = crud_permission.remove(db, id=permission_id)
    return permission 