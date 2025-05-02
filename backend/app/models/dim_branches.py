"""
Branch dimension model for data warehouse star schema
"""
from sqlalchemy import Column, Integer, String, DateTime, CHAR
from sqlalchemy.sql.sqltypes import TIMESTAMP
from app.db.base_class import Base


class DimBranch(Base):
    """Branch dimension model representing branches and service channels"""
    __tablename__ = "dim_branches"

    branch_key = Column(Integer, primary_key=True)
    branch_hk = Column(CHAR(32), unique=True, nullable=False)
    branch_code = Column(String(20), nullable=False)
    branch_name = Column(String(100))
    region = Column(String(50))
    branch_type = Column(String(30))
    channel_category = Column(String(30))
    active_flag = Column(String(1), default="Y")
    last_updated_dts = Column(DateTime(timezone=True)) 