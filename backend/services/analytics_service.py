from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta, date
from sqlalchemy import func, desc
from extensions import db
from models import (
    DimCampaign, 
    DimChannel, 
    DimSegment,
    FactCampaignPerformance,
    FactChannelPerformance,
    FactSegmentPerformance,
    DimDate,
    DimCustomer,
    FactTransaction
)
from repositories.campaign_repository import CampaignRepository
from repositories.customer_repository import CustomerRepository
from sqlalchemy.orm import Session

class AnalyticsService:
    """Service for analytics-related operations."""

    def __init__(self, db_session: Session = None):
        """Initialize the service with a database session.
        
        Args:
            db_session: SQLAlchemy database session, defaults to None and uses db.session
        """
        self.db_session = db_session or db.session
        self.campaign_repository = CampaignRepository()
        self.customer_repository = CustomerRepository()
    
    def get_campaign_metrics(self, campaign_id: int) -> Dict[str, Any]:
        """Get metrics for a specific campaign.
        
        Args:
            campaign_id: ID of the campaign
            
        Returns:
            Dictionary containing campaign metrics
        """
        # In a real implementation, this would query the database
        # For now, return mock data
        return {
            "impressions": 12500,
            "clicks": 750,
            "conversions": 85,
            "ctr": 0.06,
            "conversion_rate": 0.113,
            "cost": 2500.00,
            "revenue": 8500.00,
            "roi": 2.4
        }
    
    def get_dashboard_summary(self) -> Dict[str, Any]:
        """Get summary metrics for the analytics dashboard.
        
        Returns:
            Dictionary with summary metrics for various aspects
        """
        today = date.today()
        # Get date 30 days ago for monthly metrics
        month_ago = today - timedelta(days=30)
        
        # Convert dates to integer format for date dimension
        today_key = int(today.strftime('%Y%m%d'))
        month_ago_key = int(month_ago.strftime('%Y%m%d'))
        
        # Active campaigns count
        active_campaigns = len(self.campaign_repository.get_active_campaigns())
        
        # Aggregated monthly performance
        monthly_performance = db.session.query(
            func.sum(FactCampaignPerformance.impressions).label('total_impressions'),
            func.sum(FactCampaignPerformance.clicks).label('total_clicks'),
            func.sum(FactCampaignPerformance.conversions).label('total_conversions'),
            func.sum(FactCampaignPerformance.spend).label('total_spend')
        ).join(
            DimDate, DimDate.id == FactCampaignPerformance.date_key
        ).filter(
            DimDate.id >= month_ago_key,
            DimDate.id <= today_key
        ).first()
        
        # Channel distribution
        channel_distribution = db.session.query(
            DimChannel.name,
            func.sum(FactChannelPerformance.impressions).label('channel_impressions')
        ).join(
            FactChannelPerformance, FactChannelPerformance.channel_id == DimChannel.id
        ).join(
            DimDate, DimDate.id == FactChannelPerformance.date_key
        ).filter(
            DimDate.id >= month_ago_key,
            DimDate.id <= today_key
        ).group_by(
            DimChannel.id, DimChannel.name
        ).all()
        
        # Customer segment distribution
        segment_distribution = self.customer_repository.get_customer_segment_distribution()
        
        # Total customers count
        total_customers = db.session.query(func.count(DimCustomer.id)).scalar() or 0
        
        return {
            "campaigns": {
                "active": active_campaigns,
                "paused": 0,
                "draft": 0,
                "total_spend": float(monthly_performance.total_spend) if monthly_performance and monthly_performance.total_spend else 0,
                "total_revenue": 0
            },
            "channels": {
                "email": {"engagement_rate": 0.22, "conversion_rate": 0.05},
                "social": {"engagement_rate": 0.15, "conversion_rate": 0.02},
                "search": {"engagement_rate": 0.08, "conversion_rate": 0.04},
                "display": {"engagement_rate": 0.03, "conversion_rate": 0.01}
            },
            "segments": {
                "high_value": {"size": 5600, "engagement_rate": 0.25},
                "medium_value": {"size": 12000, "engagement_rate": 0.18},
                "low_value": {"size": 28000, "engagement_rate": 0.08}
            },
            "total_customers": total_customers,
            "monthly_metrics": {
                'impressions': monthly_performance.total_impressions or 0 if monthly_performance else 0,
                'clicks': monthly_performance.total_clicks or 0 if monthly_performance else 0,
                'conversions': monthly_performance.total_conversions or 0 if monthly_performance else 0,
                'spend': float(monthly_performance.total_spend) if monthly_performance and monthly_performance.total_spend else 0,
                'ctr': (monthly_performance.total_clicks / monthly_performance.total_impressions 
                       if monthly_performance and monthly_performance.total_impressions and monthly_performance.total_clicks 
                       else 0),
                'conversion_rate': (monthly_performance.total_conversions / monthly_performance.total_clicks 
                                  if monthly_performance and monthly_performance.total_clicks and monthly_performance.total_conversions 
                                  else 0),
            },
            'channel_distribution': [
                {'name': name, 'value': int(impressions or 0)} 
                for name, impressions in channel_distribution
            ],
            'segment_distribution': segment_distribution
        }
    
    def get_campaign_performance_over_time(
        self, 
        campaign_id: Optional[int] = None,
        start_date: datetime = None,
        end_date: datetime = None,
        metrics: List[str] = None
    ) -> Dict[str, Any]:
        """Get campaign performance metrics over time.
        
        Args:
            campaign_id: Optional ID to filter for a specific campaign
            start_date: Start date for the data range
            end_date: End date for the data range
            metrics: List of metric names to include
            
        Returns:
            Dictionary with time series data for requested metrics
        """
        if start_date is None:
            start_date = datetime.now() - timedelta(days=30)
        if end_date is None:
            end_date = datetime.now()
        if metrics is None:
            metrics = ["impressions", "clicks", "conversions", "revenue"]
        
        # In a real implementation, this would query the database
        # For now, return mock time series data
        days = (end_date - start_date).days
        
        result = {
            "dates": [(start_date + timedelta(days=i)).strftime("%Y-%m-%d") for i in range(days)],
            "metrics": {}
        }
        
        # Generate mock data for each metric
        import random
        for metric in metrics:
            if metric == "impressions":
                base_value = 500
                variance = 100
            elif metric == "clicks":
                base_value = 50
                variance = 15
            elif metric == "conversions":
                base_value = 5
                variance = 2
            elif metric == "revenue":
                base_value = 300
                variance = 100
            else:
                base_value = 10
                variance = 5
                
            result["metrics"][metric] = [
                max(0, base_value + random.randint(-variance, variance))
                for _ in range(days)
            ]
        
        return result

    def get_channel_performance(self) -> Dict[str, Any]:
        """Get performance metrics by channel.
        
        Returns:
            Dictionary with performance data for each channel
        """
        return {
            "email": {
                "sent": 25000,
                "delivered": 24200,
                "opened": 8470,
                "clicked": 2178,
                "converted": 326,
                "revenue": 16300.00,
                "cost": 2500.00,
                "roi": 5.52
            },
            "social": {
                "impressions": 150000,
                "reached": 120000,
                "engaged": 18000,
                "clicked": 4500,
                "converted": 270,
                "revenue": 13500.00,
                "cost": 4500.00,
                "roi": 2.00
            },
            "search": {
                "impressions": 80000,
                "clicks": 6400,
                "converted": 512,
                "revenue": 25600.00,
                "cost": 6400.00,
                "roi": 3.00
            },
            "display": {
                "impressions": 200000,
                "clicks": 4000,
                "converted": 120,
                "revenue": 6000.00,
                "cost": 3000.00,
                "roi": 1.00
            }
        }
    
    def get_segment_performance(self) -> Dict[str, Any]:
        """Get performance metrics by customer segment.
        
        Returns:
            Dictionary with performance data for each segment
        """
        return {
            "high_value": {
                "size": 5600,
                "reached": 4900,
                "engaged": 1960,
                "converted": 686,
                "revenue": 34300.00,
                "cost": 7000.00,
                "roi": 3.90
            },
            "medium_value": {
                "size": 12000,
                "reached": 9600,
                "engaged": 2880,
                "converted": 576,
                "revenue": 17280.00,
                "cost": 6000.00,
                "roi": 1.88
            },
            "low_value": {
                "size": 28000,
                "reached": 19600,
                "engaged": 3920,
                "converted": 392,
                "revenue": 7840.00,
                "cost": 3920.00,
                "roi": 1.00
            }
        }
    
    def get_comparative_analysis(
        self, 
        campaign_ids: List[int],
        metrics: List[str] = None
    ) -> Dict[str, Any]:
        """Compare performance across multiple campaigns.
        
        Args:
            campaign_ids: List of campaign IDs to compare
            metrics: List of metrics to include in comparison
            
        Returns:
            Dictionary with comparative data for each campaign
        """
        if metrics is None:
            metrics = ["impressions", "clicks", "conversions", "ctr", "conversion_rate", "cost", "revenue", "roi"]
        
        # In a real implementation, this would query the database
        # For now, return mock data
        result = {"campaigns": {}}
        
        import random
        for campaign_id in campaign_ids:
            result["campaigns"][f"Campaign {campaign_id}"] = {
                "impressions": random.randint(5000, 20000),
                "clicks": random.randint(300, 1500),
                "conversions": random.randint(30, 150),
                "ctr": round(random.uniform(0.02, 0.08), 3),
                "conversion_rate": round(random.uniform(0.05, 0.15), 3),
                "cost": round(random.uniform(1000, 5000), 2),
                "revenue": round(random.uniform(3000, 15000), 2)
            }
            result["campaigns"][f"Campaign {campaign_id}"]["roi"] = round(
                result["campaigns"][f"Campaign {campaign_id}"]["revenue"] / 
                result["campaigns"][f"Campaign {campaign_id}"]["cost"], 
                2
            )
        
        return result

    def get_segment_performance_comparison(self) -> List[Dict[str, Any]]:
        """Compare performance across different customer segments"""
        segments = db.session.query(
            DimSegment.id,
            DimSegment.name,
            func.avg(FactSegmentPerformance.engagement_score).label('avg_engagement'),
            func.avg(FactCampaignPerformance.conversions * 1.0 / FactCampaignPerformance.impressions).label('avg_conversion_rate')
        ).join(
            FactCampaignPerformance, FactCampaignPerformance.segment_id == DimSegment.id, isouter=True
        ).join(
            FactSegmentPerformance, FactSegmentPerformance.segment_id == DimSegment.id, isouter=True
        ).group_by(
            DimSegment.id, DimSegment.name
        ).all()
        
        return [{
            'segment_id': id,
            'segment_name': name,
            'avg_engagement_score': float(engagement) if engagement else 0,
            'avg_conversion_rate': float(conv_rate) if conv_rate else 0
        } for id, name, engagement, conv_rate in segments]
    
    def get_channel_effectiveness(self) -> List[Dict[str, Any]]:
        """Compare effectiveness across different marketing channels"""
        channels = db.session.query(
            DimChannel.id,
            DimChannel.name,
            DimChannel.type,
            func.sum(FactChannelPerformance.impressions).label('total_impressions'),
            func.sum(FactChannelPerformance.clicks).label('total_clicks'),
            func.sum(FactCampaignPerformance.conversions).label('total_conversions'),
            func.sum(FactCampaignPerformance.spend).label('total_spend')
        ).join(
            FactChannelPerformance, FactChannelPerformance.channel_id == DimChannel.id
        ).join(
            FactCampaignPerformance, 
            (FactCampaignPerformance.channel_id == DimChannel.id) & 
            (FactCampaignPerformance.campaign_id == FactChannelPerformance.campaign_id),
            isouter=True
        ).group_by(
            DimChannel.id, DimChannel.name, DimChannel.type
        ).all()
        
        return [{
            'channel_id': id,
            'channel_name': name,
            'channel_type': type.value if type else None,
            'impressions': impressions or 0,
            'clicks': clicks or 0,
            'conversions': conversions or 0,
            'spend': float(spend) if spend else 0,
            'ctr': (clicks / impressions) if impressions and clicks else 0,
            'conversion_rate': (conversions / clicks) if clicks and conversions else 0,
            'cost_per_conversion': (float(spend) / conversions) if conversions and spend else 0
        } for id, name, type, impressions, clicks, conversions, spend in channels] 