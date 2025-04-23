import sys
import os

# Add the parent directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app
from models.user import Role, Permission
from extensions import db

def init_roles_and_permissions():
    """
    Initialize default roles and permissions in the database for a Marketing Analytics application
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
            
            # Campaign permissions
            'view_campaign': Permission(name='view_campaign', description='View marketing campaigns', resource='campaign', action='read'),
            'create_campaign': Permission(name='create_campaign', description='Create marketing campaigns', resource='campaign', action='create'),
            'update_campaign': Permission(name='update_campaign', description='Update marketing campaigns', resource='campaign', action='update'),
            'delete_campaign': Permission(name='delete_campaign', description='Delete marketing campaigns', resource='campaign', action='delete'),
            
            # Analytics permissions
            'view_analytics': Permission(name='view_analytics', description='View marketing analytics', resource='analytics', action='read'),
            'export_analytics': Permission(name='export_analytics', description='Export marketing analytics data', resource='analytics', action='export'),
            
            # AI Plan permissions
            'generate_ai_plan': Permission(name='generate_ai_plan', description='Generate AI-driven marketing plans', resource='ai_plan', action='generate'),
            'view_ai_plan': Permission(name='view_ai_plan', description='View AI-driven marketing plans', resource='ai_plan', action='read'),
            'update_ai_plan': Permission(name='update_ai_plan', description='Update AI-driven marketing plans', resource='ai_plan', action='update'),
            'delete_ai_plan': Permission(name='delete_ai_plan', description='Delete AI-driven marketing plans', resource='ai_plan', action='delete'),
            
            # Audience permissions
            'view_audience': Permission(name='view_audience', description='View audience segments', resource='audience', action='read'),
            'create_audience': Permission(name='create_audience', description='Create audience segments', resource='audience', action='create'),
            'update_audience': Permission(name='update_audience', description='Update audience segments', resource='audience', action='update'),
            'delete_audience': Permission(name='delete_audience', description='Delete audience segments', resource='audience', action='delete'),
            
            # Dashboard permissions
            'view_dashboard': Permission(name='view_dashboard', description='View marketing dashboards', resource='dashboard', action='read'),
            'create_dashboard': Permission(name='create_dashboard', description='Create marketing dashboards', resource='dashboard', action='create'),
            'update_dashboard': Permission(name='update_dashboard', description='Update marketing dashboards', resource='dashboard', action='update'),
            'delete_dashboard': Permission(name='delete_dashboard', description='Delete marketing dashboards', resource='dashboard', action='delete'),
            
            # System permissions
            'view_system': Permission(name='view_system', description='View system information', resource='system', action='read'),
            'update_system': Permission(name='update_system', description='Update system settings', resource='system', action='update'),
        }
        
        # Add all permissions to the database
        for permission in permissions.values():
            db.session.add(permission)
        
        # Create default roles
        admin_role = Role(name='admin', description='Administrator with full access to all marketing features')
        
        # Add all permissions to admin role
        for permission in permissions.values():
            admin_role.add_permission(permission)
        
        # Create marketing manager role
        marketing_manager_role = Role(name='marketing_manager', description='Marketing manager with campaign and analytics access')
        marketing_manager_permissions = [
            'view_user', 'view_campaign', 'create_campaign', 'update_campaign', 'delete_campaign',
            'view_analytics', 'export_analytics', 'generate_ai_plan', 'view_ai_plan', 'update_ai_plan', 'delete_ai_plan',
            'view_audience', 'create_audience', 'update_audience', 'delete_audience',
            'view_dashboard', 'create_dashboard', 'update_dashboard'
        ]
        for perm_name in marketing_manager_permissions:
            marketing_manager_role.add_permission(permissions[perm_name])
        
        # Create analyst role
        analyst_role = Role(name='analyst', description='Marketing analyst with analytics access')
        analyst_permissions = [
            'view_campaign', 'view_analytics', 'export_analytics', 
            'view_ai_plan', 'generate_ai_plan',
            'view_audience', 'create_audience', 'update_audience',
            'view_dashboard', 'create_dashboard', 'update_dashboard'
        ]
        for perm_name in analyst_permissions:
            analyst_role.add_permission(permissions[perm_name])
        
        # Create basic user role (most basic access)
        user_role = Role(name='user', description='Basic user with view access', is_default=True)
        user_permissions = ['view_campaign', 'view_analytics', 'view_ai_plan', 'view_audience', 'view_dashboard']
        for perm_name in user_permissions:
            user_role.add_permission(permissions[perm_name])
        
        # Add roles to database
        db.session.add(admin_role)
        db.session.add(marketing_manager_role)
        db.session.add(analyst_role)
        db.session.add(user_role)
        
        # Commit changes
        db.session.commit()
        
        initialized_roles = db.session.query(Role).count()
        print(f"Initialized {len(permissions)} permissions and {initialized_roles} roles")

if __name__ == '__main__':
    init_roles_and_permissions() 