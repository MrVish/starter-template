"""
Role endpoints for user role management
"""
from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api import deps
from app.schemas.role import Role, RoleCreate, RoleUpdate
from app.crud import crud_role
from app.models.user import User

router = APIRouter()

@router.get("/", response_model=List[Role])
def read_roles(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_superuser),
) -> Any:
    """
    Retrieve roles.
    """
    roles = crud_role.get_multi(db, skip=skip, limit=limit)
    return roles

@router.post("/", response_model=Role)
def create_role(
    *,
    db: Session = Depends(deps.get_db),
    role_in: RoleCreate,
    current_user: User = Depends(deps.get_current_superuser),
) -> Any:
    """
    Create new role.
    """
    role = crud_role.get_by_name(db, name=role_in.name)
    if role:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The role with this name already exists in the system.",
        )
    role = crud_role.create(db, obj_in=role_in)
    return role

@router.put("/{role_id}", response_model=Role)
def update_role(
    *,
    db: Session = Depends(deps.get_db),
    role_id: int,
    role_in: RoleUpdate,
    current_user: User = Depends(deps.get_current_superuser),
) -> Any:
    """
    Update a role.
    """
    role = crud_role.get(db, id=role_id)
    if not role:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Role not found",
        )
    role = crud_role.update(db, db_obj=role, obj_in=role_in)
    return role

@router.delete("/{role_id}", response_model=Role)
def delete_role(
    *,
    db: Session = Depends(deps.get_db),
    role_id: int,
    current_user: User = Depends(deps.get_current_superuser),
) -> Any:
    """
    Delete a role.
    """
    role = crud_role.get(db, id=role_id)
    if not role:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Role not found",
        )
    role = crud_role.remove(db, id=role_id)
    return role 