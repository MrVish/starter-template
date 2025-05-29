from extensions import db

class FactSegmentPerformance(db.Model):
    """Fact table for segment performance metrics"""
    __tablename__ = 'fact_segment_performance'
    __table_args__ = {'extend_existing': True}
    
    id = db.Column(db.BigInteger, primary_key=True)
    segment_id = db.Column(db.BigInteger, db.ForeignKey('dim_segments.id'), nullable=False)
    date_key = db.Column(db.Integer, db.ForeignKey('dim_dates.id'))  # Date dimension using YYYYMMDD format
    engagement_score = db.Column(db.DECIMAL(5, 2))  # 0-100 score
    retention_rate = db.Column(db.DECIMAL(5, 2))  # Percentage of customers retained
    
    # Relationships
    date = db.relationship('DimDate', backref='segment_performances')
    
    def __repr__(self):
        return f'<FactSegmentPerformance id={self.id}, segment_id={self.segment_id}>'
        
    def to_dict(self):
        return {
            'id': self.id,
            'segment_id': self.segment_id,
            'date_key': self.date_key,
            'engagement_score': float(self.engagement_score) if self.engagement_score else None,
            'retention_rate': float(self.retention_rate) if self.retention_rate else None
        } 