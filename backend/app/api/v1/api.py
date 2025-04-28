"""
API v1 router
"""
from fastapi import APIRouter
from app.api.v1.endpoints import auth, users, items, admin, roles, permissions

api_router = APIRouter()
api_router.include_router(auth.router, tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(items.router, prefix="/items", tags=["items"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])
api_router.include_router(roles.router, prefix="/admin/roles", tags=["roles"])
api_router.include_router(permissions.router, prefix="/admin/permissions", tags=["permissions"]) 