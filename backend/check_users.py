#!/usr/bin/env python3
import os
import sqlite3
import json

# Set up the database path
basedir = os.path.abspath(os.path.dirname(__file__))
db_path = os.path.join(basedir, 'app.db')

# Connect to the database
conn = sqlite3.connect(db_path)
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

def print_tables_as_json():
    """Print tables as JSON for better readability"""
    # Users
    print("\n=== USERS ===")
    cursor.execute("SELECT id, username, email, first_name, last_name, is_active FROM users")
    users = [dict(row) for row in cursor.fetchall()]
    print(json.dumps(users, indent=2))
    
    # Roles
    print("\n=== ROLES ===")
    cursor.execute("SELECT id, name, description, is_default FROM roles")
    roles = [dict(row) for row in cursor.fetchall()]
    print(json.dumps(roles, indent=2))
    
    # User Roles
    print("\n=== USER ROLES ===")
    cursor.execute("""
        SELECT u.username, r.name as role_name
        FROM users u
        JOIN user_roles ur ON u.id = ur.user_id
        JOIN roles r ON ur.role_id = r.id
    """)
    user_roles = [dict(row) for row in cursor.fetchall()]
    print(json.dumps(user_roles, indent=2))
    
    # Permissions
    print("\n=== PERMISSIONS ===")
    cursor.execute("SELECT id, name, resource, action FROM permissions")
    permissions = [dict(row) for row in cursor.fetchall()]
    print(json.dumps(permissions, indent=2))
    
    # Role Permissions
    print("\n=== ROLE PERMISSIONS ===")
    cursor.execute("""
        SELECT r.name as role_name, p.name as permission_name
        FROM roles r
        JOIN role_permissions rp ON r.id = rp.role_id
        JOIN permissions p ON rp.permission_id = p.id
    """)
    role_permissions = [dict(row) for row in cursor.fetchall()]
    print(json.dumps(role_permissions, indent=2))

try:
    print_tables_as_json()
finally:
    conn.close() 