from extensions import db

class FactCampaignKPIResult(db.Model):
    """Fact table for campaign KPI results/outcomes"""
    __tablename__ = 'fact_campaign_kpi_results'
    __table_args__ = {'extend_existing': True}
    
    id = db.Column(db.BigInteger, primary_key=True)
    campaign_id = db.Column(db.BigInteger, db.ForeignKey('dim_campaigns.id'), nullable=False)
    kpi_id = db.Column(db.BigInteger, db.ForeignKey('dim_kpis.id'), nullable=False)
    value = db.Column(db.DECIMAL(10, 2))  # The outcome/result value
    
    # Relationships are defined in the respective dimension tables
    
    def __repr__(self):
        return f'<FactCampaignKPIResult id={self.id}, campaign_id={self.campaign_id}, kpi_id={self.kpi_id}>'
        
    def to_dict(self):
        return {
            'id': self.id,
            'campaign_id': self.campaign_id,
            'kpi_id': self.kpi_id,
            'value': float(self.value) if self.value else None
        } 