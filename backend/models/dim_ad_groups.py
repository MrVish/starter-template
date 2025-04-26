from extensions import db

class DimAdGroup(db.Model):
    """Dimension table for Azure AD groups"""
    __tablename__ = 'dim_ad_groups'
    __table_args__ = {'extend_existing': True}
    
    id = db.Column(db.BigInteger, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    
    # Relationships through association table
    roles = db.relationship('DimRole', 
                           secondary='ad_group_role_mappings',
                           backref=db.backref('ad_groups', lazy='dynamic'),
                           lazy='dynamic')
    
    def __repr__(self):
        return f'<DimAdGroup {self.name}>'
        
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name
        } 