from extensions import db

class DimSegment(db.Model):
    """Dimension table for customer segments"""
    __tablename__ = 'dim_segments'
    __table_args__ = {'extend_existing': True}
    
    id = db.Column(db.BigInteger, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    definition = db.Column(db.Text)  # JSON logic definition
    
    # Relationships
    performances = db.relationship('FactSegmentPerformance', backref='segment')
    
    def __repr__(self):
        return f'<DimSegment {self.name}>'
        
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'definition': self.definition
        } 