from app import create_app
from models.user import User
from extensions import db
from werkzeug.security import generate_password_hash

def reset_admin_password():
    app = create_app()
    with app.app_context():
        # Find admin user
        admin = User.query.filter_by(username='admin').first()
        if not admin:
            print("Admin user not found!")
            return

        # Reset password
        new_password = 'admin123'
        admin.password_hash = generate_password_hash(new_password)
        
        # Save to database
        db.session.commit()
        print(f"Admin password reset successfully! New password: {new_password}")

if __name__ == '__main__':
    reset_admin_password() 