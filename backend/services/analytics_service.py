import logging
from typing import Dict, List, Any, Optional, Union, Tuple
from datetime import date, datetime, timedelta
import json
import os
import random
from decimal import Decimal
from sqlalchemy import func, desc
from sqlalchemy.orm import Session

# Import helper functions for decimal handling
from services.analytics_service_fix import decimal_to_float, get_safe_campaign_data, get_safe_channel_effectiveness, get_safe_segment_performance

# Don't import models here, we'll do that in the constructor
# to handle the case when they're not available

class AnalyticsService:
    """Service for analytics data and metrics"""
    
    def __init__(self, db_session=None):
        """Initialize with database session"""
        self.db_session = db_session
        
        # Try to import database models
        try:
            from models.dim_users import DimUser
            from models.dim_dates import DimDate
            from models.dim_customers import DimCustomer
            from models.dim_segments import DimSegment
            from models.dim_channels import DimChannel
            from models.dim_campaigns import DimCampaign
            from models.fact_campaign_performance import FactCampaignPerformance
            from models.fact_channel_performance import FactChannelPerformance
            from models.fact_segment_performance import FactSegmentPerformance
            
            # If no session provided, try to use the global db.session
            if self.db_session is None:
                from extensions import db
                self.db_session = db.session
                print("Using global db.session")
        except ImportError as e:
            # For development or testing environments where database might not be available
            print(f"Warning: Database models not imported: {e}, mock data will be used")
            self.db_session = None
    
    def _decimal_to_float(self, val):
        """Safely convert a decimal value to float"""
        return decimal_to_float(val)
    
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
        monthly_performance = self.db_session.query(
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
        channel_distribution = self.db_session.query(
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
        total_customers = self.db_session.query(func.count(DimCustomer.id)).scalar() or 0
        
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
        segments = self.db_session.query(
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
    
    def get_channel_effectiveness(self, time_range='30d'):
        """Compare effectiveness across different marketing channels"""
        try:
            # Get a time range tuple (start_date, end_date) from the specified range
            start_date, end_date = self._parse_time_range(time_range)
            
            # Log the request
            print(f"Fetching channel effectiveness for time range: {time_range} ({start_date} to {end_date})")
            
            # Check if database connection is available
            if not self.db_session:
                print("No database session available, using mock data")
                return self._get_mock_channel_effectiveness()
            
            # Use the safe implementation from analytics_service_fix
            channel_data = get_safe_channel_effectiveness(self.db_session, time_range)
            
            # If we got data, return it
            if channel_data:
                return channel_data
            
            # Otherwise, fall back to mock data
            return self._get_mock_channel_effectiveness()
                
        except Exception as e:
            print(f"Error in get_channel_effectiveness: {e}")
            return self._get_mock_channel_effectiveness()

    def get_campaigns(self, time_range='30d'):
        """
        Returns campaign data for the insights page from the database
        
        Args:
            time_range (str): Time range for filtering data (e.g., '7d', '30d', '90d')
            
        Returns:
            list: A list of campaign objects with performance metrics
        """
        # Debug log for incoming time_range parameter
        print(f"[DEBUG] get_campaigns called with time_range: '{time_range}', type: {type(time_range)}")
        
        try:
            # Check if database connection is available
            if not self.db_session:
                print("No database session available, using mock data")
                return self._get_mock_campaigns()
            
            # Get date range from time_range
            start_date, end_date = self._parse_time_range(time_range)
            print(f"[DEBUG] Campaign date range: {start_date} to {end_date}")
            
            # Import models here to catch import errors
            try:
                from models.dim_campaigns import DimCampaign
                from models.fact_campaign_performance import FactCampaignPerformance
                from models.dim_dates import DimDate
                
                # Use the safe implementation from analytics_service_fix for detailed campaign data
                campaigns = get_safe_campaign_data(self.db_session, time_range)
                print(f"[DEBUG] Retrieved {len(campaigns)} campaigns using get_safe_campaign_data")
                
                return campaigns
            except ImportError as e:
                print(f"[DEBUG] Import error in get_campaigns: {e}")
                return self._get_mock_campaigns()
            except Exception as e:
                print(f"[DEBUG] Error querying database for campaigns: {e}")
                return self._get_mock_campaigns()
            
        except Exception as e:
            # Log the error but return mock data as fallback
            print(f"[DEBUG] Error in get_campaigns: {str(e)}")
            return self._get_mock_campaigns()
    
    def get_key_metrics(self, time_range='30d') -> List[Dict[str, Any]]:
        """Get key metrics for the insights dashboard.
        
        Args:
            time_range: Time range for the metrics ('7d', '30d', '90d', '1y')
            
        Returns:
            List of key metrics objects
        """
        try:
            # Import sqlalchemy func at the method level to avoid scope issues
            from sqlalchemy import func, desc
            
            # Convert time_range to actual days
            days = 30
            if time_range == '7d':
                days = 7
            elif time_range == '30d':
                days = 30
            elif time_range == '90d':
                days = 90
            elif time_range == '1y':
                days = 365
                
            # Calculate date range
            end_date = date.today()
            start_date = end_date - timedelta(days=days)
            
            # Format dates to integer keys for DimDate
            start_date_key = int(start_date.strftime('%Y%m%d'))
            end_date_key = int(end_date.strftime('%Y%m%d'))
            
            print(f"Fetching key metrics from database for time range: {time_range} ({start_date} to {end_date})")
            
            # Check if database connection is available
            if not self.db_session:
                print("No database session available, using mock data")
                return self._get_mock_key_metrics()
            
            try:
                # Import models here to catch import errors
                from models.dim_customers import DimCustomer
                from models.dim_dates import DimDate
                from models.fact_segment_performance import FactSegmentPerformance
                from models.fact_campaign_performance import FactCampaignPerformance
            
                # Get new customer count (from DimCustomer)
                new_customer_count = self.db_session.query(func.count(DimCustomer.id)).filter(
                    func.date(DimCustomer.joined_date) >= start_date,
                    func.date(DimCustomer.joined_date) <= end_date
                ).scalar() or 0
                
                print(f"Found {new_customer_count} new customers in database")
                
                # Get average AUM (Assets Under Management)
                try:
                    # Get AUM data from appropriate fact table instead of dimension table
                    from models.fact_transactions_main import FactTransactionMain
                    
                    # Calculate average balance per customer from the transaction fact table
                    # First, we need a subquery to get the sum for each customer
                    from sqlalchemy import func, distinct
                    
                    # This approach uses two steps to avoid nesting aggregate functions
                    customer_balances = self.db_session.query(
                        FactTransactionMain.customer_key,
                        func.sum(FactTransactionMain.txn_amount).label('customer_balance')
                    ).group_by(
                        FactTransactionMain.customer_key
                    ).subquery()
                    
                    # Then calculate the average of these sums
                    avg_aum = self.db_session.query(
                        func.avg(customer_balances.c.customer_balance)
                    ).scalar() or 0
                    
                    print(f"Average AUM from transaction data: {avg_aum}")
                except (AttributeError, Exception) as e:
                    # If fact table query fails, use a fallback value
                    print(f"Error calculating AUM from transactions: {str(e)}")
                    avg_aum = 385000  # Use default value from mock data
                    print(f"Using fallback AUM value: {avg_aum}")
                
                # Get retention rate from FactSegmentPerformance
                retention_data = self.db_session.query(
                    func.avg(FactSegmentPerformance.retention_rate)
                ).join(
                    DimDate, FactSegmentPerformance.date_key == DimDate.id
                ).filter(
                    DimDate.id >= start_date_key,
                    DimDate.id <= end_date_key
                ).scalar() or 0
                
                print(f"Retention rate from database: {retention_data}")
                
                # Calculate ROI from campaign performance
                campaign_metrics = self.db_session.query(
                    func.sum(FactCampaignPerformance.revenue).label('total_revenue'),
                    func.sum(FactCampaignPerformance.spend).label('total_spend')
                ).join(
                    DimDate, FactCampaignPerformance.date_key == DimDate.id
                ).filter(
                    DimDate.id >= start_date_key,
                    DimDate.id <= end_date_key
                ).first()
                
                total_revenue = float(campaign_metrics.total_revenue or 0)
                total_spend = float(campaign_metrics.total_spend or 0)
                roi = (total_revenue / total_spend * 100) if total_spend > 0 else 0
                
                print(f"ROI calculation from database: Revenue={total_revenue}, Spend={total_spend}, ROI={roi}")
                
                # Get year-over-year changes
                prev_start_date = start_date - timedelta(days=days)
                prev_end_date = end_date - timedelta(days=days)
                prev_start_date_key = int(prev_start_date.strftime('%Y%m%d'))
                prev_end_date_key = int(prev_end_date.strftime('%Y%m%d'))
                
                # Previous period customer count
                prev_customer_count = self.db_session.query(func.count(DimCustomer.id)).filter(
                    func.date(DimCustomer.joined_date) >= prev_start_date,
                    func.date(DimCustomer.joined_date) <= prev_end_date
                ).scalar() or 1  # Avoid division by zero
                
                # Calculate customer growth percentage
                customer_growth = ((new_customer_count - prev_customer_count) / prev_customer_count) * 100
                customer_growth_str = f"+{customer_growth:.1f}%" if customer_growth >= 0 else f"{customer_growth:.1f}%"
                
                # Previous period AUM
                try:
                    # Get AUM data from appropriate fact table for previous period
                    from models.fact_transactions_main import FactTransactionMain
                    from models.dim_dates import DimDate
                    
                    # Calculate average balance per customer for previous period
                    # Using the same two-step approach
                    prev_customer_balances = self.db_session.query(
                        FactTransactionMain.customer_key,
                        func.sum(FactTransactionMain.txn_amount).label('customer_balance')
                    ).join(
                        DimDate, FactTransactionMain.date_key == DimDate.id
                    ).filter(
                        DimDate.date <= prev_end_date
                    ).group_by(
                        FactTransactionMain.customer_key
                    ).subquery()
                    
                    # Then calculate the average of these sums
                    prev_avg_aum = self.db_session.query(
                        func.avg(prev_customer_balances.c.customer_balance)
                    ).scalar() or 1  # Avoid division by zero
                    
                    print(f"Previous average AUM from transaction data: {prev_avg_aum}")
                except (AttributeError, Exception) as e:
                    # If fact table query fails, use a fallback value
                    print(f"Error calculating previous AUM from transactions: {str(e)}")
                    prev_avg_aum = 375000  # Use default value that gives a small growth
                    print(f"Using fallback previous AUM value: {prev_avg_aum}")
                
                # Calculate AUM growth percentage
                aum_growth = ((avg_aum - prev_avg_aum) / prev_avg_aum) * 100
                aum_growth_str = f"+{aum_growth:.1f}%" if aum_growth >= 0 else f"{aum_growth:.1f}%"
                
                # Previous period retention rate
                prev_retention_data = self.db_session.query(
                    func.avg(FactSegmentPerformance.retention_rate)
                ).join(
                    DimDate, FactSegmentPerformance.date_key == DimDate.id
                ).filter(
                    DimDate.id >= prev_start_date_key,
                    DimDate.id <= prev_end_date_key
                ).scalar() or 0
                
                # Calculate retention growth percentage
                retention_growth = ((retention_data - prev_retention_data) / (prev_retention_data or 1)) * 100
                retention_growth_str = f"+{retention_growth:.1f}%" if retention_growth >= 0 else f"{retention_growth:.1f}%"
                
                # Previous period campaign metrics
                prev_campaign_metrics = self.db_session.query(
                    func.sum(FactCampaignPerformance.revenue).label('total_revenue'),
                    func.sum(FactCampaignPerformance.spend).label('total_spend')
                ).join(
                    DimDate, FactCampaignPerformance.date_key == DimDate.id
                ).filter(
                    DimDate.id >= prev_start_date_key,
                    DimDate.id <= prev_end_date_key
                ).first()
                
                prev_total_revenue = float(prev_campaign_metrics.total_revenue or 0)
                prev_total_spend = float(prev_campaign_metrics.total_spend or 0)
                prev_roi = (prev_total_revenue / prev_total_spend * 100) if prev_total_spend > 0 else 0
                
                # Calculate ROI growth percentage
                roi_growth = ((roi - prev_roi) / (prev_roi or 1)) * 100
                roi_growth_str = f"+{roi_growth:.1f}%" if roi_growth >= 0 else f"{roi_growth:.1f}%"
                
                # Format metrics
                formatted_avg_aum = f"${avg_aum/1000:.0f}K" if avg_aum >= 1000 else f"${avg_aum:.0f}"
                formatted_roi = f"{roi:.1f}%"
                formatted_retention = f"{retention_data:.1f}%"
                
                # Check if we have any real data
                has_real_data = (new_customer_count > 0 or avg_aum > 0 or retention_data > 0 or total_revenue > 0 or total_spend > 0)
                
                if not has_real_data:
                    print("No real key metrics data found in database, using fallback data")
                    return self._get_mock_key_metrics()
                
                print("Successfully fetched key metrics from database")
                return [
                    {
                        "id": 1,
                        "metric": "New Client Acquisition",
                        "value": f"{new_customer_count:,}",
                        "target": "2,000",
                        "period": "Monthly" if time_range in ['30d', '90d'] else "Weekly" if time_range == '7d' else "Annual",
                        "change": customer_growth_str,
                        "trend": "up" if customer_growth >= 0 else "down",
                    },
                    {
                        "id": 2,
                        "metric": "Average Assets Under Management",
                        "value": formatted_avg_aum,
                        "target": "$300K",
                        "period": "Monthly" if time_range in ['30d', '90d'] else "Weekly" if time_range == '7d' else "Annual",
                        "change": aum_growth_str,
                        "trend": "up" if aum_growth >= 0 else "down",
                    },
                    {
                        "id": 3,
                        "metric": "Client Retention Rate",
                        "value": formatted_retention,
                        "target": "95%",
                        "period": "Annual",
                        "change": retention_growth_str,
                        "trend": "up" if retention_growth >= 0 else "down",
                    },
                    {
                        "id": 4,
                        "metric": "Financial Advisory ROI",
                        "value": formatted_roi,
                        "target": "450%",
                        "period": "Quarterly",
                        "change": roi_growth_str,
                        "trend": "up" if roi_growth >= 0 else "down",
                    },
                ]
            except (ImportError, AttributeError) as e:
                print(f"Error fetching key metrics: {str(e)}")
                return self._get_mock_key_metrics()
            except Exception as e:
                print(f"Database error in get_key_metrics: {str(e)}")
                return self._get_mock_key_metrics()
        except Exception as e:
            print(f"Error in get_key_metrics: {str(e)}")
            return self._get_mock_key_metrics()
    
    def get_segment_performance_analysis(self, time_range='30d'):
        """Get performance data across different segments"""
        try:
            # Get a time range tuple (start_date, end_date) from the specified range
            start_date, end_date = self._parse_time_range(time_range)
            
            # Log the request
            print(f"Fetching segment performance for time range: {time_range} ({start_date} to {end_date})")
            
            # Check if database connection is available
            if not self.db_session:
                print("No database session available, using mock data")
                return self._get_mock_segment_performance()
            
            # Use the safe implementation from analytics_service_fix
            segment_data = get_safe_segment_performance(self.db_session, time_range)
            
            # If we got data, return it
            if segment_data:
                return segment_data
            
            # Otherwise, return mock data
            return self._get_mock_segment_performance()
                
        except Exception as e:
            print(f"Error in get_segment_performance_analysis: {str(e)}")
            return self._get_mock_segment_performance()

    def _get_mock_channel_effectiveness(self):
        """Returns mock channel effectiveness data for fallback"""
        return [
            {
                "name": "Email",
                "impressions": 45000,
                "clicks": 3200,
                "conversions": 850,
                "revenue": 125000,
                "cost": 15000,
                "roi": 733
            },
            {
                "name": "Social Media",
                "impressions": 120000,
                "clicks": 4800,
                "conversions": 620,
                "revenue": 85000,
                "cost": 25000,
                "roi": 240
            },
            {
                "name": "Webinars",
                "impressions": 8500,
                "clicks": 8500,
                "conversions": 940,
                "revenue": 230000,
                "cost": 35000,
                "roi": 557
            },
            {
                "name": "Social Advertising",
                "impressions": 150000,
                "clicks": 5000,
                "conversions": 450,
                "revenue": 75000,
                "cost": 35000,
                "roi": 114
            }
        ]

    def _get_mock_segment_performance(self):
        """Returns mock segment performance data for fallback"""
        return [
            {
                "name": "High-Net-Worth",
                "size": 1200,
                "reached": 850,
                "engaged": 620,
                "converted": 180,
                "revenue": 450000,
                "change": "+15.2%",
                "percentValue": 75
            },
            {
                "name": "Near Retirement",
                "size": 3500,
                "reached": 2800,
                "engaged": 1400,
                "converted": 420,
                "revenue": 380000,
                "change": "+8.7%",
                "percentValue": 65
            },
            {
                "name": "Younger Investors",
                "size": 4800,
                "reached": 3200,
                "engaged": 1100,
                "converted": 280,
                "revenue": 190000,
                "change": "+22.5%",
                "percentValue": 52
            },
            {
                "name": "Business Owners",
                "size": 2200,
                "reached": 1650,
                "engaged": 880,
                "converted": 320,
                "revenue": 280000,
                "change": "+18.4%",
                "percentValue": 68
            }
        ]

    def _parse_time_range(self, time_range):
        """Helper to parse time range string into start and end dates"""
        # Convert time_range to actual days
        days = 30  # Default to 30 days
        if time_range == '7d':
            days = 7
        elif time_range == '30d':
            days = 30
        elif time_range == '90d':
            days = 90
        elif time_range == '1y':
            days = 365
        
        # Calculate date range
        end_date = date.today()
        start_date = end_date - timedelta(days=days)
        
        return start_date, end_date 

    def _get_mock_key_metrics(self):
        """Returns mock key metrics data for fallback"""
        return [
            {
                "id": 1,
                "metric": "New Client Acquisition",
                "value": "1,250",
                "target": "2,000",
                "period": "Monthly",
                "change": "+12.5%",
                "trend": "up",
            },
            {
                "id": 2,
                "metric": "Average Assets Under Management",
                "value": "$385K",
                "target": "$300K",
                "period": "Monthly",
                "change": "+8.3%",
                "trend": "up",
            },
            {
                "id": 3,
                "metric": "Client Retention Rate",
                "value": "92.4%",
                "target": "95%",
                "period": "Annual",
                "change": "+2.1%",
                "trend": "up",
            },
            {
                "id": 4,
                "metric": "Financial Advisory ROI",
                "value": "387%",
                "target": "450%",
                "period": "Quarterly",
                "change": "+15.2%",
                "trend": "up",
            },
        ]

    def _get_mock_campaigns(self):
        """Returns mock campaign data for fallback"""
        return [
            {
                "id": 1,
                "name": "Retirement Planning Webinars",
                "status": "Active",
                "start": "2023-06-01",
                "end": "2023-08-31",
                "budget": "$85,000",
                "spend": "$45,000",
                "results": {
                    "attendees": "2,850",
                    "leads": "620",
                    "conversions": "420",
                    "revenue": "$128,500",
                }
            },
            {
                "id": 2,
                "name": "Wealth Management Advisor Program",
                "status": "Active",
                "start": "2023-05-15",
                "end": "2023-09-30",
                "budget": "$120,000",
                "spend": "$62,500",
                "results": {
                    "consultations": "380",
                    "referrals": "85",
                    "conversions": "280",
                    "revenue": "$325,000",
                }
            },
            {
                "id": 3,
                "name": "Investment Portfolio Diversification",
                "status": "Active",
                "start": "2023-07-01",
                "end": "2023-10-31",
                "budget": "$65,000",
                "spend": "$35,000",
                "results": {
                    "educational_sessions": "45",
                    "portfolio_reviews": "320",
                    "conversions": "180",
                    "revenue": "$185,000",
                }
            },
            {
                "id": 4,
                "name": "High-Yield Savings Campaign",
                "status": "Planned",
                "start": "2023-09-01",
                "end": "2023-12-31",
                "budget": "$70,000",
                "spend": "$0",
                "results": {
                    "account_inquiries": "0",
                    "new_accounts": "0",
                    "conversions": "0",
                    "revenue": "$0",
                }
            }
        ] 