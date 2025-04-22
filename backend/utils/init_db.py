import sys
import os

# Add the parent directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app
from app.models.user import Role, Permission
from app.extensions import db

def init_roles_and_permissions():
    """
    Initialize default roles and permissions in the database
    """
    app = create_app()
    with app.app_context():
        # Create database tables if they don't exist
        db.create_all()
        
        # Skip if roles already exist
        if db.session.query(Role).count() > 0:
            print("Roles already exist!")
            return
        
        # Create default permissions
        permissions = {
            # User permissions
            'view_user': Permission(name='view_user', description='View user profiles', resource='user', action='read'),
            'create_user': Permission(name='create_user', description='Create new users', resource='user', action='create'),
            'update_user': Permission(name='update_user', description='Update user profiles', resource='user', action='update'),
            'delete_user': Permission(name='delete_user', description='Delete users', resource='user', action='delete'),
            
            # Model permissions
            'view_model': Permission(name='view_model', description='View ML models', resource='model', action='read'),
            'create_model': Permission(name='create_model', description='Create new ML models', resource='model', action='create'),
            'update_model': Permission(name='update_model', description='Update ML models', resource='model', action='update'),
            'delete_model': Permission(name='delete_model', description='Delete ML models', resource='model', action='delete'),
            'train_model': Permission(name='train_model', description='Train ML models', resource='model', action='train'),
            'predict_model': Permission(name='predict_model', description='Use ML models for prediction', resource='model', action='predict'),
            
            # Dashboard permissions
            'view_dashboard': Permission(name='view_dashboard', description='View dashboards', resource='dashboard', action='read'),
            'create_dashboard': Permission(name='create_dashboard', description='Create dashboards', resource='dashboard', action='create'),
            'update_dashboard': Permission(name='update_dashboard', description='Update dashboards', resource='dashboard', action='update'),
            'delete_dashboard': Permission(name='delete_dashboard', description='Delete dashboards', resource='dashboard', action='delete'),
            
            # System permissions
            'view_system': Permission(name='view_system', description='View system information', resource='system', action='read'),
            'update_system': Permission(name='update_system', description='Update system settings', resource='system', action='update'),
        }
        
        # Add all permissions to the database
        for permission in permissions.values():
            db.session.add(permission)
        
        # Create default roles
        admin_role = Role(name='admin', description='Administrator with full access')
        
        # Add all permissions to admin role
        for permission in permissions.values():
            admin_role.add_permission(permission)
        
        # Create analyst role
        analyst_role = Role(name='analyst', description='Data analyst with model access')
        analyst_permissions = [
            'view_user', 'view_model', 'create_model', 'update_model', 'train_model', 'predict_model',
            'view_dashboard', 'create_dashboard', 'update_dashboard'
        ]
        for perm_name in analyst_permissions:
            analyst_role.add_permission(permissions[perm_name])
        
        # Create user role (most basic access)
        user_role = Role(name='user', description='Basic user', is_default=True)
        user_permissions = ['view_user', 'view_model', 'predict_model', 'view_dashboard']
        for perm_name in user_permissions:
            user_role.add_permission(permissions[perm_name])
        
        # Add roles to database
        db.session.add(admin_role)
        db.session.add(analyst_role)
        db.session.add(user_role)
        
        # Commit changes
        db.session.commit()
        
        initialized_roles = db.session.query(Role).count()
        print(f"Initialized {len(permissions)} permissions and {initialized_roles} roles")

if __name__ == '__main__':
    init_roles_and_permissions() 