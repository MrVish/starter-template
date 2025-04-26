from extensions import db

class DimDataSource(db.Model):
    """Dimension table for data sources (source systems)"""
    __tablename__ = 'dim_data_sources'
    __table_args__ = {'extend_existing': True}
    
    id = db.Column(db.BigInteger, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    
    # Relationships
    ingestion_runs = db.relationship('FactDataIngestionRun', backref='source')
    
    def __repr__(self):
        return f'<DimDataSource {self.name}>'
        
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name
        } 