from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
from sqlalchemy import func, desc
from extensions import db
from models import (
    DimCampaign, 
    FactCampaignPerformance, 
    FactChannelPerformance,
    FactCampaignKPIResult,
    DimKPI,
    DimSegment,
    DimChannel
)

class CampaignAnalyticsService:
    """Service for campaign analytics operations"""
    
    def get_campaign_performance_overview(self, time_period: str = "last_30_days") -> Dict[str, Any]:
        """Get aggregated campaign performance metrics for a time period"""
        
        # Calculate date range based on time period
        end_date = datetime.now().date()
        if time_period == "last_30_days":
            start_date = end_date - timedelta(days=30)
        elif time_period == "last_90_days":
            start_date = end_date - timedelta(days=90)
        elif time_period == "year_to_date":
            start_date = datetime(end_date.year, 1, 1).date()
        else:
            start_date = end_date - timedelta(days=30)  # Default to 30 days
        
        # Query for aggregated metrics
        metrics = db.session.query(
            func.sum(FactCampaignPerformance.impressions).label('total_impressions'),
            func.sum(FactCampaignPerformance.clicks).label('total_clicks'),
            func.sum(FactCampaignPerformance.conversions).label('total_conversions'),
            func.sum(FactCampaignPerformance.spend).label('total_spend'),
            func.avg(func.cast(FactCampaignPerformance.clicks * 100 / 
                               func.nullif(FactCampaignPerformance.impressions, 0), 
                       db.DECIMAL(5, 2))).label('avg_ctr'),
            func.avg(func.cast(FactCampaignPerformance.conversions * 100 / 
                               func.nullif(FactCampaignPerformance.clicks, 0), 
                       db.DECIMAL(5, 2))).label('avg_conversion_rate'),
        ).join(
            DimCampaign, DimCampaign.id == FactCampaignPerformance.campaign_id
        ).filter(
            DimCampaign.start_date <= end_date,
            DimCampaign.end_date >= start_date
        ).first()
        
        # Calculate ROI
        total_conversions = metrics.total_conversions or 0
        total_spend = float(metrics.total_spend or 0)
        avg_conversion_value = 150  # Example value, should be derived from actual data
        estimated_revenue = total_conversions * avg_conversion_value
        roi = ((estimated_revenue - total_spend) / total_spend) * 100 if total_spend > 0 else 0
        
        return {
            'time_period': time_period,
            'date_range': {
                'start': start_date.isoformat(),
                'end': end_date.isoformat()
            },
            'metrics': {
                'impressions': metrics.total_impressions or 0,
                'clicks': metrics.total_clicks or 0,
                'conversions': metrics.total_conversions or 0,
                'spend': float(metrics.total_spend or 0),
                'ctr': float(metrics.avg_ctr or 0),
                'conversion_rate': float(metrics.avg_conversion_rate or 0),
                'estimated_revenue': estimated_revenue,
                'roi': roi
            }
        }
    
    def get_campaign_performance_by_segment(self, time_period: str = "last_30_days") -> List[Dict[str, Any]]:
        """Get campaign performance metrics broken down by customer segment"""
        
        # Calculate date range based on time period
        end_date = datetime.now().date()
        if time_period == "last_30_days":
            start_date = end_date - timedelta(days=30)
        else:
            start_date = end_date - timedelta(days=30)  # Default to 30 days
        
        # Query for metrics by segment
        results = db.session.query(
            DimSegment.id,
            DimSegment.name,
            func.sum(FactCampaignPerformance.impressions).label('impressions'),
            func.sum(FactCampaignPerformance.clicks).label('clicks'),
            func.sum(FactCampaignPerformance.conversions).label('conversions'),
            func.sum(FactCampaignPerformance.spend).label('spend')
        ).join(
            FactCampaignPerformance, FactCampaignPerformance.segment_id == DimSegment.id
        ).join(
            DimCampaign, FactCampaignPerformance.campaign_id == DimCampaign.id
        ).filter(
            DimCampaign.start_date <= end_date,
            DimCampaign.end_date >= start_date
        ).group_by(
            DimSegment.id, DimSegment.name
        ).all()
        
        return [{
            'segment_id': segment_id,
            'segment_name': segment_name,
            'metrics': {
                'impressions': impressions or 0,
                'clicks': clicks or 0, 
                'conversions': conversions or 0,
                'spend': float(spend or 0),
                'ctr': (clicks / impressions * 100) if impressions else 0,
                'conversion_rate': (conversions / clicks * 100) if clicks else 0,
                'cost_per_conversion': (float(spend) / conversions) if conversions else 0
            }
        } for segment_id, segment_name, impressions, clicks, conversions, spend in results]

    def get_campaign_performance_by_channel(self, time_period: str = "last_30_days") -> List[Dict[str, Any]]:
        """Get campaign performance metrics broken down by channel"""
        
        # Calculate date range based on time period
        end_date = datetime.now().date()
        if time_period == "last_30_days":
            start_date = end_date - timedelta(days=30)
        else:
            start_date = end_date - timedelta(days=30)  # Default to 30 days
        
        # Query for metrics by channel
        results = db.session.query(
            DimChannel.id,
            DimChannel.name,
            DimChannel.type,
            func.sum(FactCampaignPerformance.impressions).label('impressions'),
            func.sum(FactCampaignPerformance.clicks).label('clicks'),
            func.sum(FactCampaignPerformance.conversions).label('conversions'),
            func.sum(FactCampaignPerformance.spend).label('spend')
        ).join(
            FactCampaignPerformance, FactCampaignPerformance.channel_id == DimChannel.id
        ).join(
            DimCampaign, FactCampaignPerformance.campaign_id == DimCampaign.id
        ).filter(
            DimCampaign.start_date <= end_date,
            DimCampaign.end_date >= start_date
        ).group_by(
            DimChannel.id, DimChannel.name, DimChannel.type
        ).all()
        
        return [{
            'channel_id': channel_id,
            'channel_name': channel_name,
            'channel_type': str(channel_type.value) if channel_type else None,
            'metrics': {
                'impressions': impressions or 0,
                'clicks': clicks or 0, 
                'conversions': conversions or 0,
                'spend': float(spend or 0),
                'ctr': (clicks / impressions * 100) if impressions else 0,
                'conversion_rate': (conversions / clicks * 100) if clicks else 0,
                'cost_per_conversion': (float(spend) / conversions) if conversions else 0
            }
        } for channel_id, channel_name, channel_type, impressions, clicks, conversions, spend in results]

    def get_campaign_kpi_results(self, campaign_id: int) -> List[Dict[str, Any]]:
        """Get KPI results for a specific campaign"""
        
        results = db.session.query(
            DimKPI.id,
            DimKPI.name,
            DimKPI.definition,
            FactCampaignKPIResult.value
        ).join(
            FactCampaignKPIResult, FactCampaignKPIResult.kpi_id == DimKPI.id
        ).filter(
            FactCampaignKPIResult.campaign_id == campaign_id
        ).all()
        
        return [{
            'kpi_id': kpi_id,
            'name': name,
            'definition': definition,
            'value': float(value) if value else 0
        } for kpi_id, name, definition, value in results]
        
    def get_campaign_details(self, campaign_id: int) -> Dict[str, Any]:
        """Get detailed information about a specific campaign"""
        
        campaign = DimCampaign.query.get(campaign_id)
        if not campaign:
            return None
            
        # Get campaign performance metrics
        performance = FactCampaignPerformance.query.filter_by(campaign_id=campaign_id).all()
        
        # Calculate totals
        total_impressions = sum(p.impressions for p in performance) if performance else 0
        total_clicks = sum(p.clicks for p in performance) if performance else 0
        total_conversions = sum(p.conversions for p in performance) if performance else 0
        total_spend = sum(p.spend for p in performance) if performance else 0
        
        # Calculate derived metrics
        ctr = (total_clicks / total_impressions * 100) if total_impressions else 0
        conversion_rate = (total_conversions / total_clicks * 100) if total_clicks else 0
        cost_per_click = (total_spend / total_clicks) if total_clicks else 0
        cost_per_conversion = (total_spend / total_conversions) if total_conversions else 0
        
        # Campaign details
        campaign_dict = campaign.to_dict()
        
        # Add segment and template info if available
        if campaign.segment:
            campaign_dict['segment'] = campaign.segment.to_dict()
        if campaign.template:
            campaign_dict['template'] = campaign.template.to_dict()
            
        # Get KPI results
        kpi_results = self.get_campaign_kpi_results(campaign_id)
        
        return {
            'campaign': campaign_dict,
            'metrics': {
                'impressions': total_impressions,
                'clicks': total_clicks,
                'conversions': total_conversions,
                'spend': float(total_spend),
                'ctr': ctr,
                'conversion_rate': conversion_rate,
                'cost_per_click': cost_per_click,
                'cost_per_conversion': cost_per_conversion
            },
            'kpi_results': kpi_results,
            'performance_data': [p.to_dict() for p in performance]
        }
    
    def get_top_performing_campaigns(self, metric: str = 'conversions', limit: int = 5) -> List[Dict[str, Any]]:
        """Get top performing campaigns based on a specific metric"""
        
        valid_metrics = ['impressions', 'clicks', 'conversions', 'ctr', 'conversion_rate']
        if metric not in valid_metrics:
            metric = 'conversions'  # Default to conversions
            
        # Base query with aggregated metrics
        query = db.session.query(
            DimCampaign.id,
            DimCampaign.name,
            DimCampaign.type,
            func.sum(FactCampaignPerformance.impressions).label('impressions'),
            func.sum(FactCampaignPerformance.clicks).label('clicks'),
            func.sum(FactCampaignPerformance.conversions).label('conversions'),
            func.sum(FactCampaignPerformance.spend).label('spend')
        ).join(
            FactCampaignPerformance, FactCampaignPerformance.campaign_id == DimCampaign.id
        ).group_by(
            DimCampaign.id, DimCampaign.name, DimCampaign.type
        )
        
        # Order by selected metric
        if metric == 'impressions':
            query = query.order_by(desc('impressions'))
        elif metric == 'clicks':
            query = query.order_by(desc('clicks'))
        elif metric == 'conversions':
            query = query.order_by(desc('conversions'))
        elif metric == 'ctr':
            # Calculate CTR and order by it
            query = query.order_by(desc(func.cast(func.sum(FactCampaignPerformance.clicks) * 100 / 
                                            func.nullif(func.sum(FactCampaignPerformance.impressions), 0), 
                                    db.DECIMAL(5, 2))))
        elif metric == 'conversion_rate':
            # Calculate conversion rate and order by it
            query = query.order_by(desc(func.cast(func.sum(FactCampaignPerformance.conversions) * 100 / 
                                                func.nullif(func.sum(FactCampaignPerformance.clicks), 0), 
                                        db.DECIMAL(5, 2))))
        
        # Get results with limit
        results = query.limit(limit).all()
        
        # Format results
        return [{
            'campaign_id': campaign_id,
            'campaign_name': campaign_name,
            'campaign_type': campaign_type,
            'metrics': {
                'impressions': impressions or 0,
                'clicks': clicks or 0,
                'conversions': conversions or 0,
                'spend': float(spend or 0),
                'ctr': (clicks / impressions * 100) if impressions else 0,
                'conversion_rate': (conversions / clicks * 100) if clicks else 0,
                'cost_per_conversion': (float(spend) / conversions) if conversions else 0
            }
        } for campaign_id, campaign_name, campaign_type, impressions, clicks, conversions, spend in results] 