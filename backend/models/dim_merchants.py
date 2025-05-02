"""
Merchant dimension model for data warehouse star schema
"""
from extensions import db

class DimMerchant(db.Model):
    """Merchant dimension model representing transaction merchants"""
    __tablename__ = "dim_merchants"

    id = db.Column(db.Integer, primary_key=True)
    merchant_hk = db.Column(db.String(32), unique=True, nullable=False)
    merchant_name = db.Column(db.String(100))
    merchant_category = db.Column(db.String(50))
    merchant_location = db.Column(db.String(100))
    merchant_country = db.Column(db.String(50))
    last_updated_dts = db.Column(db.DateTime(timezone=True))
    
    # Relationships
    spend_cc = db.relationship('FactSpendCC', backref='merchant')
    
    def __repr__(self):
        return f'<DimMerchant {self.merchant_name}>' 