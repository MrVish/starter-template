from datetime import datetime
from extensions import db
from werkzeug.security import generate_password_hash, check_password_hash
from models.associations import user_roles

class DimUser(db.Model):
    """User model for authentication and profile information"""
    __tablename__ = 'users'  # Match existing table name
    __table_args__ = {'extend_existing': True}
    
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
    roles = db.relationship('DimRole', 
                           secondary=user_roles,
                           backref=db.backref('users', lazy='dynamic'),
                           lazy='dynamic')
    
    def __repr__(self):
        return f'<DimUser {self.username}>'
    
    @property
    def full_name(self):
        if self.first_name and self.last_name:
            return f"{self.first_name} {self.last_name}"
        return self.username
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
        
    def check_password(self, password):
        if self.password_hash:
            return check_password_hash(self.password_hash, password)
        return False
    
    def add_role(self, role):
        if not self.has_role(role):
            self.roles.append(role)
    
    def remove_role(self, role):
        if self.has_role(role):
            self.roles.remove(role)
    
    def has_role(self, role):
        """Check if user has a specific role"""
        if isinstance(role, str):
            return self.roles.filter_by(name=role).first() is not None
        return self.roles.filter_by(id=role.id).first() is not None
    
    def has_permission(self, permission):
        """Check if user has a specific permission through any of their roles"""
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
            'full_name': self.full_name,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'roles': self.get_role_names()
        } 