"""
Branch dimension model for data warehouse star schema
"""
from extensions import db

class DimBranch(db.Model):
    """Branch dimension model representing branches and service channels"""
    __tablename__ = "dim_branches"

    branch_key = db.Column(db.Integer, primary_key=True)
    branch_hk = db.Column(db.String(32), unique=True, nullable=False)
    branch_code = db.Column(db.String(20), nullable=False)
    branch_name = db.Column(db.String(100))
    region = db.Column(db.String(50))
    branch_type = db.Column(db.String(30))
    channel_category = db.Column(db.String(30))
    active_flag = db.Column(db.String(1), default="Y")
    last_updated_dts = db.Column(db.DateTime(timezone=True))
    
    # Relationships
    transactions = db.relationship('FactTransaction', backref='branch')
    
    def __repr__(self):
        return f'<DimBranch {self.branch_name}>' 