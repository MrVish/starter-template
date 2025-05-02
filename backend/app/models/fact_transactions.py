"""
Transaction fact model for data warehouse star schema
"""
from sqlalchemy import Column, Integer, String, Numeric, DateTime, ForeignKey, CHAR
from sqlalchemy.sql.sqltypes import TIMESTAMP
from app.db.base_class import Base


class FactTransaction(Base):
    """Transaction fact model representing all financial transactions"""
    __tablename__ = "fact_transactions"

    transaction_key = Column(Integer, primary_key=True)
    txn_hk = Column(CHAR(32), unique=True, nullable=False)
    
    # Foreign keys to dimension tables
    customer_key = Column(Integer, ForeignKey("dim_customers.customer_key"), nullable=False)
    product_key = Column(Integer, ForeignKey("dim_products.product_key"), nullable=False)
    date_key = Column(Integer, ForeignKey("dim_dates.date_key"), nullable=False)
    branch_key = Column(Integer, ForeignKey("dim_branches.branch_key"), nullable=True)
    
    # Transaction attributes
    txn_type = Column(String(30))
    txn_amount = Column(Numeric(18, 2))
    txn_currency = Column(String(3))
    merchant_category = Column(String(50))
    txn_timestamp = Column(DateTime(timezone=True))
    load_dts = Column(DateTime(timezone=True)) 