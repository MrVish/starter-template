from datetime import datetime
from extensions import db

class DimCampaign(db.Model):
    """Dimension table for marketing campaigns"""
    __tablename__ = 'dim_campaigns'
    __table_args__ = {'extend_existing': True}
    
    id = db.Column(db.BigInteger, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    type = db.Column(db.String(100))  # awareness, retargeting, etc.
    start_date = db.Column(db.Date)
    end_date = db.Column(db.Date)
    segment_id = db.Column(db.BigInteger, db.ForeignKey('dim_segments.id'))
    template_id = db.Column(db.BigInteger, db.ForeignKey('dim_campaign_templates.id'))
    created_by = db.Column(db.BigInteger, db.ForeignKey('users.id'))
    
    # Relationships
    segment = db.relationship('DimSegment', backref='campaigns')
    template = db.relationship('DimCampaignTemplate', backref='campaigns')
    creator = db.relationship('DimUser', 
                             backref='created_campaigns',
                             primaryjoin="DimCampaign.created_by == DimUser.id")
    channel_performances = db.relationship('FactCampaignPerformance', backref='campaign')
    
    def __repr__(self):
        return f'<DimCampaign {self.name}>'
        
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'type': self.type,
            'start_date': self.start_date.isoformat() if self.start_date else None,
            'end_date': self.end_date.isoformat() if self.end_date else None,
            'segment_id': self.segment_id,
            'template_id': self.template_id,
            'created_by': self.created_by
        } 