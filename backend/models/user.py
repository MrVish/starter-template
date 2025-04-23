from datetime import datetime
from extensions import db
from sqlalchemy import Table, Column, Integer, ForeignKey

# Role-Permission association table
role_permissions = db.Table('role_permissions',
    db.Column('role_id', db.Integer, db.ForeignKey('roles.id'), primary_key=True),
    db.Column('permission_id', db.Integer, db.ForeignKey('permissions.id'), primary_key=True)
)

# User-Role association table
user_roles = db.Table('user_roles',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True),
    db.Column('role_id', db.Integer, db.ForeignKey('roles.id'), primary_key=True)
)

class Permission(db.Model):
    """Permission model for RBAC"""
    __tablename__ = 'permissions'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), unique=True, nullable=False)
    description = db.Column(db.String(255))
    resource = db.Column(db.String(64))  # e.g., 'model', 'report', etc.
    action = db.Column(db.String(64))    # e.g., 'read', 'write', 'delete', etc.
    
    def __repr__(self):
        return f'<Permission {self.name}>'
        
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'resource': self.resource,
            'action': self.action
        }

class Role(db.Model):
    """Role model for RBAC"""
    __tablename__ = 'roles'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), unique=True, nullable=False)
    description = db.Column(db.String(255))
    is_default = db.Column(db.Boolean, default=False)
    
    # Many-to-many relationship with permissions
    permissions = db.relationship('Permission', 
                                  secondary=role_permissions,
                                  backref=db.backref('roles', lazy='dynamic'),
                                  lazy='dynamic')
    
    def __repr__(self):
        return f'<Role {self.name}>'
        
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'is_default': self.is_default
        }
    
    def add_permission(self, permission):
        if not self.has_permission(permission):
            self.permissions.append(permission)
    
    def remove_permission(self, permission):
        if self.has_permission(permission):
            self.permissions.remove(permission)
    
    def has_permission(self, permission):
        return self.permissions.filter_by(id=permission.id).first() is not None
    
    def reset_permissions(self):
        self.permissions = []

class User(db.Model):
    """User model for authentication and profile information"""
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, nullable=False, index=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(128))
    first_name = db.Column(db.String(64))
    last_name = db.Column(db.String(64))
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_login_at = db.Column(db.DateTime)
    
    # OAuth fields
    oauth_provider = db.Column(db.String(20))  # google, azure, etc.
    oauth_id = db.Column(db.String(100))
    
    # Many-to-many relationship with roles
    roles = db.relationship('Role', 
                            secondary=user_roles,
                            backref=db.backref('users', lazy='dynamic'),
                            lazy='dynamic')
    
    def __repr__(self):
        return f'<User {self.username}>'
    
    @property
    def full_name(self):
        if self.first_name and self.last_name:
            return f"{self.first_name} {self.last_name}"
        return self.username
    
    def add_role(self, role):
        if not self.has_role(role):
            self.roles.append(role)
    
    def remove_role(self, role):
        if self.has_role(role):
            self.roles.remove(role)
    
    def has_role(self, role):
        if isinstance(role, str):
            return self.roles.filter_by(name=role).first() is not None
        return self.roles.filter_by(id=role.id).first() is not None
    
    def has_permission(self, permission):
        for role in self.roles:
            if role.has_permission(permission):
                return True
        return False
    
    def can(self, action, resource):
        for role in self.roles:
            if role.permissions.filter_by(action=action, resource=resource).first():
                return True
        return False
    
    @property
    def is_admin(self):
        return self.has_role('admin')
    
    def get_role_names(self):
        return [role.name for role in self.roles]
    
    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'roles': self.get_role_names()
        }
 