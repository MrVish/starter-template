"""
Product dimension model for data warehouse star schema
"""
from sqlalchemy import Column, Integer, String, Numeric, DateTime, CHAR
from sqlalchemy.sql.sqltypes import TIMESTAMP
from app.db.base_class import Base


class DimProduct(Base):
    """Product dimension model representing products across all product types"""
    __tablename__ = "dim_products"

    product_key = Column(Integer, primary_key=True)
    product_hk = Column(CHAR(32), unique=True, nullable=False)
    account_number = Column(String(50))
    product_type = Column(String(30))          # CREDIT_CARD / HOME_LOAN ...
    credit_limit = Column(Numeric(18, 2))
    principal_amt = Column(Numeric(18, 2))
    interest_rate_pct = Column(Numeric(5, 2))
    status = Column(String(20))
    reward_program = Column(String(50))
    tenure_months = Column(Integer)
    property_type = Column(String(50))
    last_updated_dts = Column(DateTime(timezone=True)) 