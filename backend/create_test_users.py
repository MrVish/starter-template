#!/usr/bin/env python
"""
Script to create test users for development.
"""
import os
import sys
import json
import random
from datetime import datetime
from werkzeug.security import generate_password_hash

# Add the parent directory to the path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from cli_app import app
from models.dim_users import DimUser
from models.dim_roles import DimRole
from extensions import db

def create_test_users(num_users=20, output_file=None):
    """Create test users for development"""
    with app.app_context():
        # Check if we already have many users
        existing_count = DimUser.query.count()
        if existing_count > 10:
            print(f"Database already has {existing_count} users. Skipping test user creation.")
            return
            
        # Get roles
        admin_role = DimRole.query.filter_by(name='admin').first()
        analyst_role = DimRole.query.filter_by(name='analyst').first()
        user_role = DimRole.query.filter_by(name='user').first()
        
        if not admin_role or not analyst_role or not user_role:
            print("Required roles not found. Please run init_db.py first.")
            return
        
        # Sample names
        first_names = [
            "James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda", 
            "William", "Elizabeth", "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica", 
            "Thomas", "Sarah", "Charles", "Karen", "Christopher", "Nancy", "Daniel", "Lisa", 
            "Matthew", "Margaret", "Anthony", "Betty", "Mark", "Sandra", "Donald", "Ashley", 
            "Steven", "Kimberly", "Paul", "Donna", "Andrew", "Emily", "Joshua", "Michelle"
        ]
        
        last_names = [
            "Smith", "Johnson", "Williams", "Jones", "Brown", "Davis", "Miller", "Wilson", 
            "Moore", "Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin", 
            "Thompson", "Garcia", "Martinez", "Robinson", "Clark", "Rodriguez", "Lewis", "Lee", 
            "Walker", "Hall", "Allen", "Young", "King", "Wright", "Lopez", "Hill", "Scott", 
            "Green", "Adams", "Baker", "Gonzalez", "Nelson", "Carter", "Mitchell"
        ]
        
        # Create users
        users = []
        for i in range(num_users):
            first_name = random.choice(first_names)
            last_name = random.choice(last_names)
            username = f"{first_name.lower()}.{last_name.lower()}{random.randint(1, 999)}"
            email = f"{username}@example.com"
            
            # Check if username or email already exists
            if DimUser.query.filter((DimUser.username == username) | (DimUser.email == email)).first():
                continue
                
            # Create user
            user = {
                'username': username,
                'email': email,
                'password': 'Password123!',
                'password_hash': generate_password_hash('Password123!'),
                'first_name': first_name,
                'last_name': last_name,
                'is_active': True,
                'created_at': datetime.utcnow().isoformat(),
                'updated_at': datetime.utcnow().isoformat()
            }
            
            # Create in database
            db_user = DimUser(
                username=user['username'],
                email=user['email'],
                password_hash=user['password_hash'],
                first_name=user['first_name'],
                last_name=user['last_name'],
                is_active=user['is_active']
            )
            
            # Assign role - most users get 'user' role, some get analyst or admin
            role_assignment = random.random()
            if role_assignment < 0.1:  # 10% admins
                db_user.add_role(admin_role)
                user['role'] = 'admin'
            elif role_assignment < 0.3:  # 20% analysts
                db_user.add_role(analyst_role)
                user['role'] = 'analyst'
            else:  # 70% regular users
                db_user.add_role(user_role)
                user['role'] = 'user'
                
            db.session.add(db_user)
            users.append(user)
            
        # Commit to database
        db.session.commit()
        
        # Save to file if requested
        if output_file:
            with open(output_file, 'w') as f:
                json.dump(users, f, indent=2)
                
        print(f"Created {len(users)} test users")
        return users

if __name__ == '__main__':
    create_test_users(output_file='test_users.json') 