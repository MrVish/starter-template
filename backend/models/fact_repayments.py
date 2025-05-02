"""
Loan Repayments fact model for data warehouse star schema
"""
from extensions import db

class FactRepayment(db.Model):
    """Loan Repayments fact model for loan amortization and delinquency tracking"""
    __tablename__ = "fact_repayments"

    repayment_key = db.Column(db.Integer, primary_key=True)
    repayment_id = db.Column(db.String(32), unique=True, nullable=False)
    
    # Foreign keys to dimension tables
    customer_key = db.Column(db.Integer, db.ForeignKey("dim_customers.id"), nullable=False)
    product_key = db.Column(db.Integer, db.ForeignKey("dim_products.product_key"), nullable=False)
    date_key = db.Column(db.Integer, db.ForeignKey("dim_dates.id"), nullable=False)
    
    # Repayment attributes
    repayment_amount = db.Column(db.Numeric(18, 2))
    principal_component = db.Column(db.Numeric(18, 2))
    interest_component = db.Column(db.Numeric(18, 2))
    fee_component = db.Column(db.Numeric(18, 2))
    remaining_principal = db.Column(db.Numeric(18, 2))
    payment_method = db.Column(db.String(30))
    payment_status = db.Column(db.String(20))
    days_past_due = db.Column(db.Integer)
    repayment_timestamp = db.Column(db.DateTime(timezone=True))
    due_date = db.Column(db.DateTime(timezone=True))
    load_dts = db.Column(db.DateTime(timezone=True))
    
    def __repr__(self):
        return f'<FactRepayment {self.repayment_amount}>' 