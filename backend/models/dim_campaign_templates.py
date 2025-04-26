from extensions import db

class DimCampaignTemplate(db.Model):
    """Dimension table for campaign templates"""
    __tablename__ = 'dim_campaign_templates'
    __table_args__ = {'extend_existing': True}
    
    id = db.Column(db.BigInteger, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    content = db.Column(db.Text)  # HTML/JSON content
    
    def __repr__(self):
        return f'<DimCampaignTemplate {self.title}>'
        
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'content': self.content
        } 