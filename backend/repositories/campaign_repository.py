from datetime import datetime, date
from typing import List, Dict, Any, Optional
from sqlalchemy import func, desc
from .base_repository import BaseRepository
from models import (
    DimCampaign,
    DimChannel,
    DimSegment,
    FactCampaignPerformance,
    DimDate
)

class CampaignRepository(BaseRepository[DimCampaign]):
    """Repository for campaign operations"""
    
    def __init__(self):
        super().__init__(DimCampaign)
    
    def get_campaigns_with_performance(self, page=1, per_page=10) -> Dict[str, Any]:
        """Get campaigns with aggregated performance metrics"""
        query = (
            DimCampaign.query
            .outerjoin(FactCampaignPerformance, FactCampaignPerformance.campaign_id == DimCampaign.id)
            .group_by(DimCampaign.id)
            .add_columns(
                func.sum(FactCampaignPerformance.impressions).label('total_impressions'),
                func.sum(FactCampaignPerformance.clicks).label('total_clicks'),
                func.sum(FactCampaignPerformance.conversions).label('total_conversions'),
                func.sum(FactCampaignPerformance.spend).label('total_spend'),
            )
            .order_by(desc(DimCampaign.start_date))
        )
        
        # Handle pagination
        total = query.count()
        campaigns = query.paginate(page=page, per_page=per_page, error_out=False)
        
        results = []
        for campaign, impressions, clicks, conversions, spend in campaigns.items:
            campaign_dict = campaign.to_dict()
            campaign_dict.update({
                'total_impressions': impressions or 0,
                'total_clicks': clicks or 0, 
                'total_conversions': conversions or 0,
                'total_spend': float(spend) if spend else 0,
                'ctr': (clicks / impressions) if impressions and clicks else 0,
                'conversion_rate': (conversions / clicks) if clicks and conversions else 0,
            })
            results.append(campaign_dict)
            
        return {
            'campaigns': results,
            'total': total,
            'page': page,
            'per_page': per_page,
            'pages': (total // per_page) + (1 if total % per_page > 0 else 0)
        }
    
    def get_campaign_performance_by_channel(self, campaign_id: int) -> List[Dict[str, Any]]:
        """Get channel performance for a specific campaign"""
        results = (
            FactCampaignPerformance.query
            .join(DimChannel, DimChannel.id == FactCampaignPerformance.channel_id)
            .filter(FactCampaignPerformance.campaign_id == campaign_id)
            .group_by(DimChannel.id)
            .add_columns(
                DimChannel.name,
                DimChannel.type,
                func.sum(FactCampaignPerformance.impressions).label('impressions'),
                func.sum(FactCampaignPerformance.clicks).label('clicks'),
                func.sum(FactCampaignPerformance.conversions).label('conversions'),
                func.sum(FactCampaignPerformance.spend).label('spend')
            )
            .all()
        )
        
        return [{
            'channel_id': channel.id,
            'channel_name': name,
            'channel_type': type.value if type else None,
            'impressions': impressions or 0,
            'clicks': clicks or 0,
            'conversions': conversions or 0,
            'spend': float(spend) if spend else 0,
            'ctr': (clicks / impressions) if impressions and clicks else 0,
            'conversion_rate': (conversions / clicks) if clicks and conversions else 0,
        } for channel, name, type, impressions, clicks, conversions, spend in results]
    
    def get_active_campaigns(self) -> List[DimCampaign]:
        """Get currently active campaigns"""
        today = date.today()
        return (
            DimCampaign.query
            .filter(
                DimCampaign.start_date <= today,
                DimCampaign.end_date >= today
            )
            .all()
        )
    
    def get_campaigns_by_segment(self, segment_id: int) -> List[DimCampaign]:
        """Get all campaigns targeting a specific segment"""
        return DimCampaign.query.filter_by(segment_id=segment_id).all() 