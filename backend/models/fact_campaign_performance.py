from datetime import datetime
from extensions import db

class FactCampaignPerformance(db.Model):
    """Fact table for campaign performance metrics"""
    __tablename__ = 'fact_campaign_performance'
    __table_args__ = {'extend_existing': True}
    
    id = db.Column(db.BigInteger, primary_key=True)
    campaign_id = db.Column(db.BigInteger, db.ForeignKey('dim_campaigns.id'), nullable=False)
    channel_id = db.Column(db.BigInteger, db.ForeignKey('dim_channels.id'), nullable=False)
    segment_id = db.Column(db.BigInteger, db.ForeignKey('dim_segments.id'))
    date_key = db.Column(db.Integer, db.ForeignKey('dim_dates.id'))  # Date dimension using YYYYMMDD format
    impressions = db.Column(db.BigInteger, default=0)
    clicks = db.Column(db.BigInteger, default=0)
    conversions = db.Column(db.BigInteger, default=0)
    spend = db.Column(db.DECIMAL(12, 2), default=0)
    
    # Relationships
    date = db.relationship('DimDate', backref='campaign_performances')
    segment = db.relationship('DimSegment', backref='campaign_performances')
    
    def __repr__(self):
        return f'<FactCampaignPerformance id={self.id}, campaign_id={self.campaign_id}>'
        
    def to_dict(self):
        return {
            'id': self.id,
            'campaign_id': self.campaign_id,
            'channel_id': self.channel_id,
            'segment_id': self.segment_id,
            'date_key': self.date_key,
            'impressions': self.impressions,
            'clicks': self.clicks,
            'conversions': self.conversions,
            'spend': float(self.spend) if self.spend else 0,
            'ctr': (self.clicks / self.impressions) if self.impressions else 0,
            'conversion_rate': (self.conversions / self.clicks) if self.clicks else 0,
            'cost_per_conversion': (float(self.spend) / self.conversions) if self.conversions else 0
        } 