from extensions import db

class FactChannelPerformance(db.Model):
    """Fact table for channel performance metrics"""
    __tablename__ = 'fact_channel_performance'
    __table_args__ = {'extend_existing': True}
    
    id = db.Column(db.BigInteger, primary_key=True)
    campaign_id = db.Column(db.BigInteger, db.ForeignKey('dim_campaigns.id'))
    channel_id = db.Column(db.BigInteger, db.ForeignKey('dim_channels.id'), nullable=False)
    date_key = db.Column(db.Integer, db.ForeignKey('dim_dates.id'))  # Date dimension using YYYYMMDD format
    impressions = db.Column(db.BigInteger, default=0)
    clicks = db.Column(db.BigInteger, default=0)
    
    # Relationships
    date = db.relationship('DimDate', backref='channel_performances')
    campaign = db.relationship('DimCampaign', backref='channel_overall_performances')
    
    def __repr__(self):
        return f'<FactChannelPerformance id={self.id}, channel_id={self.channel_id}>'
        
    def to_dict(self):
        return {
            'id': self.id,
            'campaign_id': self.campaign_id,
            'channel_id': self.channel_id,
            'date_key': self.date_key,
            'impressions': self.impressions,
            'clicks': self.clicks,
            'ctr': (self.clicks / self.impressions) if self.impressions else 0
        } 