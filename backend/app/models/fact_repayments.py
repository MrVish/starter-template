"""
Loan Repayments fact model for data warehouse star schema
"""
from sqlalchemy import Column, Integer, String, Numeric, DateTime, ForeignKey, CHAR
from sqlalchemy.sql.sqltypes import TIMESTAMP
from app.db.base_class import Base


class FactRepayment(Base):
    """Loan Repayments fact model for loan amortization and delinquency tracking"""
    __tablename__ = "fact_repayments"

    repayment_key = Column(Integer, primary_key=True)
    repayment_id = Column(CHAR(32), unique=True, nullable=False)
    
    # Foreign keys to dimension tables
    customer_key = Column(Integer, ForeignKey("dim_customers.customer_key"), nullable=False)
    product_key = Column(Integer, ForeignKey("dim_products.product_key"), nullable=False)
    date_key = Column(Integer, ForeignKey("dim_dates.date_key"), nullable=False)
    
    # Repayment attributes
    repayment_amount = Column(Numeric(18, 2))
    principal_component = Column(Numeric(18, 2))
    interest_component = Column(Numeric(18, 2))
    fee_component = Column(Numeric(18, 2))
    remaining_principal = Column(Numeric(18, 2))
    payment_method = Column(String(30))
    payment_status = Column(String(20))
    days_past_due = Column(Integer)
    repayment_timestamp = Column(DateTime(timezone=True))
    due_date = Column(DateTime(timezone=True))
    load_dts = Column(DateTime(timezone=True)) 