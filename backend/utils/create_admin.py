import sys
import os

# Add the parent directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app
from app.models.user import User, Role
from app.extensions import db

def create_admin_user():
    app = create_app()
    with app.app_context():
        # Check if admin user already exists
        admin = User.query.filter_by(username='admin').first()
        if admin:
            print("Admin user already exists!")
            return

        # Create admin user
        admin = User(
            username='admin',
            email='admin@example.com',
        )
        admin.set_password('admin123')  # Hash the password

        # Get or create admin role
        admin_role = Role.query.filter_by(name='admin').first()
        if not admin_role:
            print("Admin role not found! Please run init_roles_and_permissions first.")
            return

        # Add admin role to user
        admin.roles.append(admin_role)

        # Save to database
        db.session.add(admin)
        db.session.commit()
        print("Admin user created successfully!")

if __name__ == '__main__':
    create_admin_user() 