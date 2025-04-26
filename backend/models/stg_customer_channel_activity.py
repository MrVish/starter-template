from datetime import datetime
from extensions import db

class StgCustomerChannelActivity(db.Model):
    """Staging table for customer interactions with marketing channels"""
    __tablename__ = 'stg_customer_channel_activity'
    __table_args__ = {'extend_existing': True}
    
    activity_id = db.Column(db.BigInteger, primary_key=True)
    customer_id = db.Column(db.String(50), nullable=False, index=True)
    campaign_id = db.Column(db.String(50), index=True)
    channel = db.Column(db.String(50))  # Email, SMS, In-App, Web
    event_type = db.Column(db.String(50))  # Impressed, Clicked, Opened, Bounced
    event_time = db.Column(db.DateTime)
    device_type = db.Column(db.String(50))  # Mobile, Desktop
    browser = db.Column(db.String(100))
    
    def __repr__(self):
        return f'<StgCustomerChannelActivity id={self.activity_id}, event={self.event_type}>'
        
    def to_dict(self):
        return {
            'activity_id': self.activity_id,
            'customer_id': self.customer_id,
            'campaign_id': self.campaign_id,
            'channel': self.channel,
            'event_type': self.event_type,
            'event_time': self.event_time.isoformat() if self.event_time else None,
            'device_type': self.device_type,
            'browser': self.browser
        } 