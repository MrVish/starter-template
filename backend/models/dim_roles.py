from extensions import db
from models.associations import role_permissions

class DimRole(db.Model):
    """Dimension table for user roles"""
    __tablename__ = 'roles'  # Match existing table name
    __table_args__ = {'extend_existing': True}
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), unique=True, nullable=False)
    description = db.Column(db.String(255))
    is_default = db.Column(db.Boolean, default=False)
    
    # Relationships defined through backrefs in the other models
    
    def __repr__(self):
        return f'<DimRole {self.name}>'
        
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'is_default': self.is_default,
            'permissions': [permission.name for permission in self.permissions]
        }
    
    def add_permission(self, permission):
        if not self.has_permission(permission):
            self.permissions.append(permission)
    
    def remove_permission(self, permission):
        if self.has_permission(permission):
            self.permissions.remove(permission)
    
    def has_permission(self, permission):
        """Check if role has a specific permission"""
        if isinstance(permission, str):
            return any(p.name == permission for p in self.permissions)
        return permission in self.permissions
    
    def reset_permissions(self):
        self.permissions = [] 