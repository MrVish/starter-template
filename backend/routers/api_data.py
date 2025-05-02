from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from sqlalchemy.orm import Session
from datetime import datetime, date
from decimal import Decimal

from models.dim_customers import DimCustomer
from models.dim_customer_ai_features import DimCustomerAIFeatures
from models.dim_segments import DimSegment
from models.dim_products import DimProduct
from models.dim_merchants import DimMerchant
from models.fact_transactions_main import FactTransactionMain
from models.fact_spend_cc import FactSpendCC
from models.fact_campaign_performance import FactCampaignPerformance
from models.fact_segment_performance import FactSegmentPerformance

from extensions import db

# Initialize router
router = APIRouter(
    prefix="/api/data",
    tags=["data"],
    responses={404: {"description": "Not found"}},
)

# Helper to get database session
def get_db():
    try:
        yield db.session
        db.session.commit()
    except Exception:
        db.session.rollback()
        raise
    finally:
        db.session.close()

# Customer endpoints
@router.get("/customers")
def get_customers(
    skip: int = 0, 
    limit: int = 100,
    segment_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """
    Get a list of customers with optional filtering by segment.
    """
    query = db.query(DimCustomer)
    
    if segment_id:
        query = query.filter(DimCustomer.latest_segment_id == segment_id)
    
    total = query.count()
    customers = query.offset(skip).limit(limit).all()
    
    # Convert to dict and add AI features
    results = []
    for customer in customers:
        customer_dict = customer.to_dict()
        
        # Add AI features if available
        ai_features = db.query(DimCustomerAIFeatures).filter_by(customer_id=customer.id).first()
        if ai_features:
            customer_dict["ai_features"] = ai_features.to_dict()
        
        results.append(customer_dict)
    
    return {
        "total": total,
        "customers": results
    }

@router.get("/customers/{customer_id}")
def get_customer(customer_id: int, db: Session = Depends(get_db)):
    """
    Get a single customer by ID with their AI features and segment.
    """
    customer = db.query(DimCustomer).filter(DimCustomer.id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    result = customer.to_dict()
    
    # Add AI features
    ai_features = db.query(DimCustomerAIFeatures).filter_by(customer_id=customer_id).first()
    if ai_features:
        result["ai_features"] = ai_features.to_dict()
    
    # Add segment
    if customer.latest_segment_id:
        segment = db.query(DimSegment).filter_by(id=customer.latest_segment_id).first()
        if segment:
            result["segment"] = segment.to_dict()
    
    return result

# Segment endpoints
@router.get("/segments")
def get_segments(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Get a list of customer segments.
    """
    total = db.query(DimSegment).count()
    segments = db.query(DimSegment).offset(skip).limit(limit).all()
    
    # Enhance segments with customer counts
    results = []
    for segment in segments:
        segment_dict = segment.to_dict()
        
        # Count customers in segment
        customer_count = db.query(DimCustomer).filter_by(latest_segment_id=segment.id).count()
        segment_dict["customer_count"] = customer_count
        
        # Get latest performance metrics
        latest_performance = (
            db.query(FactSegmentPerformance)
            .filter_by(segment_id=segment.id)
            .order_by(FactSegmentPerformance.date_key.desc())
            .first()
        )
        
        if latest_performance:
            segment_dict["latest_engagement_score"] = latest_performance.engagement_score
        
        results.append(segment_dict)
    
    return {
        "total": total,
        "segments": results
    }

@router.get("/segments/{segment_id}")
def get_segment(segment_id: int, db: Session = Depends(get_db)):
    """
    Get a single segment by ID with performance metrics.
    """
    segment = db.query(DimSegment).filter(DimSegment.id == segment_id).first()
    if not segment:
        raise HTTPException(status_code=404, detail="Segment not found")
    
    result = segment.to_dict()
    
    # Count customers in segment
    customer_count = db.query(DimCustomer).filter_by(latest_segment_id=segment.id).count()
    result["customer_count"] = customer_count
    
    # Get performance metrics for the last 30 days
    performances = (
        db.query(FactSegmentPerformance)
        .filter_by(segment_id=segment.id)
        .order_by(FactSegmentPerformance.date_key.desc())
        .limit(30)
        .all()
    )
    
    # Convert performance metrics to time series data
    performance_series = []
    for perf in performances:
        date_str = str(perf.date_key)
        year = int(date_str[0:4])
        month = int(date_str[4:6])
        day = int(date_str[6:8])
        
        performance_series.append({
            "date": date(year, month, day).isoformat(),
            "engagement_score": float(perf.engagement_score) if perf.engagement_score else 0
        })
    
    # Sort by date (oldest first)
    performance_series.sort(key=lambda x: x["date"])
    result["performance_series"] = performance_series
    
    return result

# Product endpoints
@router.get("/products")
def get_products(
    skip: int = 0, 
    limit: int = 100,
    product_type: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Get a list of products with optional filtering by type.
    """
    query = db.query(DimProduct)
    
    if product_type:
        query = query.filter(DimProduct.product_type == product_type)
    
    total = query.count()
    products = query.offset(skip).limit(limit).all()
    
    # Convert products to dict representation
    results = []
    for product in products:
        product_dict = {
            "product_key": product.product_key,
            "product_hk": product.product_hk,
            "account_number": product.account_number,
            "product_type": product.product_type,
            "credit_limit": float(product.credit_limit) if product.credit_limit else None,
            "principal_amt": float(product.principal_amt) if product.principal_amt else None,
            "interest_rate_pct": float(product.interest_rate_pct) if product.interest_rate_pct else None,
            "status": product.status,
            "reward_program": product.reward_program,
            "tenure_months": product.tenure_months,
            "property_type": product.property_type,
            "last_updated_dts": product.last_updated_dts.isoformat() if product.last_updated_dts else None
        }
        
        # Count transactions for product
        txn_count = db.query(FactTransactionMain).filter_by(product_key=product.product_key).count()
        product_dict["transaction_count"] = txn_count
        
        results.append(product_dict)
    
    return {
        "total": total,
        "products": results
    }

@router.get("/products/{product_key}")
def get_product(product_key: int, db: Session = Depends(get_db)):
    """
    Get a single product by ID with transaction metrics.
    """
    product = db.query(DimProduct).filter(DimProduct.product_key == product_key).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    result = {
        "product_key": product.product_key,
        "product_hk": product.product_hk,
        "account_number": product.account_number,
        "product_type": product.product_type,
        "credit_limit": float(product.credit_limit) if product.credit_limit else None,
        "principal_amt": float(product.principal_amt) if product.principal_amt else None,
        "interest_rate_pct": float(product.interest_rate_pct) if product.interest_rate_pct else None,
        "status": product.status,
        "reward_program": product.reward_program,
        "tenure_months": product.tenure_months,
        "property_type": product.property_type,
        "last_updated_dts": product.last_updated_dts.isoformat() if product.last_updated_dts else None
    }
    
    # Get transaction metrics
    transactions = db.query(FactTransactionMain).filter_by(product_key=product_key).all()
    
    # Calculate metrics
    total_amount = sum(float(txn.txn_amount) for txn in transactions if txn.txn_amount)
    avg_amount = total_amount / len(transactions) if transactions else 0
    
    result["transaction_count"] = len(transactions)
    result["total_amount"] = total_amount
    result["average_amount"] = avg_amount
    
    # Group transactions by type
    txn_types = {}
    for txn in transactions:
        txn_type = txn.txn_type or "UNKNOWN"
        if txn_type not in txn_types:
            txn_types[txn_type] = 0
        txn_types[txn_type] += 1
    
    result["transaction_types"] = txn_types
    
    return result

# Transaction endpoints
@router.get("/transactions")
def get_transactions(
    skip: int = 0, 
    limit: int = 100,
    customer_id: Optional[int] = None,
    product_key: Optional[int] = None,
    txn_type: Optional[str] = None,
    min_amount: Optional[float] = None,
    max_amount: Optional[float] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Get a list of transactions with optional filtering.
    """
    query = db.query(FactTransactionMain)
    
    # Apply filters
    if customer_id:
        query = query.filter(FactTransactionMain.customer_key == customer_id)
    
    if product_key:
        query = query.filter(FactTransactionMain.product_key == product_key)
    
    if txn_type:
        query = query.filter(FactTransactionMain.txn_type == txn_type)
    
    if min_amount is not None:
        query = query.filter(FactTransactionMain.txn_amount >= min_amount)
    
    if max_amount is not None:
        query = query.filter(FactTransactionMain.txn_amount <= max_amount)
    
    if start_date:
        start_dt = datetime.fromisoformat(start_date)
        query = query.filter(FactTransactionMain.txn_timestamp >= start_dt)
    
    if end_date:
        end_dt = datetime.fromisoformat(end_date)
        query = query.filter(FactTransactionMain.txn_timestamp <= end_dt)
    
    # Count total matching records
    total = query.count()
    
    # Get paginated results
    transactions = query.order_by(FactTransactionMain.txn_timestamp.desc()).offset(skip).limit(limit).all()
    
    # Convert to dict with additional data
    results = []
    for txn in transactions:
        txn_dict = {
            "transaction_key": txn.transaction_key,
            "txn_hk": txn.txn_hk,
            "customer_key": txn.customer_key,
            "product_key": txn.product_key,
            "date_key": txn.date_key,
            "branch_key": txn.branch_key,
            "txn_type": txn.txn_type,
            "txn_amount": float(txn.txn_amount) if txn.txn_amount else None,
            "txn_currency": txn.txn_currency,
            "merchant_category": txn.merchant_category,
            "txn_timestamp": txn.txn_timestamp.isoformat() if txn.txn_timestamp else None
        }
        
        # Add customer name if available
        customer = db.query(DimCustomer).filter_by(id=txn.customer_key).first()
        if customer:
            txn_dict["customer_name"] = customer.full_name
        
        # Add product info if available
        product = db.query(DimProduct).filter_by(product_key=txn.product_key).first()
        if product:
            txn_dict["product_type"] = product.product_type
            txn_dict["account_number"] = product.account_number
        
        results.append(txn_dict)
    
    return {
        "total": total,
        "transactions": results
    }

@router.get("/transactions/{transaction_key}")
def get_transaction(transaction_key: int, db: Session = Depends(get_db)):
    """
    Get a single transaction by ID with related data.
    """
    txn = db.query(FactTransactionMain).filter(FactTransactionMain.transaction_key == transaction_key).first()
    if not txn:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    result = {
        "transaction_key": txn.transaction_key,
        "txn_hk": txn.txn_hk,
        "customer_key": txn.customer_key,
        "product_key": txn.product_key,
        "date_key": txn.date_key,
        "branch_key": txn.branch_key,
        "txn_type": txn.txn_type,
        "txn_amount": float(txn.txn_amount) if txn.txn_amount else None,
        "txn_currency": txn.txn_currency,
        "merchant_category": txn.merchant_category,
        "txn_timestamp": txn.txn_timestamp.isoformat() if txn.txn_timestamp else None
    }
    
    # Add customer details
    customer = db.query(DimCustomer).filter_by(id=txn.customer_key).first()
    if customer:
        result["customer"] = {
            "id": customer.id,
            "full_name": customer.full_name,
            "email": customer.email,
            "location": customer.location,
            "joined_date": customer.joined_date.isoformat() if customer.joined_date else None
        }
    
    # Add product details
    product = db.query(DimProduct).filter_by(product_key=txn.product_key).first()
    if product:
        result["product"] = {
            "product_key": product.product_key,
            "product_type": product.product_type,
            "account_number": product.account_number,
            "status": product.status
        }
    
    return result

# Dashboard summary endpoint
@router.get("/dashboard-summary")
def get_dashboard_summary(db: Session = Depends(get_db)):
    """
    Get a summary of key metrics for the dashboard.
    """
    # Count total customers
    customer_count = db.query(DimCustomer).count()
    
    # Count total products
    product_count = db.query(DimProduct).count()
    
    # Count active products
    active_product_count = db.query(DimProduct).filter(DimProduct.status == "ACTIVE").count()
    
    # Sum transaction amounts
    txn_query = db.query(FactTransactionMain.txn_amount)
    total_txn_amount = sum(float(amount[0]) for amount in txn_query if amount[0])
    
    # Count transactions
    txn_count = db.query(FactTransactionMain).count()
    
    # Calculate average transaction amount
    avg_txn_amount = total_txn_amount / txn_count if txn_count else 0
    
    # Get segment distribution
    segment_distribution = []
    segments = db.query(DimSegment).all()
    for segment in segments:
        count = db.query(DimCustomer).filter_by(latest_segment_id=segment.id).count()
        segment_distribution.append({
            "segment_id": segment.id,
            "segment_name": segment.name,
            "customer_count": count,
            "percentage": (count / customer_count * 100) if customer_count else 0
        })
    
    # Get product type distribution
    product_distribution = {}
    products = db.query(DimProduct).all()
    for product in products:
        product_type = product.product_type
        if product_type not in product_distribution:
            product_distribution[product_type] = 0
        product_distribution[product_type] += 1
    
    product_type_data = [
        {"product_type": pt, "count": count}
        for pt, count in product_distribution.items()
    ]
    
    return {
        "customer_count": customer_count,
        "product_count": product_count,
        "active_product_count": active_product_count,
        "total_transaction_amount": total_txn_amount,
        "transaction_count": txn_count,
        "average_transaction_amount": avg_txn_amount,
        "segment_distribution": segment_distribution,
        "product_type_distribution": product_type_data
    } 