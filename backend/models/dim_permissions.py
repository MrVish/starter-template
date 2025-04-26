from extensions import db
from models.associations import role_permissions

class DimPermission(db.Model):
    """Dimension table for permissions"""
    __tablename__ = 'permissions'  # Match existing table name
    __table_args__ = {'extend_existing': True}
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), unique=True, nullable=False)
    description = db.Column(db.String(255))
    resource = db.Column(db.String(64))  # e.g., 'model', 'report', etc.
    action = db.Column(db.String(64))    # e.g., 'read', 'write', 'delete', etc.
    
    # Relationship with roles using the association table
    roles = db.relationship('DimRole', 
                           secondary=role_permissions,
                           backref=db.backref('permissions', lazy='joined'),
                           lazy='joined')
    
    def __repr__(self):
        return f'<DimPermission {self.name}>'
        
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'resource': self.resource,
            'action': self.action
        } 