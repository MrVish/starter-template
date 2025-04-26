from extensions import db
import enum

class ChannelType(enum.Enum):
    EMAIL = "EMAIL"
    SMS = "SMS"
    APP = "APP"
    WEB = "WEB"
    SOCIAL = "SOCIAL"

class DimChannel(db.Model):
    """Dimension table for marketing channels"""
    __tablename__ = 'dim_channels'
    __table_args__ = {'extend_existing': True}
    
    id = db.Column(db.BigInteger, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    type = db.Column(db.Enum(ChannelType))
    
    # Relationships
    performances = db.relationship('FactChannelPerformance', backref='channel')
    campaign_performances = db.relationship('FactCampaignPerformance', backref='channel')
    
    def __repr__(self):
        return f'<DimChannel {self.name} ({self.type})>'
        
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'type': self.type.value if self.type else None
        } 