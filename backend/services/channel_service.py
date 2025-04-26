from datetime import datetime
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session

class ChannelService:
    """Service for marketing channel-related operations."""

    def __init__(self, db_session: Session):
        """Initialize the service with a database session.
        
        Args:
            db_session: SQLAlchemy database session
        """
        self.db_session = db_session

    def get_channels(self) -> List[Dict[str, Any]]:
        """Get all available marketing channels.
        
        Returns:
            List of channel dictionaries
        """
        # In a real implementation, this would query the database
        # For now, return mock data
        return [
            {
                "id": 1,
                "name": "Email",
                "type": "email",
                "description": "Email marketing campaigns",
                "status": "active",
                "capabilities": ["scheduling", "personalization", "a_b_testing"]
            },
            {
                "id": 2,
                "name": "Social Media",
                "type": "social_media",
                "description": "Social media marketing across platforms",
                "status": "active",
                "capabilities": ["scheduling", "targeting", "advertising"]
            },
            {
                "id": 3,
                "name": "Search",
                "type": "search",
                "description": "Search engine marketing",
                "status": "active",
                "capabilities": ["keywords", "bidding", "ads"]
            },
            {
                "id": 4,
                "name": "Display",
                "type": "display",
                "description": "Display advertising",
                "status": "active",
                "capabilities": ["banners", "retargeting", "programmatic"]
            },
            {
                "id": 5,
                "name": "SMS",
                "type": "sms",
                "description": "SMS marketing campaigns",
                "status": "active",
                "capabilities": ["scheduling", "personalization"]
            },
            {
                "id": 6,
                "name": "Push Notifications",
                "type": "push",
                "description": "Mobile app push notifications",
                "status": "active",
                "capabilities": ["scheduling", "targeting", "personalization"]
            },
            {
                "id": 7,
                "name": "Direct Mail",
                "type": "direct_mail",
                "description": "Physical mail campaigns",
                "status": "inactive",
                "capabilities": ["personalization", "geographic_targeting"]
            }
        ]
    
    def get_channel(self, channel_id: int) -> Dict[str, Any]:
        """Get details for a specific channel.
        
        Args:
            channel_id: ID of the channel
            
        Returns:
            Dictionary containing channel details
        """
        # In a real implementation, this would query the database
        # For now, find in mock data
        channels = self.get_channels()
        for channel in channels:
            if channel["id"] == channel_id:
                return channel
                
        # Return empty dict if not found
        return {}
    
    def create_channel(self, channel_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new marketing channel.
        
        Args:
            channel_data: Dictionary with channel data
            
        Returns:
            Dictionary representing the created channel
        """
        # In a real implementation, this would insert into the database
        # For now, return the data with an ID added
        channel_data["id"] = 8  # mock ID
        channel_data["created_at"] = datetime.now().isoformat()
        return channel_data
    
    def update_channel(self, channel_id: int, channel_data: Dict[str, Any]) -> Dict[str, Any]:
        """Update an existing channel.
        
        Args:
            channel_id: ID of the channel to update
            channel_data: Dictionary with updated channel data
            
        Returns:
            Dictionary representing the updated channel
        """
        # In a real implementation, this would update the database
        # For now, merge with mock data and return
        channel = self.get_channel(channel_id)
        if not channel:
            return {}
            
        channel.update(channel_data)
        channel["updated_at"] = datetime.now().isoformat()
        return channel
    
    def delete_channel(self, channel_id: int) -> bool:
        """Delete a channel.
        
        Args:
            channel_id: ID of the channel to delete
            
        Returns:
            Boolean indicating success
        """
        # In a real implementation, this would delete from the database
        # For now, return success if channel exists
        channel = self.get_channel(channel_id)
        return bool(channel)
    
    def get_channel_performance(self, channel_id: int, time_range: str = "30d") -> Dict[str, Any]:
        """Get performance metrics for a specific channel.
        
        Args:
            channel_id: ID of the channel
            time_range: Time range for metrics (7d, 30d, 90d, ytd, all)
            
        Returns:
            Dictionary with channel performance metrics
        """
        channel = self.get_channel(channel_id)
        if not channel:
            return {}
            
        # Generate multipliers based on channel type
        multipliers = {
            "email": {"ctr": 0.02, "conv": 0.15, "cost": 0.05, "roi": 15},
            "social_media": {"ctr": 0.015, "conv": 0.08, "cost": 0.5, "roi": 8},
            "search": {"ctr": 0.035, "conv": 0.12, "cost": 1.2, "roi": 10},
            "display": {"ctr": 0.002, "conv": 0.03, "cost": 0.3, "roi": 4},
            "sms": {"ctr": 0.045, "conv": 0.1, "cost": 0.1, "roi": 12},
            "push": {"ctr": 0.03, "conv": 0.06, "cost": 0.03, "roi": 9},
            "direct_mail": {"ctr": 0.01, "conv": 0.05, "cost": 0.8, "roi": 6}
        }
        
        # Set base metrics based on time range
        base_metrics = {
            "7d": {"imp": 10000, "clicks": 0, "conv": 0, "cost": 0, "rev": 0},
            "30d": {"imp": 45000, "clicks": 0, "conv": 0, "cost": 0, "rev": 0},
            "90d": {"imp": 140000, "clicks": 0, "conv": 0, "cost": 0, "rev": 0},
            "ytd": {"imp": 300000, "clicks": 0, "conv": 0, "cost": 0, "rev": 0},
            "all": {"imp": 500000, "clicks": 0, "conv": 0, "cost": 0, "rev": 0}
        }
        
        # Get multiplier for this channel
        channel_type = channel.get("type", "email")
        mult = multipliers.get(channel_type, multipliers["email"])
        
        # Calculate metrics
        metrics = base_metrics.get(time_range, base_metrics["30d"])
        metrics["clicks"] = int(metrics["imp"] * mult["ctr"])
        metrics["conv"] = int(metrics["clicks"] * mult["conv"])
        metrics["cost"] = round(metrics["imp"] * mult["cost"], 2)
        metrics["rev"] = round(metrics["cost"] * mult["roi"], 2)
        
        # Calculate derived metrics
        ctr = round(metrics["clicks"] / metrics["imp"] * 100, 2) if metrics["imp"] > 0 else 0
        cvr = round(metrics["conv"] / metrics["clicks"] * 100, 2) if metrics["clicks"] > 0 else 0
        cpc = round(metrics["cost"] / metrics["clicks"], 2) if metrics["clicks"] > 0 else 0
        cpa = round(metrics["cost"] / metrics["conv"], 2) if metrics["conv"] > 0 else 0
        roas = round(metrics["rev"] / metrics["cost"], 2) if metrics["cost"] > 0 else 0
        
        return {
            "channel": channel,
            "metrics": {
                "impressions": metrics["imp"],
                "clicks": metrics["clicks"],
                "conversions": metrics["conv"],
                "cost": metrics["cost"],
                "revenue": metrics["rev"],
                "ctr": ctr,
                "cvr": cvr,
                "cpc": cpc,
                "cpa": cpa,
                "roas": roas
            },
            "trend": {
                "impressions": 0.05,
                "clicks": 0.08,
                "conversions": 0.12,
                "cost": 0.03,
                "revenue": 0.15
            },
            "history": self._generate_time_series(metrics, mult, time_range)
        }
    
    def get_channel_recommendations(self, channel_id: int) -> List[Dict[str, Any]]:
        """Get AI-generated recommendations for a channel.
        
        Args:
            channel_id: ID of the channel
            
        Returns:
            List of recommendation dictionaries
        """
        channel = self.get_channel(channel_id)
        if not channel:
            return []
            
        # Generate recommendations based on channel type
        channel_type = channel.get("type", "email")
        
        recommendations = []
        
        # Common recommendations for all channels
        recommendations.append({
            "id": 1,
            "type": "optimization",
            "title": f"Optimize {channel.get('name')} frequency",
            "description": "Analyze current engagement rates and adjust message frequency to maximize engagement without causing fatigue.",
            "expected_impact": "5-10% improvement in engagement metrics",
            "confidence": "medium"
        })
        
        # Channel-specific recommendations
        if channel_type == "email":
            recommendations.extend([
                {
                    "id": 2,
                    "type": "content",
                    "title": "Improve email subject lines",
                    "description": "A/B test subject lines focusing on personalization and clear value proposition to improve open rates.",
                    "expected_impact": "15-20% increase in open rates",
                    "confidence": "high"
                },
                {
                    "id": 3,
                    "type": "segmentation",
                    "title": "Enhanced email segmentation",
                    "description": "Implement behavior-based segmentation to deliver more relevant email content.",
                    "expected_impact": "25% increase in click-through rates",
                    "confidence": "high"
                }
            ])
        elif channel_type == "social_media":
            recommendations.extend([
                {
                    "id": 2,
                    "type": "content",
                    "title": "Create more video content",
                    "description": "Increase use of short-form video content to improve engagement on social platforms.",
                    "expected_impact": "30% higher engagement rate",
                    "confidence": "medium"
                },
                {
                    "id": 3,
                    "type": "targeting",
                    "title": "Refine social media targeting",
                    "description": "Use lookalike audiences based on high-value customers to improve ad targeting efficiency.",
                    "expected_impact": "20% reduction in cost per acquisition",
                    "confidence": "medium"
                }
            ])
        elif channel_type == "search":
            recommendations.extend([
                {
                    "id": 2,
                    "type": "keywords",
                    "title": "Expand long-tail keywords",
                    "description": "Target more specific long-tail keywords to capture high-intent traffic at lower costs.",
                    "expected_impact": "15% improvement in conversion rates",
                    "confidence": "high"
                },
                {
                    "id": 3,
                    "type": "landing_pages",
                    "title": "Optimize landing pages",
                    "description": "Create dedicated landing pages for top-performing keywords to improve quality scores and conversion rates.",
                    "expected_impact": "25% increase in conversion rate",
                    "confidence": "high"
                }
            ])
        
        return recommendations
    
    def get_channel_comparison(self) -> Dict[str, Any]:
        """Get performance comparison across all active channels.
        
        Returns:
            Dictionary with channel comparison data
        """
        channels = [c for c in self.get_channels() if c.get("status") == "active"]
        
        performance_data = {}
        for channel in channels:
            channel_data = self.get_channel_performance(channel["id"], "30d")
            if channel_data:
                performance_data[channel["type"]] = channel_data["metrics"]
        
        # Calculate totals and averages
        totals = {
            "impressions": sum(c.get("impressions", 0) for c in performance_data.values()),
            "clicks": sum(c.get("clicks", 0) for c in performance_data.values()),
            "conversions": sum(c.get("conversions", 0) for c in performance_data.values()),
            "cost": sum(c.get("cost", 0) for c in performance_data.values()),
            "revenue": sum(c.get("revenue", 0) for c in performance_data.values())
        }
        
        # Calculate overall metrics
        overall_ctr = round(totals["clicks"] / totals["impressions"] * 100, 2) if totals["impressions"] > 0 else 0
        overall_cvr = round(totals["conversions"] / totals["clicks"] * 100, 2) if totals["clicks"] > 0 else 0
        overall_cpc = round(totals["cost"] / totals["clicks"], 2) if totals["clicks"] > 0 else 0
        overall_cpa = round(totals["cost"] / totals["conversions"], 2) if totals["conversions"] > 0 else 0
        overall_roas = round(totals["revenue"] / totals["cost"], 2) if totals["cost"] > 0 else 0
        
        # Calculate contribution percentages
        for channel_type, metrics in performance_data.items():
            metrics["impression_share"] = round(metrics["impressions"] / totals["impressions"] * 100, 2) if totals["impressions"] > 0 else 0
            metrics["click_share"] = round(metrics["clicks"] / totals["clicks"] * 100, 2) if totals["clicks"] > 0 else 0
            metrics["conversion_share"] = round(metrics["conversions"] / totals["conversions"] * 100, 2) if totals["conversions"] > 0 else 0
            metrics["cost_share"] = round(metrics["cost"] / totals["cost"] * 100, 2) if totals["cost"] > 0 else 0
            metrics["revenue_share"] = round(metrics["revenue"] / totals["revenue"] * 100, 2) if totals["revenue"] > 0 else 0
        
        return {
            "channels": performance_data,
            "totals": {
                **totals,
                "ctr": overall_ctr,
                "cvr": overall_cvr,
                "cpc": overall_cpc,
                "cpa": overall_cpa,
                "roas": overall_roas
            },
            "best_performing": {
                "impressions": max(performance_data.items(), key=lambda x: x[1]["impressions"])[0] if performance_data else None,
                "clicks": max(performance_data.items(), key=lambda x: x[1]["clicks"])[0] if performance_data else None,
                "conversions": max(performance_data.items(), key=lambda x: x[1]["conversions"])[0] if performance_data else None,
                "ctr": max(performance_data.items(), key=lambda x: x[1]["ctr"])[0] if performance_data else None,
                "cvr": max(performance_data.items(), key=lambda x: x[1]["cvr"])[0] if performance_data else None,
                "roas": max(performance_data.items(), key=lambda x: x[1]["roas"])[0] if performance_data else None
            }
        }
    
    def _generate_time_series(self, metrics: Dict[str, Any], multipliers: Dict[str, float], time_range: str) -> Dict[str, List]:
        """Generate time series data for channel metrics.
        
        Args:
            metrics: Base metrics for the channel
            multipliers: Channel-specific multipliers
            time_range: Time range for data
            
        Returns:
            Dictionary with time series data for each metric
        """
        # Determine number of data points based on time range
        points = {
            "7d": 7,
            "30d": 30,
            "90d": 12,  # weekly for 90 days
            "ytd": 12,  # monthly for year to date
            "all": 24   # monthly for all time
        }.get(time_range, 30)
        
        # Calculate base values for time series
        base_imp = metrics["imp"] / points
        base_clicks = metrics["clicks"] / points
        base_conv = metrics["conv"] / points
        base_cost = metrics["cost"] / points
        base_rev = metrics["rev"] / points
        
        # Generate time labels
        if time_range in ("7d", "30d"):
            # Daily labels
            labels = [f"Day {i+1}" for i in range(points)]
        elif time_range == "90d":
            # Weekly labels
            labels = [f"Week {i+1}" for i in range(points)]
        else:
            # Monthly labels
            labels = [f"Month {i+1}" for i in range(points)]
        
        # Generate random variation for each metric
        import random
        random.seed(123)  # For consistent results
        
        variation = 0.2  # 20% variation
        
        impressions = [int(base_imp * (1 + random.uniform(-variation, variation))) for _ in range(points)]
        clicks = [int(base_clicks * (1 + random.uniform(-variation, variation))) for _ in range(points)]
        conversions = [int(base_conv * (1 + random.uniform(-variation, variation))) for _ in range(points)]
        costs = [round(base_cost * (1 + random.uniform(-variation, variation)), 2) for _ in range(points)]
        revenues = [round(base_rev * (1 + random.uniform(-variation, variation)), 2) for _ in range(points)]
        
        # Ensure sensible relationships between metrics
        for i in range(points):
            # Ensure clicks <= impressions
            clicks[i] = min(clicks[i], impressions[i])
            # Ensure conversions <= clicks
            conversions[i] = min(conversions[i], clicks[i])
        
        return {
            "labels": labels,
            "impressions": impressions,
            "clicks": clicks,
            "conversions": conversions,
            "costs": costs,
            "revenues": revenues
        } 