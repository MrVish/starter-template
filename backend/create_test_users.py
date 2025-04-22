#!/usr/bin/env python3
"""
Script to create test users in PostgreSQL database.
"""
import os
import sys
from datetime import datetime
from werkzeug.security import generate_password_hash
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from app import create_app
from extensions import db

# Database connection string
DATABASE_URL = os.environ.get('DATABASE_URL', 'postgresql://postgres:postgres@db:5432/mlmonitor')

def create_test_users():
    """Create test users in the database"""
    app = create_app()
    
    with app.app_context():
        try:
            # Create admin role if it doesn't exist
            admin_role = db.session.execute(db.text("""
                INSERT INTO roles (name, description, is_default)
                VALUES ('admin', 'Administrator role', false)
                ON CONFLICT (name) DO NOTHING
                RETURNING id;
            """)).fetchone()

            if not admin_role:
                admin_role = db.session.execute(db.text(
                    "SELECT id FROM roles WHERE name = 'admin'"
                )).fetchone()

            if not admin_role:
                print("Error: Could not find or create admin role")
                return

            # Create test users
            test_users = [
                {
                    'username': 'admin',
                    'email': 'admin@example.com',
                    'password': 'admin123',
                    'first_name': 'Admin',
                    'last_name': 'User',
                    'is_active': True
                },
                {
                    'username': 'user1',
                    'email': 'user1@example.com',
                    'password': 'user123',
                    'first_name': 'Test',
                    'last_name': 'User 1',
                    'is_active': True
                },
                {
                    'username': 'user2',
                    'email': 'user2@example.com',
                    'password': 'user123',
                    'first_name': 'Test',
                    'last_name': 'User 2',
                    'is_active': True
                }
            ]

            for user in test_users:
                # Check if user already exists
                existing_user = db.session.execute(
                    db.text("SELECT id FROM users WHERE username = :username"),
                    {'username': user['username']}
                ).fetchone()

                if not existing_user:
                    # Create user
                    result = db.session.execute(db.text("""
                        INSERT INTO users (
                            username, email, password_hash, first_name, last_name, is_active,
                            created_at, updated_at
                        ) VALUES (
                            :username, :email, :password_hash, :first_name, :last_name, :is_active,
                            :created_at, :updated_at
                        ) RETURNING id;
                    """), {
                        'username': user['username'],
                        'email': user['email'],
                        'password_hash': generate_password_hash(user['password']),
                        'first_name': user['first_name'],
                        'last_name': user['last_name'],
                        'is_active': user['is_active'],
                        'created_at': datetime.utcnow(),
                        'updated_at': datetime.utcnow()
                    })
                    db.session.commit()

                    # Get user ID
                    user_id = result.fetchone()[0]

                    # Assign admin role to admin user
                    if user['username'] == 'admin':
                        db.session.execute(db.text("""
                            INSERT INTO user_roles (user_id, role_id)
                            VALUES (:user_id, :role_id)
                            ON CONFLICT (user_id, role_id) DO NOTHING;
                        """), {
                            'user_id': user_id,
                            'role_id': admin_role[0]
                        })
                        db.session.commit()

            print("Test users created successfully!")
            print("\nTest credentials:")
            print("Admin user:")
            print("  Username: admin")
            print("  Password: admin123")
            print("\nRegular users:")
            print("  Username: user1")
            print("  Password: user123")
            print("  Username: user2")
            print("  Password: user123")

        except Exception as e:
            print(f"Error creating test users: {str(e)}")
            db.session.rollback()

if __name__ == '__main__':
    create_test_users() 