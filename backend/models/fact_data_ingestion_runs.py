from datetime import datetime
from extensions import db

class FactDataIngestionRun(db.Model):
    """Fact table for data ingestion run records"""
    __tablename__ = 'fact_data_ingestion_runs'
    __table_args__ = {'extend_existing': True}
    
    id = db.Column(db.BigInteger, primary_key=True)
    source_id = db.Column(db.BigInteger, db.ForeignKey('dim_data_sources.id'), nullable=False)
    status = db.Column(db.String(20))  # Success, Failure
    row_count = db.Column(db.Integer)  # Number of rows loaded
    run_time = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<FactDataIngestionRun id={self.id}, status={self.status}>'
        
    def to_dict(self):
        return {
            'id': self.id,
            'source_id': self.source_id,
            'status': self.status,
            'row_count': self.row_count,
            'run_time': self.run_time.isoformat() if self.run_time else None
        } 