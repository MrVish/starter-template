from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import func, desc, and_
import random

from models.campaign import MarketingCampaign, CampaignMessage, CampaignChannel, CampaignMetric
from models.customer_segment import CustomerSegment, SegmentMember
from models.customer_profile import CustomerProfile
from models.channel import Channel
from common.exceptions import ResourceNotFoundException, BusinessRuleException
from common.pagination import paginate_query
from utils.db_utils import get_db


class CampaignService:
    """Service for campaign-related operations."""

    def __init__(self, db_session: Session):
        """Initialize the service with a database session.
        
        Args:
            db_session: SQLAlchemy database session
        """
        self.db_session = db_session
    
    def get_campaigns(self, status: Optional[str] = None) -> List[Dict[str, Any]]:
        """Get all campaigns, optionally filtered by status.
        
        Args:
            status: Filter by campaign status (active, draft, scheduled, completed, paused)
            
        Returns:
            List of campaign dictionaries
        """
        # In a real implementation, this would query the database
        # For now, return mock data
        campaigns = [
            {
                "id": 1,
                "name": "Summer Sale 2023",
                "description": "Promotional campaign for summer products",
                "status": "active",
                "type": "promotional",
                "channel": "multi-channel",
                "start_date": (datetime.now() - timedelta(days=10)).isoformat(),
                "end_date": (datetime.now() + timedelta(days=20)).isoformat(),
                "budget": 5000.00,
                "target_audience": {
                    "segment_ids": [1, 3],
                    "locations": ["US", "CA"],
                    "age_range": [18, 45]
                },
                "performance": {
                    "impressions": 125000,
                    "clicks": 3750,
                    "conversions": 375,
                    "ctr": 3.0,
                    "cvr": 10.0,
                    "cpa": 13.33,
                    "revenue": 18750.00,
                    "roi": 275.0
                }
            },
            {
                "id": 2,
                "name": "New Customer Welcome",
                "description": "Onboarding sequence for new customers",
                "status": "active",
                "type": "nurture",
                "channel": "email",
                "start_date": (datetime.now() - timedelta(days=90)).isoformat(),
                "end_date": None,  # Ongoing
                "budget": 1000.00,
                "target_audience": {
                    "segment_ids": [4],
                    "locations": ["global"],
                    "age_range": [18, 65]
                },
                "performance": {
                    "impressions": 22000,
                    "clicks": 3300,
                    "conversions": 660,
                    "ctr": 15.0,
                    "cvr": 20.0,
                    "cpa": 1.52,
                    "revenue": 9900.00,
                    "roi": 890.0
                }
            },
            {
                "id": 3,
                "name": "Fall Collection Launch",
                "description": "Product launch for fall fashion line",
                "status": "scheduled",
                "type": "launch",
                "channel": "multi-channel",
                "start_date": (datetime.now() + timedelta(days=15)).isoformat(),
                "end_date": (datetime.now() + timedelta(days=45)).isoformat(),
                "budget": 10000.00,
                "target_audience": {
                    "segment_ids": [1, 2],
                    "locations": ["US", "CA", "UK", "EU"],
                    "age_range": [25, 55]
                },
                "performance": {}  # No performance data yet
            },
            {
                "id": 4,
                "name": "Abandoned Cart Recovery",
                "description": "Retarget users who abandoned cart",
                "status": "active",
                "type": "recovery",
                "channel": "email",
                "start_date": (datetime.now() - timedelta(days=120)).isoformat(),
                "end_date": None,  # Ongoing
                "budget": 2000.00,
                "target_audience": {
                    "segment_ids": [],  # Dynamic based on behavior
                    "locations": ["global"],
                    "age_range": [18, 75]
                },
                "performance": {
                    "impressions": 18500,
                    "clicks": 3700,
                    "conversions": 925,
                    "ctr": 20.0,
                    "cvr": 25.0,
                    "cpa": 2.16,
                    "revenue": 46250.00,
                    "roi": 2212.5
                }
            },
            {
                "id": 5,
                "name": "Customer Re-engagement",
                "description": "Re-engage inactive customers",
                "status": "active",
                "type": "re-engagement",
                "channel": "multi-channel",
                "start_date": (datetime.now() - timedelta(days=60)).isoformat(),
                "end_date": (datetime.now() + timedelta(days=30)).isoformat(),
                "budget": 3500.00,
                "target_audience": {
                    "segment_ids": [5],
                    "locations": ["US", "CA", "UK"],
                    "age_range": [25, 65]
                },
                "performance": {
                    "impressions": 85000,
                    "clicks": 1700,
                    "conversions": 85,
                    "ctr": 2.0,
                    "cvr": 5.0,
                    "cpa": 41.18,
                    "revenue": 6375.00,
                    "roi": 82.14
                }
            },
            {
                "id": 6,
                "name": "Holiday Promotion 2023",
                "description": "End of year holiday sales campaign",
                "status": "draft",
                "type": "promotional",
                "channel": "multi-channel",
                "start_date": (datetime.now() + timedelta(days=60)).isoformat(),
                "end_date": (datetime.now() + timedelta(days=90)).isoformat(),
                "budget": 15000.00,
                "target_audience": {
                    "segment_ids": [1, 2, 3],
                    "locations": ["global"],
                    "age_range": [18, 75]
                },
                "performance": {}  # No performance data yet
            },
            {
                "id": 7,
                "name": "Loyalty Program Promotion",
                "description": "Campaign to boost loyalty program sign-ups",
                "status": "paused",
                "type": "promotional",
                "channel": "email",
                "start_date": (datetime.now() - timedelta(days=45)).isoformat(),
                "end_date": (datetime.now() - timedelta(days=15)).isoformat(),
                "budget": 2500.00,
                "target_audience": {
                    "segment_ids": [1, 2],
                    "locations": ["US", "CA"],
                    "age_range": [25, 65]
                },
                "performance": {
                    "impressions": 35000,
                    "clicks": 1050,
                    "conversions": 210,
                    "ctr": 3.0,
                    "cvr": 20.0,
                    "cpa": 11.90,
                    "revenue": 6300.00,
                    "roi": 152.0
                }
            },
            {
                "id": 8,
                "name": "Product Education Webinar",
                "description": "Webinar series on product features",
                "status": "completed",
                "type": "educational",
                "channel": "webinar",
                "start_date": (datetime.now() - timedelta(days=60)).isoformat(),
                "end_date": (datetime.now() - timedelta(days=30)).isoformat(),
                "budget": 3000.00,
                "target_audience": {
                    "segment_ids": [1, 4],
                    "locations": ["global"],
                    "age_range": [25, 65]
                },
                "performance": {
                    "impressions": 12000,
                    "clicks": 1800,
                    "conversions": 450,
                    "ctr": 15.0,
                    "cvr": 25.0,
                    "cpa": 6.67,
                    "revenue": 22500.00,
                    "roi": 650.0
                }
            }
        ]
        
        if status:
            return [c for c in campaigns if c["status"] == status]
        return campaigns
    
    def get_campaign(self, campaign_id: int) -> Dict[str, Any]:
        """Get details for a specific campaign.
        
        Args:
            campaign_id: ID of the campaign
            
        Returns:
            Dictionary containing campaign details
        """
        # In a real implementation, this would query the database
        # For now, find in mock data
        campaigns = self.get_campaigns()
        for campaign in campaigns:
            if campaign["id"] == campaign_id:
                return campaign
                
        # Return empty dict if not found
        return {}
    
    def create_campaign(self, campaign_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new campaign.
        
        Args:
            campaign_data: Dictionary with campaign data
            
        Returns:
            Dictionary representing the created campaign
        """
        # In a real implementation, this would insert into the database
        # For now, return the data with an ID added
        campaign_data["id"] = 9  # mock ID
        campaign_data["created_at"] = datetime.now().isoformat()
        
        # Initialize empty performance for new campaigns
        if "performance" not in campaign_data:
            campaign_data["performance"] = {}
            
        return campaign_data
    
    def update_campaign(self, campaign_id: int, campaign_data: Dict[str, Any]) -> Dict[str, Any]:
        """Update an existing campaign.
        
        Args:
            campaign_id: ID of the campaign to update
            campaign_data: Dictionary with updated campaign data
            
        Returns:
            Dictionary representing the updated campaign
        """
        # In a real implementation, this would update the database
        # For now, merge with mock data and return
        campaign = self.get_campaign(campaign_id)
        if not campaign:
            return {}
            
        campaign.update(campaign_data)
        campaign["updated_at"] = datetime.now().isoformat()
        return campaign
    
    def delete_campaign(self, campaign_id: int) -> bool:
        """Delete a campaign.
        
        Args:
            campaign_id: ID of the campaign to delete
            
        Returns:
            Boolean indicating success
        """
        # In a real implementation, this would delete from the database
        # For now, return success if campaign exists
        campaign = self.get_campaign(campaign_id)
        return bool(campaign)
    
    def get_campaign_performance(self, campaign_id: int, time_range: str = "all") -> Dict[str, Any]:
        """Get detailed performance metrics for a campaign.
        
        Args:
            campaign_id: ID of the campaign
            time_range: Time range for metrics (7d, 30d, 90d, all)
            
        Returns:
            Dictionary with campaign performance metrics
        """
        campaign = self.get_campaign(campaign_id)
        if not campaign or "performance" not in campaign or not campaign["performance"]:
            return {}
            
        # Base metrics from campaign
        base_metrics = campaign["performance"]
        
        # Generate time series data
        time_series = self._generate_performance_time_series(campaign, time_range)
        
        # Generate channel breakdown
        channel_breakdown = self._generate_channel_breakdown(campaign)
        
        # Generate audience breakdown
        audience_breakdown = self._generate_audience_breakdown(campaign)
        
        return {
            "campaign": {
                "id": campaign["id"],
                "name": campaign["name"],
                "status": campaign["status"]
            },
            "overall": base_metrics,
            "time_series": time_series,
            "channel_breakdown": channel_breakdown,
            "audience_breakdown": audience_breakdown
        }
    
    def get_campaign_recommendations(self, campaign_id: int) -> List[Dict[str, Any]]:
        """Get AI-generated recommendations for campaign optimization.
        
        Args:
            campaign_id: ID of the campaign
            
        Returns:
            List of recommendation dictionaries
        """
        campaign = self.get_campaign(campaign_id)
        if not campaign:
            return []
            
        # Generate different recommendations based on campaign type and status
        campaign_type = campaign.get("type", "promotional")
        campaign_status = campaign.get("status", "draft")
        
        recommendations = []
        
        # Common recommendations for all active campaigns
        if campaign_status == "active":
            recommendations.append({
                "id": 1,
                "type": "optimization",
                "title": "Optimize bidding strategy",
                "description": "Current CPA is higher than target. Consider adjusting bidding strategy to focus on higher-converting audiences.",
                "expected_impact": "15-20% improvement in ROAS",
                "confidence": "medium"
            })
        
        # Campaign-type specific recommendations
        if campaign_type == "promotional":
            recommendations.extend([
                {
                    "id": 2,
                    "type": "creative",
                    "title": "Refresh ad creatives",
                    "description": "CTR is declining over time. Creating fresh ad creatives could re-engage audiences.",
                    "expected_impact": "10-15% increase in CTR",
                    "confidence": "high"
                },
                {
                    "id": 3,
                    "type": "targeting",
                    "title": "Expand audience targeting",
                    "description": "Current audience reach is limited. Consider expanding to similar segments for broader reach.",
                    "expected_impact": "30% increase in reach with similar conversion rates",
                    "confidence": "medium"
                }
            ])
        elif campaign_type == "nurture":
            recommendations.extend([
                {
                    "id": 2,
                    "type": "content",
                    "title": "Add personalized content blocks",
                    "description": "Engagement metrics suggest generic content. Increase personalization based on user behavior.",
                    "expected_impact": "25% improvement in click rates",
                    "confidence": "high"
                },
                {
                    "id": 3,
                    "type": "sequence",
                    "title": "Optimize email sequence timing",
                    "description": "Current gaps between messages are too long. Consider reducing wait times between nurture emails.",
                    "expected_impact": "15% improvement in overall conversion rate",
                    "confidence": "medium"
                }
            ])
        elif campaign_type == "recovery":
            recommendations.extend([
                {
                    "id": 2,
                    "type": "incentives",
                    "title": "Test tiered incentives",
                    "description": "Current flat discount may not be optimal. Test progressive incentives based on cart value.",
                    "expected_impact": "20% increase in recovery rate with minimal discount impact",
                    "confidence": "high"
                },
                {
                    "id": 3,
                    "type": "timing",
                    "title": "Optimize reminder timing",
                    "description": "First reminder should be sent sooner. Testing shows 1-hour initial delay is optimal.",
                    "expected_impact": "30% improvement in early-stage recovery",
                    "confidence": "high"
                }
            ])
        elif campaign_type == "re-engagement":
            recommendations.extend([
                {
                    "id": 2,
                    "type": "segmentation",
                    "title": "Implement recency-based segments",
                    "description": "Current approach treats all inactive users the same. Segment by inactivity duration for better results.",
                    "expected_impact": "25% improvement in reactivation rate",
                    "confidence": "high"
                },
                {
                    "id": 3,
                    "type": "content",
                    "title": "Use more personalized subject lines",
                    "description": "Open rates are below benchmark. Test subject lines referencing previous purchases.",
                    "expected_impact": "30% increase in open rates",
                    "confidence": "medium"
                }
            ])
        
        # Recommendations for scheduled campaigns
        if campaign_status == "scheduled":
            recommendations.append({
                "id": len(recommendations) + 1,
                "type": "preparation",
                "title": "Prepare A/B test variants",
                "description": "Set up A/B test variants before launch to optimize from day one.",
                "expected_impact": "Faster optimization and 10% better initial performance",
                "confidence": "high"
            })
        
        # Recommendations for draft campaigns
        if campaign_status == "draft":
            recommendations.append({
                "id": len(recommendations) + 1,
                "type": "planning",
                "title": "Refine audience targeting criteria",
                "description": "Current audience definition is too broad. Refine targeting for better efficiency.",
                "expected_impact": "20% improvement in targeting efficiency",
                "confidence": "high"
            })
        
        return recommendations
    
    def get_campaign_analytics_summary(self) -> Dict[str, Any]:
        """Get a summary of overall campaign analytics.
        
        Returns:
            Dictionary with campaign analytics summary
        """
        campaigns = self.get_campaigns()
        
        # Filter active campaigns with performance data
        active_campaigns = [c for c in campaigns if c["status"] == "active" and "performance" in c and c["performance"]]
        
        # Calculate overall metrics for active campaigns
        total_impressions = sum(c["performance"].get("impressions", 0) for c in active_campaigns)
        total_clicks = sum(c["performance"].get("clicks", 0) for c in active_campaigns)
        total_conversions = sum(c["performance"].get("conversions", 0) for c in active_campaigns)
        total_spend = sum(c["performance"].get("cpa", 0) * c["performance"].get("conversions", 0) for c in active_campaigns)
        total_revenue = sum(c["performance"].get("revenue", 0) for c in active_campaigns)
        
        # Calculate overall rates
        avg_ctr = round(total_clicks / total_impressions * 100, 2) if total_impressions > 0 else 0
        avg_cvr = round(total_conversions / total_clicks * 100, 2) if total_clicks > 0 else 0
        avg_cpa = round(total_spend / total_conversions, 2) if total_conversions > 0 else 0
        overall_roi = round((total_revenue - total_spend) / total_spend * 100, 2) if total_spend > 0 else 0
        
        # Get campaign counts by status
        status_counts = {}
        for status in ["active", "draft", "scheduled", "completed", "paused"]:
            status_counts[status] = len([c for c in campaigns if c["status"] == status])
        
        # Get campaign counts by type
        type_counts = {}
        campaign_types = set(c.get("type") for c in campaigns)
        for c_type in campaign_types:
            type_counts[c_type] = len([c for c in campaigns if c.get("type") == c_type])
        
        # Get top performing campaigns by ROI
        top_campaigns = sorted(
            [c for c in campaigns if "performance" in c and c["performance"] and "roi" in c["performance"]],
            key=lambda x: x["performance"]["roi"],
            reverse=True
        )[:3]
        
        return {
            "current_period": {
                "impressions": total_impressions,
                "clicks": total_clicks,
                "conversions": total_conversions,
                "spend": total_spend,
                "revenue": total_revenue,
                "ctr": avg_ctr,
                "cvr": avg_cvr,
                "cpa": avg_cpa,
                "roi": overall_roi
            },
            "trends": {
                "impressions": 0.15,  # mock trend data
                "clicks": 0.12,
                "conversions": 0.08,
                "spend": 0.10,
                "revenue": 0.18,
                "ctr": -0.02,
                "cvr": -0.03,
                "cpa": 0.05,
                "roi": 0.08
            },
            "campaign_counts": {
                "total": len(campaigns),
                "by_status": status_counts,
                "by_type": type_counts
            },
            "top_performing": [
                {
                    "id": c["id"],
                    "name": c["name"],
                    "type": c["type"],
                    "roi": c["performance"]["roi"]
                } for c in top_campaigns
            ]
        }
    
    def get_campaign_content(self, campaign_id: int) -> Dict[str, Any]:
        """Get content for a specific campaign.
        
        Args:
            campaign_id: ID of the campaign
            
        Returns:
            Dictionary with campaign content
        """
        campaign = self.get_campaign(campaign_id)
        if not campaign:
            return {}
        
        # Mock campaign content based on campaign type
        campaign_type = campaign.get("type", "promotional")
        
        # Base content structure
        content = {
            "campaign_id": campaign_id,
            "name": campaign["name"],
            "assets": []
        }
        
        # Add assets based on campaign type
        if campaign_type == "promotional":
            content["assets"] = [
                {
                    "id": 1,
                    "type": "email",
                    "name": "Promotion Announcement",
                    "subject": f"Don't miss our {campaign['name']}!",
                    "body": f"<h1>{campaign['name']}</h1><p>{campaign['description']}</p><p>Shop now for exclusive deals!</p>",
                    "status": "active",
                    "metrics": {
                        "sent": 10000,
                        "opened": 3000,
                        "clicked": 600
                    }
                },
                {
                    "id": 2,
                    "type": "social",
                    "name": "Facebook Ad",
                    "headline": f"{campaign['name']} - Limited Time!",
                    "description": campaign['description'],
                    "image_url": "https://example.com/campaign_image.jpg",
                    "status": "active",
                    "metrics": {
                        "impressions": 50000,
                        "clicks": 1500,
                        "conversions": 150
                    }
                },
                {
                    "id": 3,
                    "type": "banner",
                    "name": "Website Banner",
                    "headline": f"{campaign['name']}",
                    "description": "Limited time offer!",
                    "image_url": "https://example.com/banner.jpg",
                    "status": "active",
                    "metrics": {
                        "impressions": 25000,
                        "clicks": 750,
                        "conversions": 75
                    }
                }
            ]
        elif campaign_type == "nurture":
            content["assets"] = [
                {
                    "id": 1,
                    "type": "email",
                    "name": "Welcome Email",
                    "subject": "Welcome to our community!",
                    "body": "<h1>Welcome!</h1><p>Thank you for joining our community.</p><p>Here's what you can expect...</p>",
                    "status": "active",
                    "metrics": {
                        "sent": 8000,
                        "opened": 4000,
                        "clicked": 1200
                    }
                },
                {
                    "id": 2,
                    "type": "email",
                    "name": "Product Introduction",
                    "subject": "Discover our top products",
                    "body": "<h1>Our Best Products</h1><p>Check out our most popular items...</p>",
                    "status": "active",
                    "metrics": {
                        "sent": 7500,
                        "opened": 3000,
                        "clicked": 900
                    }
                },
                {
                    "id": 3,
                    "type": "email",
                    "name": "Customer Success Stories",
                    "subject": "See what our customers are saying",
                    "body": "<h1>Success Stories</h1><p>Read about how our customers have succeeded with our products...</p>",
                    "status": "active",
                    "metrics": {
                        "sent": 7000,
                        "opened": 2800,
                        "clicked": 700
                    }
                }
            ]
        elif campaign_type == "recovery":
            content["assets"] = [
                {
                    "id": 1,
                    "type": "email",
                    "name": "Cart Reminder",
                    "subject": "You left items in your cart",
                    "body": "<h1>Your Cart Is Waiting</h1><p>We noticed you left some items in your cart. Ready to complete your purchase?</p>",
                    "status": "active",
                    "metrics": {
                        "sent": 5000,
                        "opened": 2000,
                        "clicked": 800
                    }
                },
                {
                    "id": 2,
                    "type": "email",
                    "name": "Special Offer",
                    "subject": "Special discount on your cart items",
                    "body": "<h1>Special Offer</h1><p>Complete your purchase now and get 10% off!</p>",
                    "status": "active",
                    "metrics": {
                        "sent": 4500,
                        "opened": 2250,
                        "clicked": 1125
                    }
                },
                {
                    "id": 3,
                    "type": "retargeting",
                    "name": "Display Retargeting",
                    "headline": "Complete Your Purchase",
                    "description": "Your items are still waiting in your cart.",
                    "image_url": "https://example.com/retargeting.jpg",
                    "status": "active",
                    "metrics": {
                        "impressions": 20000,
                        "clicks": 600,
                        "conversions": 150
                    }
                }
            ]
        
        return content
    
    def get_campaign_segments(self, campaign_id: int) -> List[Dict[str, Any]]:
        """Get segments targeted by a campaign.
        
        Args:
            campaign_id: ID of the campaign
            
        Returns:
            List of segment dictionaries
        """
        campaign = self.get_campaign(campaign_id)
        if not campaign or "target_audience" not in campaign:
            return []
            
        segment_ids = campaign["target_audience"].get("segment_ids", [])
        
        # Mock segment data based on IDs
        segments = []
        for segment_id in segment_ids:
            # This would normally query a segment service
            if segment_id == 1:
                segments.append({
                    "id": 1,
                    "name": "High Value Customers",
                    "size": 5000,
                    "description": "Customers with high lifetime value"
                })
            elif segment_id == 2:
                segments.append({
                    "id": 2,
                    "name": "Medium Value Customers",
                    "size": 15000,
                    "description": "Customers with medium lifetime value"
                })
            elif segment_id == 3:
                segments.append({
                    "id": 3,
                    "name": "Low Value Customers",
                    "size": 30000,
                    "description": "Customers with low lifetime value"
                })
            elif segment_id == 4:
                segments.append({
                    "id": 4,
                    "name": "New Customers",
                    "size": 8000,
                    "description": "Customers who made their first purchase in the last 30 days"
                })
            elif segment_id == 5:
                segments.append({
                    "id": 5,
                    "name": "At-Risk Customers",
                    "size": 12000,
                    "description": "Customers who haven't purchased in over 60 days"
                })
                
        return segments
    
    def _generate_performance_time_series(self, campaign: Dict[str, Any], time_range: str) -> Dict[str, List]:
        """Generate time series data for campaign performance.
        
        Args:
            campaign: Campaign dictionary
            time_range: Time range for data
            
        Returns:
            Dictionary with time series data
        """
        # Base performance from campaign
        performance = campaign.get("performance", {})
        if not performance:
            return {}
            
        # Determine number of data points based on time range
        points = {
            "7d": 7,
            "30d": 30,
            "90d": 12,  # weekly for 90 days
            "all": 24   # for all time (bi-weekly)
        }.get(time_range, 30)
        
        # Base values
        base_impressions = performance.get("impressions", 0) / points
        base_clicks = performance.get("clicks", 0) / points
        base_conversions = performance.get("conversions", 0) / points
        base_revenue = performance.get("revenue", 0) / points
        
        # Generate labels
        if time_range in ("7d", "30d"):
            # Daily labels
            labels = [f"Day {i+1}" for i in range(points)]
        elif time_range == "90d":
            # Weekly labels
            labels = [f"Week {i+1}" for i in range(points)]
        else:
            # Bi-weekly labels
            labels = [f"Period {i+1}" for i in range(points)]
        
        # Generate random variation for each metric
        random.seed(campaign["id"])  # Seed with campaign ID for consistent results
        
        variation = 0.3  # 30% variation
        trend = 0.1  # 10% upward trend over time
        
        # Apply variation and trend to metrics
        impressions = []
        clicks = []
        conversions = []
        revenues = []
        
        for i in range(points):
            # Apply trend factor (gradually increasing)
            trend_factor = 1 + (trend * i / points)
            
            # Apply random variation
            imp = int(base_impressions * trend_factor * (1 + random.uniform(-variation, variation)))
            impressions.append(imp)
            
            clk = int(base_clicks * trend_factor * (1 + random.uniform(-variation, variation)))
            clk = min(clk, imp)  # Ensure clicks <= impressions
            clicks.append(clk)
            
            conv = int(base_conversions * trend_factor * (1 + random.uniform(-variation, variation)))
            conv = min(conv, clk)  # Ensure conversions <= clicks
            conversions.append(conv)
            
            rev = round(base_revenue * trend_factor * (1 + random.uniform(-variation, variation)), 2)
            revenues.append(rev)
        
        return {
            "labels": labels,
            "metrics": {
                "impressions": impressions,
                "clicks": clicks,
                "conversions": conversions,
                "revenue": revenues
            }
        }
    
    def _generate_channel_breakdown(self, campaign: Dict[str, Any]) -> Dict[str, Any]:
        """Generate channel breakdown for campaign performance.
        
        Args:
            campaign: Campaign dictionary
            
        Returns:
            Dictionary with channel breakdown data
        """
        # Base performance from campaign
        performance = campaign.get("performance", {})
        if not performance:
            return {}
            
        # Determine channels based on campaign type
        channels = []
        campaign_channel = campaign.get("channel", "multi-channel")
        
        if campaign_channel == "multi-channel":
            channels = ["email", "social", "search", "display"]
        elif campaign_channel == "email":
            channels = ["email"]
        elif campaign_channel == "social":
            channels = ["facebook", "instagram", "twitter"]
        else:
            channels = [campaign_channel]
            
        # Distribute metrics across channels
        random.seed(campaign["id"])  # Seed with campaign ID for consistent results
        
        total_impressions = performance.get("impressions", 0)
        total_clicks = performance.get("clicks", 0)
        total_conversions = performance.get("conversions", 0)
        total_revenue = performance.get("revenue", 0)
        
        # Generate weights for distribution
        weights = [random.uniform(0.5, 1.5) for _ in channels]
        weight_sum = sum(weights)
        normalized_weights = [w / weight_sum for w in weights]
        
        # Distribute metrics
        channel_data = {}
        for i, channel in enumerate(channels):
            weight = normalized_weights[i]
            
            impressions = int(total_impressions * weight)
            clicks = int(total_clicks * weight)
            clicks = min(clicks, impressions)  # Ensure clicks <= impressions
            
            conversions = int(total_conversions * weight)
            conversions = min(conversions, clicks)  # Ensure conversions <= clicks
            
            revenue = round(total_revenue * weight, 2)
            
            ctr = round(clicks / impressions * 100, 2) if impressions > 0 else 0
            cvr = round(conversions / clicks * 100, 2) if clicks > 0 else 0
            
            channel_data[channel] = {
                "impressions": impressions,
                "clicks": clicks,
                "conversions": conversions,
                "revenue": revenue,
                "ctr": ctr,
                "cvr": cvr
            }
        
        return channel_data
    
    def _generate_audience_breakdown(self, campaign: Dict[str, Any]) -> Dict[str, Any]:
        """Generate audience breakdown for campaign performance.
        
        Args:
            campaign: Campaign dictionary
            
        Returns:
            Dictionary with audience breakdown data
        """
        # Base performance from campaign
        performance = campaign.get("performance", {})
        if not performance:
            return {}
            
        # Get target audience
        target_audience = campaign.get("target_audience", {})
        locations = target_audience.get("locations", ["US"])
        age_range = target_audience.get("age_range", [18, 65])
        
        # Generate location breakdown
        location_data = {}
        if "global" in locations:
            locations = ["US", "EU", "ASIA", "OTHER"]
        
        random.seed(campaign["id"])  # Seed with campaign ID for consistent results
        
        total_impressions = performance.get("impressions", 0)
        total_clicks = performance.get("clicks", 0)
        total_conversions = performance.get("conversions", 0)
        total_revenue = performance.get("revenue", 0)
        
        # Distribute by location
        location_weights = [random.uniform(0.5, 1.5) for _ in locations]
        location_weight_sum = sum(location_weights)
        location_normalized_weights = [w / location_weight_sum for w in location_weights]
        
        for i, location in enumerate(locations):
            weight = location_normalized_weights[i]
            
            impressions = int(total_impressions * weight)
            clicks = int(total_clicks * weight)
            clicks = min(clicks, impressions)
            
            conversions = int(total_conversions * weight)
            conversions = min(conversions, clicks)
            
            revenue = round(total_revenue * weight, 2)
            
            location_data[location] = {
                "impressions": impressions,
                "clicks": clicks,
                "conversions": conversions,
                "revenue": revenue
            }
        
        # Generate age group breakdown
        min_age = age_range[0]
        max_age = age_range[1]
        
        age_groups = []
        current_min = min_age
        while current_min < max_age:
            current_max = min(current_min + 9, max_age)
            age_groups.append(f"{current_min}-{current_max}")
            current_min = current_max + 1
        
        age_data = {}
        
        # Distribute by age group
        age_weights = [random.uniform(0.5, 1.5) for _ in age_groups]
        age_weight_sum = sum(age_weights)
        age_normalized_weights = [w / age_weight_sum for w in age_weights]
        
        for i, age_group in enumerate(age_groups):
            weight = age_normalized_weights[i]
            
            impressions = int(total_impressions * weight)
            clicks = int(total_clicks * weight)
            clicks = min(clicks, impressions)
            
            conversions = int(total_conversions * weight)
            conversions = min(conversions, clicks)
            
            revenue = round(total_revenue * weight, 2)
            
            age_data[age_group] = {
                "impressions": impressions,
                "clicks": clicks,
                "conversions": conversions,
                "revenue": revenue
            }
        
        return {
            "by_location": location_data,
            "by_age_group": age_data
        } 