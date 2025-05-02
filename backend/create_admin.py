#!/usr/bin/env python3
"""
Script to create admin user and regular user in the database.
This script directly manipulates the SQLite database without using SQLAlchemy.
"""
import os
import sqlite3
import hashlib
from datetime import datetime
from werkzeug.security import generate_password_hash
import sys
from cli_app import app
from extensions import db
from models.dim_users import DimUser
from models.dim_roles import DimRole

# Set up the database path
basedir = os.path.abspath(os.path.dirname(__file__))
db_path = os.path.join(basedir, 'app.db')

# Check if database exists
if not os.path.exists(db_path):
    print(f"Database file not found at {db_path}")
    print("Please run the application first to initialize the database.")
    sys.exit(1)

# Connect to the database
conn = sqlite3.connect(db_path)
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

def create_tables_if_not_exist():
    """Create necessary tables if they don't exist"""
    # Create roles table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS roles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(64) UNIQUE NOT NULL,
        description VARCHAR(255),
        is_default BOOLEAN DEFAULT 0
    )
    ''')
    
    # Create permissions table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS permissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(64) UNIQUE NOT NULL,
        description VARCHAR(255),
        resource VARCHAR(64),
        action VARCHAR(64)
    )
    ''')
    
    # Create users table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username VARCHAR(64) UNIQUE NOT NULL,
        email VARCHAR(120) UNIQUE NOT NULL,
        password_hash VARCHAR(128),
        first_name VARCHAR(64),
        last_name VARCHAR(64),
        is_active BOOLEAN DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login_at TIMESTAMP,
        oauth_provider VARCHAR(20),
        oauth_id VARCHAR(100)
    )
    ''')
    
    # Create role_permissions association table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS role_permissions (
        role_id INTEGER NOT NULL,
        permission_id INTEGER NOT NULL,
        PRIMARY KEY (role_id, permission_id),
        FOREIGN KEY (role_id) REFERENCES roles (id),
        FOREIGN KEY (permission_id) REFERENCES permissions (id)
    )
    ''')
    
    # Create user_roles association table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS user_roles (
        user_id INTEGER NOT NULL,
        role_id INTEGER NOT NULL,
        PRIMARY KEY (user_id, role_id),
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (role_id) REFERENCES roles (id)
    )
    ''')
    
    conn.commit()

def create_permissions():
    """Create permissions if they don't exist"""
    permissions = [
        # User management permissions
        {"name": "view_users", "resource": "user", "action": "view", 
         "description": "Can view user information"},
        {"name": "edit_users", "resource": "user", "action": "edit", 
         "description": "Can edit user information"},
        {"name": "delete_users", "resource": "user", "action": "delete", 
         "description": "Can delete users"},
        
        # ML model permissions
        {"name": "view_models", "resource": "model", "action": "view", 
         "description": "Can view ML models"},
        {"name": "create_models", "resource": "model", "action": "create", 
         "description": "Can create ML models"},
        {"name": "edit_models", "resource": "model", "action": "edit", 
         "description": "Can edit ML models"},
        {"name": "delete_models", "resource": "model", "action": "delete", 
         "description": "Can delete ML models"},
        {"name": "train_models", "resource": "model", "action": "train", 
         "description": "Can train ML models"},
        
        # Dashboard permissions
        {"name": "view_dashboard", "resource": "dashboard", "action": "view", 
         "description": "Can view dashboard"},
    ]
    
    for perm in permissions:
        cursor.execute('SELECT id FROM permissions WHERE name = ?', (perm['name'],))
        if not cursor.fetchone():
            cursor.execute(
                'INSERT INTO permissions (name, resource, action, description) VALUES (?, ?, ?, ?)',
                (perm['name'], perm['resource'], perm['action'], perm['description'])
            )
    
    conn.commit()
    
    # Return all permission IDs
    cursor.execute('SELECT id, name FROM permissions')
    return {row['name']: row['id'] for row in cursor.fetchall()}

def create_roles(permission_ids):
    """Create roles if they don't exist"""
    # Create admin role
    cursor.execute('SELECT id FROM roles WHERE name = ?', ('admin',))
    admin_role = cursor.fetchone()
    if not admin_role:
        cursor.execute(
            'INSERT INTO roles (name, description, is_default) VALUES (?, ?, ?)',
            ('admin', 'Administrator with full access', 0)
        )
        admin_role_id = cursor.lastrowid
    else:
        admin_role_id = admin_role['id']
    
    # Create user role
    cursor.execute('SELECT id FROM roles WHERE name = ?', ('user',))
    user_role = cursor.fetchone()
    if not user_role:
        cursor.execute(
            'INSERT INTO roles (name, description, is_default) VALUES (?, ?, ?)',
            ('user', 'Regular user with limited access', 1)
        )
        user_role_id = cursor.lastrowid
    else:
        user_role_id = user_role['id']
    
    # Add all permissions to admin role
    for perm_id in permission_ids.values():
        cursor.execute('SELECT * FROM role_permissions WHERE role_id = ? AND permission_id = ?', 
                      (admin_role_id, perm_id))
        if not cursor.fetchone():
            cursor.execute('INSERT INTO role_permissions (role_id, permission_id) VALUES (?, ?)',
                         (admin_role_id, perm_id))
    
    # Add view permissions to user role
    for perm_name, perm_id in permission_ids.items():
        if 'view' in perm_name:
            cursor.execute('SELECT * FROM role_permissions WHERE role_id = ? AND permission_id = ?', 
                          (user_role_id, perm_id))
            if not cursor.fetchone():
                cursor.execute('INSERT INTO role_permissions (role_id, permission_id) VALUES (?, ?)',
                             (user_role_id, perm_id))
    
    conn.commit()
    return admin_role_id, user_role_id

def create_users(admin_role_id, user_role_id):
    """Create admin and regular users if they don't exist"""
    # Create admin user
    cursor.execute('SELECT id FROM users WHERE username = ?', ('admin',))
    admin_user = cursor.fetchone()
    if not admin_user:
        password_hash = generate_password_hash('Admin123!')
        cursor.execute(
            'INSERT INTO users (username, email, password_hash, first_name, last_name, is_active) VALUES (?, ?, ?, ?, ?, ?)',
            ('admin', 'admin@example.com', password_hash, 'Admin', 'User', 1)
        )
        admin_user_id = cursor.lastrowid
    else:
        admin_user_id = admin_user['id']
    
    # Create regular user
    cursor.execute('SELECT id FROM users WHERE username = ?', ('user',))
    user = cursor.fetchone()
    if not user:
        password_hash = generate_password_hash('User123!')
        cursor.execute(
            'INSERT INTO users (username, email, password_hash, first_name, last_name, is_active) VALUES (?, ?, ?, ?, ?, ?)',
            ('user', 'user@example.com', password_hash, 'Test', 'User', 1)
        )
        user_id = cursor.lastrowid
    else:
        user_id = user['id']
    
    # Assign roles to users
    cursor.execute('SELECT * FROM user_roles WHERE user_id = ? AND role_id = ?', 
                  (admin_user_id, admin_role_id))
    if not cursor.fetchone():
        cursor.execute('INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)',
                     (admin_user_id, admin_role_id))
    
    cursor.execute('SELECT * FROM user_roles WHERE user_id = ? AND role_id = ?', 
                  (user_id, user_role_id))
    if not cursor.fetchone():
        cursor.execute('INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)',
                     (user_id, user_role_id))
    
    conn.commit()

def create_admin_user():
    with app.app_context():
        # Check if admin user already exists
        if DimUser.query.filter_by(username='admin').first():
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
        
        # Create roles if they don't exist
        admin_role = DimRole.query.filter_by(name='admin').first()
        if not admin_role:
            admin_role = DimRole(name='admin', description='Administrator role', is_default=False)
            db.session.add(admin_role)
            
        user_role = DimRole.query.filter_by(name='User').first()
        if not user_role:
            user_role = DimRole(name='User', description='Standard user role', is_default=True)
            db.session.add(user_role)
            
        db.session.commit()
        
        # Assign admin role to admin user
        admin.add_role(admin_role)
        db.session.commit()
        
        print('Admin user created successfully!')

def main():
    try:
        print("Creating tables if they don't exist...")
        create_tables_if_not_exist()
        
        print("Creating permissions...")
        permission_ids = create_permissions()
        
        print("Creating roles...")
        admin_role_id, user_role_id = create_roles(permission_ids)
        
        print("Creating users...")
        create_users(admin_role_id, user_role_id)
        
        print("\nUsers created successfully!")
        print("Admin credentials:")
        print("  Username: admin")
        print("  Password: Admin123!")
        print("\nRegular user credentials:")
        print("  Username: user")
        print("  Password: User123!")
    
    except Exception as e:
        conn.rollback()
        print(f"Error: {e}")
        sys.exit(1)
    finally:
        conn.close()

if __name__ == "__main__":
    create_admin_user() 