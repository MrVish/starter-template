from cli_app import app
from extensions import db
from models import DimUser, DimRole

def create_admin():
    with app.app_context():
        # Check if admin user already exists
        existing_admin = DimUser.query.filter_by(username='admin').first()
        if existing_admin:
            print("Admin user already exists")
            return
        
        # Create admin user
        admin = DimUser(
            username='admin',
            email='admin@example.com',
            first_name='Admin',
            last_name='User',
            is_active=True
        )
        admin.set_password('admin123')
        db.session.add(admin)
        
        # Create roles
        admin_role = DimRole.query.filter_by(name='admin').first()
        if not admin_role:
            admin_role = DimRole(name='admin', description='Administrator role', is_default=False)
            db.session.add(admin_role)
        
        user_role = DimRole.query.filter_by(name='User').first()
        if not user_role:
            user_role = DimRole(name='User', description='Standard user role', is_default=True)
            db.session.add(user_role)
        
        db.session.commit()
        
        # Add admin role to admin user
        admin.add_role(admin_role)
        db.session.commit()
        
        print("Admin user created successfully!")

if __name__ == "__main__":
    create_admin() 