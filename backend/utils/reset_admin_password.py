from models.user import User
from werkzeug.security import generate_password_hash
from cli_app import app

def reset_admin_password(new_password='admin123'):
    """Reset the admin user's password"""
    with app.app_context():
        # Find admin user
        admin = User.query.filter_by(username='admin').first()
        if not admin:
            print("Admin user not found!")
            return
        
        # Update password
        admin.password_hash = generate_password_hash(new_password)
        
        # Commit to database
        from extensions import db
        db.session.commit()
        
        print(f"Admin password has been reset to '{new_password}'")

if __name__ == '__main__':
    # Get password from command line if provided
    import sys
    password = sys.argv[1] if len(sys.argv) > 1 else 'admin123'
    reset_admin_password(password) 