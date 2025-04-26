from extensions import db

class DimKPI(db.Model):
    """Dimension table for Key Performance Indicators"""
    __tablename__ = 'dim_kpis'
    __table_args__ = {'extend_existing': True}
    
    id = db.Column(db.BigInteger, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    definition = db.Column(db.Text)  # Formula or calculation definition
    
    # Relationships
    kpi_results = db.relationship('FactCampaignKPIResult', backref='kpi')
    
    def __repr__(self):
        return f'<DimKPI {self.name}>'
        
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'definition': self.definition
        } 