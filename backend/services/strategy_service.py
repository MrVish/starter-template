from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import json
from sqlalchemy import func, desc, asc
from extensions import db
from models import (
    MarketingStrategy,
    StrategyObjective,
    ChannelAllocation,
    PerformanceForecast,
    MarketingCampaign,
    CustomerSegment,
    FactCampaignPerformance
)

class StrategyService:
    """Service for marketing strategy planning and optimization"""
    
    def create_strategy(self, strategy_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new marketing strategy"""
        
        new_strategy = MarketingStrategy(
            name=strategy_data.get('name'),
            description=strategy_data.get('description'),
            start_date=strategy_data.get('start_date'),
            end_date=strategy_data.get('end_date'),
            status=strategy_data.get('status', 'Draft'),
            budget=strategy_data.get('budget'),
            owner=strategy_data.get('owner')
        )
        
        db.session.add(new_strategy)
        db.session.commit()
        
        # Create objectives if provided
        if 'objectives' in strategy_data:
            for obj_data in strategy_data['objectives']:
                objective = StrategyObjective(
                    strategy_id=new_strategy.id,
                    name=obj_data.get('name'),
                    description=obj_data.get('description'),
                    target_value=obj_data.get('target_value'),
                    metric_name=obj_data.get('metric_name'),
                    priority=obj_data.get('priority', 'Medium')
                )
                db.session.add(objective)
            
            db.session.commit()
            
        # Create channel allocations if provided
        if 'channel_allocations' in strategy_data:
            for channel_data in strategy_data['channel_allocations']:
                allocation = ChannelAllocation(
                    strategy_id=new_strategy.id,
                    channel=channel_data.get('channel'),
                    allocation_pct=channel_data.get('allocation_pct'),
                    budget_amount=channel_data.get('budget_amount')
                )
                db.session.add(allocation)
            
            db.session.commit()
        
        return new_strategy.to_dict()
    
    def update_strategy(self, strategy_id: int, strategy_data: Dict[str, Any]) -> Dict[str, Any]:
        """Update an existing marketing strategy"""
        
        strategy = MarketingStrategy.query.get(strategy_id)
        
        if not strategy:
            raise ValueError(f"Strategy with ID {strategy_id} not found")
        
        # Update strategy fields
        for field in ['name', 'description', 'start_date', 'end_date', 'status', 'budget', 'owner']:
            if field in strategy_data:
                setattr(strategy, field, strategy_data[field])
        
        db.session.commit()
        
        # Update objectives if provided
        if 'objectives' in strategy_data:
            # Remove existing objectives if specified
            if strategy_data.get('replace_objectives', False):
                StrategyObjective.query.filter_by(strategy_id=strategy_id).delete()
                
            # Add new objectives
            for obj_data in strategy_data['objectives']:
                # If ID provided, update existing objective
                if 'id' in obj_data:
                    objective = StrategyObjective.query.get(obj_data['id'])
                    if objective and objective.strategy_id == strategy_id:
                        for field in ['name', 'description', 'target_value', 'metric_name', 'priority']:
                            if field in obj_data:
                                setattr(objective, field, obj_data[field])
                else:
                    # Create new objective
                    objective = StrategyObjective(
                        strategy_id=strategy_id,
                        name=obj_data.get('name'),
                        description=obj_data.get('description'),
                        target_value=obj_data.get('target_value'),
                        metric_name=obj_data.get('metric_name'),
                        priority=obj_data.get('priority', 'Medium')
                    )
                    db.session.add(objective)
            
            db.session.commit()
        
        # Update channel allocations if provided
        if 'channel_allocations' in strategy_data:
            # Remove existing allocations if specified
            if strategy_data.get('replace_allocations', False):
                ChannelAllocation.query.filter_by(strategy_id=strategy_id).delete()
                
            # Add new allocations
            for channel_data in strategy_data['channel_allocations']:
                # If ID provided, update existing allocation
                if 'id' in channel_data:
                    allocation = ChannelAllocation.query.get(channel_data['id'])
                    if allocation and allocation.strategy_id == strategy_id:
                        for field in ['channel', 'allocation_pct', 'budget_amount']:
                            if field in channel_data:
                                setattr(allocation, field, channel_data[field])
                else:
                    # Create new allocation
                    allocation = ChannelAllocation(
                        strategy_id=strategy_id,
                        channel=channel_data.get('channel'),
                        allocation_pct=channel_data.get('allocation_pct'),
                        budget_amount=channel_data.get('budget_amount')
                    )
                    db.session.add(allocation)
            
            db.session.commit()
        
        return self.get_strategy_details(strategy_id)
    
    def delete_strategy(self, strategy_id: int) -> Dict[str, Any]:
        """Delete a marketing strategy"""
        
        strategy = MarketingStrategy.query.get(strategy_id)
        
        if not strategy:
            raise ValueError(f"Strategy with ID {strategy_id} not found")
        
        # Check if the strategy is linked to campaigns
        associated_campaigns = MarketingCampaign.query.filter_by(strategy_id=strategy_id).count()
        
        if associated_campaigns > 0:
            raise ValueError(f"Cannot delete strategy with ID {strategy_id} as it has {associated_campaigns} associated campaigns")
        
        # Delete all associated objectives
        StrategyObjective.query.filter_by(strategy_id=strategy_id).delete()
        
        # Delete all associated channel allocations
        ChannelAllocation.query.filter_by(strategy_id=strategy_id).delete()
        
        # Delete all associated forecasts
        PerformanceForecast.query.filter_by(strategy_id=strategy_id).delete()
        
        # Delete the strategy
        db.session.delete(strategy)
        db.session.commit()
        
        return {"success": True, "message": f"Strategy with ID {strategy_id} deleted"}
    
    def get_all_strategies(self, status: Optional[str] = None) -> List[Dict[str, Any]]:
        """Get all marketing strategies, optionally filtered by status"""
        
        query = MarketingStrategy.query
        
        if status:
            query = query.filter_by(status=status)
        
        strategies = query.order_by(desc(MarketingStrategy.created_at)).all()
        
        return [strategy.to_dict() for strategy in strategies]
    
    def get_strategy_details(self, strategy_id: int) -> Dict[str, Any]:
        """Get detailed information for a specific strategy"""
        
        strategy = MarketingStrategy.query.get(strategy_id)
        
        if not strategy:
            raise ValueError(f"Strategy with ID {strategy_id} not found")
        
        result = strategy.to_dict()
        
        # Add objectives
        objectives = StrategyObjective.query.filter_by(strategy_id=strategy_id).all()
        result['objectives'] = [obj.to_dict() for obj in objectives]
        
        # Add channel allocations
        allocations = ChannelAllocation.query.filter_by(strategy_id=strategy_id).all()
        result['channel_allocations'] = [alloc.to_dict() for alloc in allocations]
        
        # Add campaigns
        campaigns = MarketingCampaign.query.filter_by(strategy_id=strategy_id).all()
        result['campaigns'] = [campaign.to_dict() for campaign in campaigns]
        
        # Calculate progress towards objectives
        objectives_with_progress = []
        for obj in objectives:
            obj_dict = obj.to_dict()
            
            # Calculate actual performance metrics
            campaigns_perf = FactCampaignPerformance.query.join(
                MarketingCampaign, MarketingCampaign.id == FactCampaignPerformance.campaign_id
            ).filter(
                MarketingCampaign.strategy_id == strategy_id
            ).all()
            
            # Sum relevant metrics based on objective metric name
            actual_value = 0
            if obj.metric_name == 'ROI':
                total_cost = sum(p.cost for p in campaigns_perf) or 1  # Avoid division by zero
                total_revenue = sum(p.revenue for p in campaigns_perf)
                actual_value = (total_revenue / total_cost) * 100
            elif obj.metric_name == 'Conversion Rate':
                total_impressions = sum(p.impressions for p in campaigns_perf) or 1  # Avoid division by zero
                total_conversions = sum(p.conversions for p in campaigns_perf)
                actual_value = (total_conversions / total_impressions) * 100
            elif obj.metric_name == 'CTR':
                total_impressions = sum(p.impressions for p in campaigns_perf) or 1  # Avoid division by zero
                total_clicks = sum(p.clicks for p in campaigns_perf)
                actual_value = (total_clicks / total_impressions) * 100
            elif obj.metric_name == 'Revenue':
                actual_value = sum(p.revenue for p in campaigns_perf)
            elif obj.metric_name == 'CPA':
                total_conversions = sum(p.conversions for p in campaigns_perf) or 1  # Avoid division by zero
                total_cost = sum(p.cost for p in campaigns_perf)
                actual_value = total_cost / total_conversions
            
            # Calculate progress percentage
            if obj.target_value:
                progress_pct = (actual_value / obj.target_value) * 100
                # For CPA, lower is better
                if obj.metric_name == 'CPA' and obj.target_value > 0:
                    progress_pct = (2 - (actual_value / obj.target_value)) * 100 if actual_value <= 2 * obj.target_value else 0
            else:
                progress_pct = 0
                
            obj_dict['actual_value'] = actual_value
            obj_dict['progress_pct'] = min(progress_pct, 100)  # Cap at 100%
            objectives_with_progress.append(obj_dict)
            
        result['objectives_with_progress'] = objectives_with_progress
        
        return result
    
    def generate_ai_recommendations(self, strategy_id: int) -> Dict[str, Any]:
        """Generate AI recommendations for optimizing marketing strategy"""
        
        strategy = self.get_strategy_details(strategy_id)
        
        # Get segment performance
        segments = CustomerSegment.query.all()
        segment_data = []
        
        for segment in segments:
            # Get campaigns targeting this segment
            performance = db.session.query(
                func.sum(FactCampaignPerformance.cost).label('total_cost'),
                func.sum(FactCampaignPerformance.revenue).label('total_revenue'),
                func.sum(FactCampaignPerformance.impressions).label('total_impressions'),
                func.sum(FactCampaignPerformance.clicks).label('total_clicks'),
                func.sum(FactCampaignPerformance.conversions).label('total_conversions')
            ).join(
                MarketingCampaign, MarketingCampaign.id == FactCampaignPerformance.campaign_id
            ).filter(
                MarketingCampaign.target_segment_id == segment.id,
                MarketingCampaign.strategy_id == strategy_id
            ).first()
            
            if performance.total_cost:
                roi = (performance.total_revenue / performance.total_cost) * 100 if performance.total_cost else 0
                ctr = (performance.total_clicks / performance.total_impressions) * 100 if performance.total_impressions else 0
                conversion_rate = (performance.total_conversions / performance.total_impressions) * 100 if performance.total_impressions else 0
                cpa = performance.total_cost / performance.total_conversions if performance.total_conversions else 0
                
                segment_data.append({
                    'segment_id': segment.id,
                    'segment_name': segment.name,
                    'roi': roi,
                    'ctr': ctr,
                    'conversion_rate': conversion_rate,
                    'cpa': cpa
                })
        
        # Get channel performance
        channel_data = []
        channels = db.session.query(MarketingCampaign.channel).filter_by(strategy_id=strategy_id).distinct().all()
        
        for (channel,) in channels:
            performance = db.session.query(
                func.sum(FactCampaignPerformance.cost).label('total_cost'),
                func.sum(FactCampaignPerformance.revenue).label('total_revenue'),
                func.sum(FactCampaignPerformance.impressions).label('total_impressions'),
                func.sum(FactCampaignPerformance.clicks).label('total_clicks'),
                func.sum(FactCampaignPerformance.conversions).label('total_conversions')
            ).join(
                MarketingCampaign, MarketingCampaign.id == FactCampaignPerformance.campaign_id
            ).filter(
                MarketingCampaign.channel == channel,
                MarketingCampaign.strategy_id == strategy_id
            ).first()
            
            if performance.total_cost:
                roi = (performance.total_revenue / performance.total_cost) * 100 if performance.total_cost else 0
                ctr = (performance.total_clicks / performance.total_impressions) * 100 if performance.total_impressions else 0
                conversion_rate = (performance.total_conversions / performance.total_impressions) * 100 if performance.total_impressions else 0
                cpa = performance.total_cost / performance.total_conversions if performance.total_conversions else 0
                
                channel_data.append({
                    'channel': channel,
                    'roi': roi,
                    'ctr': ctr,
                    'conversion_rate': conversion_rate,
                    'cpa': cpa
                })
        
        # Generate recommendations based on performance data
        recommendations = []
        
        # Budget reallocation recommendations based on ROI
        if channel_data:
            highest_roi_channel = max(channel_data, key=lambda x: x['roi'])
            lowest_roi_channel = min(channel_data, key=lambda x: x['roi'])
            
            if highest_roi_channel['roi'] > 2 * lowest_roi_channel['roi'] and lowest_roi_channel['roi'] > 0:
                recommendations.append({
                    'type': 'budget_reallocation',
                    'description': f"Consider reallocating budget from {lowest_roi_channel['channel']} (ROI: {lowest_roi_channel['roi']:.2f}%) to {highest_roi_channel['channel']} (ROI: {highest_roi_channel['roi']:.2f}%)",
                    'impact': 'high',
                    'metrics_affected': ['ROI', 'Revenue']
                })
        
        # Segment targeting recommendations
        if segment_data:
            highest_conv_segment = max(segment_data, key=lambda x: x['conversion_rate'])
            lowest_cpa_segment = min(segment_data, key=lambda x: x['cpa'])
            
            recommendations.append({
                'type': 'segment_targeting',
                'description': f"Increase focus on {highest_conv_segment['segment_name']} segment with high conversion rate ({highest_conv_segment['conversion_rate']:.2f}%)",
                'impact': 'medium',
                'metrics_affected': ['Conversion Rate', 'Revenue']
            })
            
            recommendations.append({
                'type': 'cost_efficiency',
                'description': f"Optimize campaigns targeting {lowest_cpa_segment['segment_name']} segment with lowest CPA (${lowest_cpa_segment['cpa']:.2f})",
                'impact': 'medium',
                'metrics_affected': ['CPA', 'ROI']
            })
        
        # Check objectives progress
        underperforming_objectives = [obj for obj in strategy.get('objectives_with_progress', []) if obj.get('progress_pct', 0) < 50]
        
        for obj in underperforming_objectives:
            recommendations.append({
                'type': 'objective_focus',
                'description': f"Prioritize efforts to improve {obj['metric_name']} (currently at {obj.get('progress_pct', 0):.2f}% of target)",
                'impact': 'high' if obj['priority'] == 'High' else 'medium',
                'metrics_affected': [obj['metric_name']]
            })
        
        return {
            'strategy_id': strategy_id,
            'strategy_name': strategy['name'],
            'recommendations': recommendations,
            'channel_performance': channel_data,
            'segment_performance': segment_data
        }
    
    def create_performance_forecast(self, strategy_id: int, forecast_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a performance forecast for a strategy"""
        
        # Verify strategy exists
        strategy = MarketingStrategy.query.get(strategy_id)
        if not strategy:
            raise ValueError(f"Strategy with ID {strategy_id} not found")
        
        # Create forecast
        forecast = PerformanceForecast(
            strategy_id=strategy_id,
            forecast_date=forecast_data.get('forecast_date') or datetime.utcnow(),
            period_start=forecast_data.get('period_start'),
            period_end=forecast_data.get('period_end'),
            expected_roi=forecast_data.get('expected_roi'),
            expected_revenue=forecast_data.get('expected_revenue'),
            expected_cost=forecast_data.get('expected_cost'),
            expected_conversions=forecast_data.get('expected_conversions'),
            confidence_level=forecast_data.get('confidence_level', 'Medium'),
            notes=forecast_data.get('notes')
        )
        
        db.session.add(forecast)
        db.session.commit()
        
        return forecast.to_dict()
    
    def get_strategy_forecasts(self, strategy_id: int) -> List[Dict[str, Any]]:
        """Get all forecasts for a strategy"""
        
        forecasts = PerformanceForecast.query.filter_by(strategy_id=strategy_id).order_by(desc(PerformanceForecast.forecast_date)).all()
        
        return [forecast.to_dict() for forecast in forecasts]
    
    def get_strategy_performance_over_time(self, strategy_id: int) -> Dict[str, Any]:
        """Get performance metrics over time for a strategy"""
        
        # Verify strategy exists
        strategy = MarketingStrategy.query.get(strategy_id)
        if not strategy:
            raise ValueError(f"Strategy with ID {strategy_id} not found")
        
        # Get all campaign performance for this strategy, grouped by date
        performance_by_date = db.session.query(
            FactCampaignPerformance.date,
            func.sum(FactCampaignPerformance.impressions).label('impressions'),
            func.sum(FactCampaignPerformance.clicks).label('clicks'),
            func.sum(FactCampaignPerformance.conversions).label('conversions'),
            func.sum(FactCampaignPerformance.cost).label('cost'),
            func.sum(FactCampaignPerformance.revenue).label('revenue')
        ).join(
            MarketingCampaign, MarketingCampaign.id == FactCampaignPerformance.campaign_id
        ).filter(
            MarketingCampaign.strategy_id == strategy_id
        ).group_by(
            FactCampaignPerformance.date
        ).order_by(
            asc(FactCampaignPerformance.date)
        ).all()
        
        # Format data for time series
        dates = []
        impressions = []
        clicks = []
        conversions = []
        costs = []
        revenues = []
        rois = []
        ctrs = []
        conversion_rates = []
        
        for perf in performance_by_date:
            dates.append(perf.date.strftime('%Y-%m-%d'))
            impressions.append(perf.impressions)
            clicks.append(perf.clicks)
            conversions.append(perf.conversions)
            costs.append(perf.cost)
            revenues.append(perf.revenue)
            
            # Calculate derived metrics
            roi = (perf.revenue / perf.cost) * 100 if perf.cost else 0
            ctr = (perf.clicks / perf.impressions) * 100 if perf.impressions else 0
            conv_rate = (perf.conversions / perf.impressions) * 100 if perf.impressions else 0
            
            rois.append(roi)
            ctrs.append(ctr)
            conversion_rates.append(conv_rate)
        
        return {
            'strategy_id': strategy_id,
            'strategy_name': strategy.name,
            'time_series': {
                'dates': dates,
                'metrics': {
                    'impressions': impressions,
                    'clicks': clicks,
                    'conversions': conversions,
                    'costs': costs,
                    'revenues': revenues,
                    'rois': rois,
                    'ctrs': ctrs,
                    'conversion_rates': conversion_rates
                }
            },
            'totals': {
                'impressions': sum(impressions),
                'clicks': sum(clicks),
                'conversions': sum(conversions),
                'cost': sum(costs),
                'revenue': sum(revenues),
                'roi': (sum(revenues) / sum(costs)) * 100 if sum(costs) else 0,
                'ctr': (sum(clicks) / sum(impressions)) * 100 if sum(impressions) else 0,
                'conversion_rate': (sum(conversions) / sum(impressions)) * 100 if sum(impressions) else 0
            }
        } 