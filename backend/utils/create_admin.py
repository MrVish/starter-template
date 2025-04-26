import sys
import os

# Add the parent directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Use the CLI app instead of the regular app
from cli_app import app
from models.dim_users import DimUser
from models.dim_roles import DimRole
from extensions import db
from werkzeug.security import generate_password_hash

def create_admin_user():
    with app.app_context():
        # Check if admin user already exists
        admin = DimUser.query.filter_by(username='admin').first()
        if admin:
            print("Admin user already exists!")
            return

        # Create admin user
        admin = DimUser(
            username='admin',
            email='admin@example.com',
            first_name='Admin',
            last_name='User',
            password_hash=generate_password_hash('admin123')
        )
        
        # Get or create admin role
        admin_role = DimRole.query.filter_by(name='admin').first()
        if not admin_role:
            print("Admin role not found! Please run init_roles_and_permissions first.")
            return

        # Add admin role to user
        admin.add_role(admin_role)

        # Save to database
        db.session.add(admin)
        db.session.commit()
        print("Admin user created successfully!")

if __name__ == '__main__':
    create_admin_user() 