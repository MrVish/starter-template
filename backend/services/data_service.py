from datetime import datetime, date
from typing import Dict, List, Any, Optional
from decimal import Decimal
from sqlalchemy.orm import Session
from sqlalchemy import func, desc

from models.dim_customers import DimCustomer
from models.dim_customer_ai_features import DimCustomerAIFeatures
from models.dim_segments import DimSegment
from models.dim_products import DimProduct
from models.dim_merchants import DimMerchant
from models.dim_branches import DimBranch
from models.fact_transactions_main import FactTransactionMain
from models.fact_spend_cc import FactSpendCC
from models.fact_campaign_performance import FactCampaignPerformance
from models.fact_segment_performance import FactSegmentPerformance

class DataService:
    """Service for data operations and exposing the data warehouse to the API."""
    
    def __init__(self, db_session: Session):
        """Initialize the service with a database session.
        
        Args:
            db_session: SQLAlchemy database session
        """
        self.db = db_session
    
    def get_customers(self, skip: int = 0, limit: int = 100, segment_id: Optional[int] = None) -> Dict[str, Any]:
        """Get a list of customers with optional filtering by segment.
        
        Args:
            skip: Number of records to skip (pagination)
            limit: Maximum number of records to return
            segment_id: Optional segment ID to filter by
            
        Returns:
            Dictionary with total count and customer records
        """
        query = self.db.query(DimCustomer)
        
        if segment_id:
            query = query.filter(DimCustomer.latest_segment_id == segment_id)
        
        total = query.count()
        customers = query.offset(skip).limit(limit).all()
        
        # Convert to dict and add AI features
        results = []
        for customer in customers:
            customer_dict = customer.to_dict()
            
            # Add AI features if available
            ai_features = self.db.query(DimCustomerAIFeatures).filter_by(customer_id=customer.id).first()
            if ai_features:
                customer_dict["ai_features"] = ai_features.to_dict()
            
            results.append(customer_dict)
        
        return {
            "total": total,
            "customers": results
        }
    
    def get_customer(self, customer_id: int) -> Dict[str, Any]:
        """Get a single customer by ID with their AI features and segment.
        
        Args:
            customer_id: ID of the customer to retrieve
            
        Returns:
            Dictionary with customer details or None if not found
        """
        customer = self.db.query(DimCustomer).filter(DimCustomer.id == customer_id).first()
        if not customer:
            return None
        
        result = customer.to_dict()
        
        # Add AI features
        ai_features = self.db.query(DimCustomerAIFeatures).filter_by(customer_id=customer_id).first()
        if ai_features:
            result["ai_features"] = ai_features.to_dict()
        
        # Add segment
        if customer.latest_segment_id:
            segment = self.db.query(DimSegment).filter_by(id=customer.latest_segment_id).first()
            if segment:
                result["segment"] = segment.to_dict()
        
        return result
    
    def get_segments(self, skip: int = 0, limit: int = 100) -> Dict[str, Any]:
        """Get a list of customer segments.
        
        Args:
            skip: Number of records to skip (pagination)
            limit: Maximum number of records to return
            
        Returns:
            Dictionary with total count and segment records
        """
        total = self.db.query(DimSegment).count()
        segments = self.db.query(DimSegment).offset(skip).limit(limit).all()
        
        # Enhance segments with customer counts
        results = []
        for segment in segments:
            segment_dict = segment.to_dict()
            
            # Count customers in segment
            customer_count = self.db.query(DimCustomer).filter_by(latest_segment_id=segment.id).count()
            segment_dict["customer_count"] = customer_count
            
            # Get latest performance metrics
            latest_performance = (
                self.db.query(FactSegmentPerformance)
                .filter_by(segment_id=segment.id)
                .order_by(desc(FactSegmentPerformance.date_key))
                .first()
            )
            
            if latest_performance:
                segment_dict["latest_engagement_score"] = latest_performance.engagement_score
            
            results.append(segment_dict)
        
        return {
            "total": total,
            "segments": results
        }
    
    def get_segment(self, segment_id: int) -> Dict[str, Any]:
        """Get a single segment by ID with performance metrics.
        
        Args:
            segment_id: ID of the segment to retrieve
            
        Returns:
            Dictionary with segment details or None if not found
        """
        segment = self.db.query(DimSegment).filter(DimSegment.id == segment_id).first()
        if not segment:
            return None
        
        result = segment.to_dict()
        
        # Count customers in segment
        customer_count = self.db.query(DimCustomer).filter_by(latest_segment_id=segment.id).count()
        result["customer_count"] = customer_count
        
        # Get performance metrics for the last 30 days
        performances = (
            self.db.query(FactSegmentPerformance)
            .filter_by(segment_id=segment.id)
            .order_by(desc(FactSegmentPerformance.date_key))
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
    
    def get_products(self, skip: int = 0, limit: int = 100, product_type: Optional[str] = None) -> Dict[str, Any]:
        """Get a list of products with optional filtering by type.
        
        Args:
            skip: Number of records to skip (pagination)
            limit: Maximum number of records to return
            product_type: Optional product type to filter by
            
        Returns:
            Dictionary with total count and product records
        """
        query = self.db.query(DimProduct)
        
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
            txn_count = self.db.query(FactTransactionMain).filter_by(product_key=product.product_key).count()
            product_dict["transaction_count"] = txn_count
            
            results.append(product_dict)
        
        return {
            "total": total,
            "products": results
        }
    
    def get_product(self, product_key: int) -> Dict[str, Any]:
        """Get a single product by ID with transaction metrics.
        
        Args:
            product_key: Key of the product to retrieve
            
        Returns:
            Dictionary with product details or None if not found
        """
        product = self.db.query(DimProduct).filter(DimProduct.product_key == product_key).first()
        if not product:
            return None
        
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
        transactions = self.db.query(FactTransactionMain).filter_by(product_key=product_key).all()
        
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
    
    def get_transactions(self, skip: int = 0, limit: int = 100, filters: Dict = None) -> Dict[str, Any]:
        """Get a list of transactions with optional filtering.
        
        Args:
            skip: Number of records to skip (pagination)
            limit: Maximum number of records to return
            filters: Dictionary of filter conditions
            
        Returns:
            Dictionary with total count and transaction records
        """
        filters = filters or {}
        query = self.db.query(FactTransactionMain)
        
        # Apply filters
        if filters.get('customer_id'):
            query = query.filter(FactTransactionMain.customer_key == filters['customer_id'])
        
        if filters.get('product_key'):
            query = query.filter(FactTransactionMain.product_key == filters['product_key'])
        
        if filters.get('txn_type'):
            query = query.filter(FactTransactionMain.txn_type == filters['txn_type'])
        
        if filters.get('min_amount') is not None:
            query = query.filter(FactTransactionMain.txn_amount >= filters['min_amount'])
        
        if filters.get('max_amount') is not None:
            query = query.filter(FactTransactionMain.txn_amount <= filters['max_amount'])
        
        if filters.get('start_date'):
            start_dt = datetime.fromisoformat(filters['start_date'])
            query = query.filter(FactTransactionMain.txn_timestamp >= start_dt)
        
        if filters.get('end_date'):
            end_dt = datetime.fromisoformat(filters['end_date'])
            query = query.filter(FactTransactionMain.txn_timestamp <= end_dt)
        
        # Count total matching records
        total = query.count()
        
        # Get paginated results
        transactions = query.order_by(desc(FactTransactionMain.txn_timestamp)).offset(skip).limit(limit).all()
        
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
            customer = self.db.query(DimCustomer).filter_by(id=txn.customer_key).first()
            if customer:
                txn_dict["customer_name"] = customer.full_name
            
            # Add product info if available
            product = self.db.query(DimProduct).filter_by(product_key=txn.product_key).first()
            if product:
                txn_dict["product_type"] = product.product_type
                txn_dict["account_number"] = product.account_number
            
            results.append(txn_dict)
        
        return {
            "total": total,
            "transactions": results
        }
    
    def get_transaction(self, transaction_key: int) -> Dict[str, Any]:
        """Get a single transaction by ID with related data.
        
        Args:
            transaction_key: Key of the transaction to retrieve
            
        Returns:
            Dictionary with transaction details or None if not found
        """
        txn = self.db.query(FactTransactionMain).filter(FactTransactionMain.transaction_key == transaction_key).first()
        if not txn:
            return None
        
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
        customer = self.db.query(DimCustomer).filter_by(id=txn.customer_key).first()
        if customer:
            result["customer"] = {
                "id": customer.id,
                "full_name": customer.full_name,
                "email": customer.email,
                "location": customer.location,
                "joined_date": customer.joined_date.isoformat() if customer.joined_date else None
            }
        
        # Add product details
        product = self.db.query(DimProduct).filter_by(product_key=txn.product_key).first()
        if product:
            result["product"] = {
                "product_key": product.product_key,
                "product_type": product.product_type,
                "account_number": product.account_number,
                "status": product.status
            }
        
        return result
    
    def get_dashboard_summary(self) -> Dict[str, Any]:
        """Get a summary of key metrics for the dashboard.
        
        Returns:
            Dictionary with summary metrics
        """
        # Count total customers
        customer_count = self.db.query(DimCustomer).count()
        
        # Count total products
        product_count = self.db.query(DimProduct).count()
        
        # Count active products
        active_product_count = self.db.query(DimProduct).filter(DimProduct.status == "ACTIVE").count()
        
        # Sum transaction amounts
        txn_query = self.db.query(FactTransactionMain.txn_amount)
        total_txn_amount = sum(float(amount[0]) for amount in txn_query if amount[0])
        
        # Count transactions
        txn_count = self.db.query(FactTransactionMain).count()
        
        # Calculate average transaction amount
        avg_txn_amount = total_txn_amount / txn_count if txn_count else 0
        
        # Get segment distribution
        segment_distribution = []
        segments = self.db.query(DimSegment).all()
        for segment in segments:
            count = self.db.query(DimCustomer).filter_by(latest_segment_id=segment.id).count()
            segment_distribution.append({
                "segment_id": segment.id,
                "segment_name": segment.name,
                "customer_count": count,
                "percentage": (count / customer_count * 100) if customer_count else 0
            })
        
        # Get product type distribution
        product_distribution = {}
        products = self.db.query(DimProduct).all()
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