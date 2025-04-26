import os
import sys
import logging
from datetime import datetime
from werkzeug.security import generate_password_hash

# Add the parent directory to the path so we can import the app modules
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from extensions import db
from models.dim_users import DimUser
from models.dim_roles import DimRole
from models.dim_permissions import DimPermission
from app import create_app

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def init_db():
    """Initialize the database with default data"""
    app = create_app()
    with app.app_context():
        logger.info("Creating database tables...")
        db.create_all()
        
        # Check if roles already exist
        if DimRole.query.count() > 0:
            logger.info("Database already has roles. Skipping initialization.")
            return
        
        # Create default roles
        logger.info("Creating default roles...")
        admin_role = DimRole(name="Administrator", description="Full system access")
        manager_role = DimRole(name="Manager", description="Department manager with access to most features")
        analyst_role = DimRole(name="Analyst", description="Can view and analyze data")
        user_role = DimRole(name="User", description="Standard user with limited access")
        
        # Create permissions
        logger.info("Creating permissions...")
        
        # User management permissions
        view_users = DimPermission(name="view_users", resource="users", action="read", 
                                 description="View user accounts")
        create_users = DimPermission(name="create_users", resource="users", action="create", 
                                   description="Create user accounts")
        update_users = DimPermission(name="update_users", resource="users", action="update", 
                                   description="Update user accounts")
        delete_users = DimPermission(name="delete_users", resource="users", action="delete", 
                                   description="Delete user accounts")
        
        # Role management permissions
        view_roles = DimPermission(name="view_roles", resource="roles", action="read", 
                                 description="View roles")
        create_roles = DimPermission(name="create_roles", resource="roles", action="create", 
                                   description="Create roles")
        update_roles = DimPermission(name="update_roles", resource="roles", action="update", 
                                   description="Update roles")
        delete_roles = DimPermission(name="delete_roles", resource="roles", action="delete", 
                                   description="Delete roles")
        
        # Campaign permissions
        view_campaigns = DimPermission(name="view_campaigns", resource="campaigns", action="read", 
                                     description="View campaigns")
        create_campaigns = DimPermission(name="create_campaigns", resource="campaigns", action="create", 
                                       description="Create campaigns")
        update_campaigns = DimPermission(name="update_campaigns", resource="campaigns", action="update", 
                                       description="Update campaigns")
        delete_campaigns = DimPermission(name="delete_campaigns", resource="campaigns", action="delete", 
                                       description="Delete campaigns")
        
        # Analytics permissions
        view_analytics = DimPermission(name="view_analytics", resource="analytics", action="read", 
                                     description="View analytics")
        export_analytics = DimPermission(name="export_analytics", resource="analytics", action="export", 
                                       description="Export analytics")
        
        # Customer segment permissions
        view_segments = DimPermission(name="view_segments", resource="segments", action="read", 
                                    description="View customer segments")
        create_segments = DimPermission(name="create_segments", resource="segments", action="create", 
                                      description="Create customer segments")
        update_segments = DimPermission(name="update_segments", resource="segments", action="update", 
                                      description="Update customer segments")
        delete_segments = DimPermission(name="delete_segments", resource="segments", action="delete", 
                                      description="Delete customer segments")
        
        # Assign permissions to roles
        logger.info("Assigning permissions to roles...")
        
        # Admin gets all permissions
        admin_role.permissions = [
            view_users, create_users, update_users, delete_users,
            view_roles, create_roles, update_roles, delete_roles,
            view_campaigns, create_campaigns, update_campaigns, delete_campaigns,
            view_analytics, export_analytics,
            view_segments, create_segments, update_segments, delete_segments
        ]
        
        # Manager gets most permissions
        manager_role.permissions = [
            view_users, create_users, update_users,
            view_roles,
            view_campaigns, create_campaigns, update_campaigns, delete_campaigns,
            view_analytics, export_analytics,
            view_segments, create_segments, update_segments, delete_segments
        ]
        
        # Analyst gets view permissions
        analyst_role.permissions = [
            view_users,
            view_campaigns,
            view_analytics, export_analytics,
            view_segments
        ]
        
        # Users get basic permissions
        user_role.permissions = [
            view_campaigns,
            view_segments
        ]
        
        # Add roles to session
        db.session.add_all([admin_role, manager_role, analyst_role, user_role])
        
        # Create default admin user
        logger.info("Creating default admin user...")
        admin_user = DimUser(
            email="admin@example.com",
            full_name="System Administrator",
            password_hash=generate_password_hash("admin123"),
            is_active=True,
            created_at=datetime.utcnow()
        )
        admin_user.roles = [admin_role]
        
        # Create default manager user
        manager_user = DimUser(
            email="manager@example.com",
            full_name="Marketing Manager",
            password_hash=generate_password_hash("manager123"),
            is_active=True,
            created_at=datetime.utcnow()
        )
        manager_user.roles = [manager_role]
        
        # Create default analyst user
        analyst_user = DimUser(
            email="analyst@example.com",
            full_name="Data Analyst",
            password_hash=generate_password_hash("analyst123"),
            is_active=True,
            created_at=datetime.utcnow()
        )
        analyst_user.roles = [analyst_role]
        
        # Create default regular user
        regular_user = DimUser(
            email="user@example.com",
            full_name="Regular User",
            password_hash=generate_password_hash("user123"),
            is_active=True,
            created_at=datetime.utcnow()
        )
        regular_user.roles = [user_role]
        
        # Add users to session
        db.session.add_all([admin_user, manager_user, analyst_user, regular_user])
        
        # Commit all changes
        db.session.commit()
        logger.info("Database initialized successfully!")

if __name__ == "__main__":
    init_db() 