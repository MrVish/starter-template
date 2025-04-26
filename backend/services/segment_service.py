from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import json
from sqlalchemy import func, desc, asc, and_, or_
from extensions import db
from models import (
    CustomerSegment,
    CustomerProfile,
    MarketingCampaign,
    FactCampaignPerformance,
    SegmentCriteria,
    CustomerInteraction
)
from sqlalchemy.orm import Session

class SegmentService:
    """Service for customer segmentation and segment management"""
    
    def __init__(self, db_session: Session):
        """Initialize the service with a database session.
        
        Args:
            db_session: SQLAlchemy database session
        """
        self.db_session = db_session

    def create_segment(self, segment_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new customer segment"""
        
        new_segment = CustomerSegment(
            name=segment_data.get('name'),
            description=segment_data.get('description'),
            type=segment_data.get('type', 'Manual'),
            creation_date=segment_data.get('creation_date') or datetime.utcnow(),
            last_updated=segment_data.get('last_updated') or datetime.utcnow(),
            refresh_frequency=segment_data.get('refresh_frequency', 'Manual'),
            status=segment_data.get('status', 'Active')
        )
        
        self.db_session.add(new_segment)
        self.db_session.commit()
        
        # Create segment criteria if provided
        if 'criteria' in segment_data:
            for crit_data in segment_data['criteria']:
                criteria = SegmentCriteria(
                    segment_id=new_segment.id,
                    field=crit_data.get('field'),
                    operator=crit_data.get('operator'),
                    value=crit_data.get('value'),
                    conjunction=crit_data.get('conjunction', 'AND')
                )
                self.db_session.add(criteria)
            
            self.db_session.commit()
        
        # If segment type is 'Dynamic', refresh the segment members
        if new_segment.type == 'Dynamic' and segment_data.get('refresh_immediately', True):
            self.refresh_segment_members(new_segment.id)
        
        return new_segment.to_dict()
    
    def update_segment(self, segment_id: int, segment_data: Dict[str, Any]) -> Dict[str, Any]:
        """Update an existing customer segment"""
        
        segment = CustomerSegment.query.get(segment_id)
        
        if not segment:
            raise ValueError(f"Segment with ID {segment_id} not found")
        
        # Update segment fields
        for field in ['name', 'description', 'type', 'refresh_frequency', 'status']:
            if field in segment_data:
                setattr(segment, field, segment_data[field])
        
        segment.last_updated = datetime.utcnow()
        self.db_session.commit()
        
        # Update criteria if provided
        if 'criteria' in segment_data:
            # Remove existing criteria if specified
            if segment_data.get('replace_criteria', False):
                SegmentCriteria.query.filter_by(segment_id=segment_id).delete()
                
            # Add new criteria
            for crit_data in segment_data['criteria']:
                # If ID provided, update existing criteria
                if 'id' in crit_data:
                    criteria = SegmentCriteria.query.get(crit_data['id'])
                    if criteria and criteria.segment_id == segment_id:
                        for field in ['field', 'operator', 'value', 'conjunction']:
                            if field in crit_data:
                                setattr(criteria, field, crit_data[field])
                else:
                    # Create new criteria
                    criteria = SegmentCriteria(
                        segment_id=segment_id,
                        field=crit_data.get('field'),
                        operator=crit_data.get('operator'),
                        value=crit_data.get('value'),
                        conjunction=crit_data.get('conjunction', 'AND')
                    )
                    self.db_session.add(criteria)
            
            self.db_session.commit()
        
        # If segment type is 'Dynamic' and refresh requested, refresh the segment members
        if segment.type == 'Dynamic' and segment_data.get('refresh_members', False):
            self.refresh_segment_members(segment_id)
        
        return self.get_segment_details(segment_id)
    
    def delete_segment(self, segment_id: int) -> Dict[str, Any]:
        """Delete a customer segment"""
        
        segment = CustomerSegment.query.get(segment_id)
        
        if not segment:
            raise ValueError(f"Segment with ID {segment_id} not found")
        
        # Check if the segment is linked to campaigns
        associated_campaigns = MarketingCampaign.query.filter_by(target_segment_id=segment_id).count()
        
        if associated_campaigns > 0:
            raise ValueError(f"Cannot delete segment with ID {segment_id} as it has {associated_campaigns} associated campaigns")
        
        # Delete all associated criteria
        SegmentCriteria.query.filter_by(segment_id=segment_id).delete()
        
        # Remove segment associations from customer profiles
        profiles = CustomerProfile.query.filter(
            CustomerProfile.segments.contains(f"{segment_id}:")
        ).all()
        
        for profile in profiles:
            segments = json.loads(profile.segments) if profile.segments else {}
            if str(segment_id) in segments:
                del segments[str(segment_id)]
                profile.segments = json.dumps(segments)
        
        self.db_session.commit()
        
        # Delete the segment
        self.db_session.delete(segment)
        self.db_session.commit()
        
        return {"success": True, "message": f"Segment with ID {segment_id} deleted"}
    
    def get_all_segments(self, status: Optional[str] = None) -> List[Dict[str, Any]]:
        """Get all customer segments, optionally filtered by status"""
        
        query = CustomerSegment.query
        
        if status:
            query = query.filter_by(status=status)
        
        segments = query.order_by(desc(CustomerSegment.creation_date)).all()
        
        return [segment.to_dict() for segment in segments]
    
    def get_segment_details(self, segment_id: int) -> Dict[str, Any]:
        """Get detailed information for a specific segment"""
        
        segment = CustomerSegment.query.get(segment_id)
        
        if not segment:
            raise ValueError(f"Segment with ID {segment_id} not found")
        
        result = segment.to_dict()
        
        # Add criteria
        criteria = SegmentCriteria.query.filter_by(segment_id=segment_id).all()
        result['criteria'] = [crit.to_dict() for crit in criteria]
        
        # Add member count
        member_count = 0
        if segment.type == 'Dynamic':
            # For dynamic segments, count profiles that match the criteria
            member_count = self._count_matching_profiles(segment_id)
        else:
            # For manual segments, count profiles with this segment in their segments field
            member_count = CustomerProfile.query.filter(
                CustomerProfile.segments.contains(f"{segment_id}:")
            ).count()
        
        result['member_count'] = member_count
        
        # Add campaigns targeting this segment
        campaigns = MarketingCampaign.query.filter_by(target_segment_id=segment_id).all()
        result['campaigns'] = [campaign.to_dict() for campaign in campaigns]
        
        # Add segment performance metrics
        performance = self.db_session.query(
            func.sum(FactCampaignPerformance.impressions).label('total_impressions'),
            func.sum(FactCampaignPerformance.clicks).label('total_clicks'),
            func.sum(FactCampaignPerformance.conversions).label('total_conversions'),
            func.sum(FactCampaignPerformance.cost).label('total_cost'),
            func.sum(FactCampaignPerformance.revenue).label('total_revenue')
        ).join(
            MarketingCampaign, MarketingCampaign.id == FactCampaignPerformance.campaign_id
        ).filter(
            MarketingCampaign.target_segment_id == segment_id
        ).first()
        
        if performance and performance.total_impressions:
            result['performance'] = {
                'impressions': performance.total_impressions,
                'clicks': performance.total_clicks,
                'conversions': performance.total_conversions,
                'cost': performance.total_cost,
                'revenue': performance.total_revenue,
                'ctr': (performance.total_clicks / performance.total_impressions) * 100 if performance.total_impressions else 0,
                'conversion_rate': (performance.total_conversions / performance.total_impressions) * 100 if performance.total_impressions else 0,
                'cpa': performance.total_cost / performance.total_conversions if performance.total_conversions else 0,
                'roi': ((performance.total_revenue - performance.total_cost) / performance.total_cost) * 100 if performance.total_cost else 0
            }
        else:
            result['performance'] = {
                'impressions': 0,
                'clicks': 0,
                'conversions': 0,
                'cost': 0,
                'revenue': 0,
                'ctr': 0,
                'conversion_rate': 0,
                'cpa': 0,
                'roi': 0
            }
        
        return result
    
    def refresh_segment_members(self, segment_id: int) -> Dict[str, Any]:
        """Refresh segment members for a dynamic segment"""
        
        segment = CustomerSegment.query.get(segment_id)
        
        if not segment:
            raise ValueError(f"Segment with ID {segment_id} not found")
        
        if segment.type != 'Dynamic':
            raise ValueError(f"Cannot refresh members for non-dynamic segment with ID {segment_id}")
        
        # Get criteria for this segment
        criteria = SegmentCriteria.query.filter_by(segment_id=segment_id).all()
        
        if not criteria:
            return {"success": False, "message": "No criteria defined for this segment"}
        
        # Build query to find matching profiles
        matching_profiles = self._find_matching_profiles(segment_id)
        
        # Update segment associations for all profiles
        updated_count = 0
        for profile in matching_profiles:
            segments = json.loads(profile.segments) if profile.segments else {}
            
            # Add this segment with current date
            segments[str(segment_id)] = datetime.utcnow().strftime('%Y-%m-%d')
            profile.segments = json.dumps(segments)
            updated_count += 1
        
        # Remove segment from profiles that no longer match
        non_matching_profiles = CustomerProfile.query.filter(
            CustomerProfile.segments.contains(f"{segment_id}:"),
            ~CustomerProfile.id.in_([p.id for p in matching_profiles])
        ).all()
        
        removed_count = 0
        for profile in non_matching_profiles:
            segments = json.loads(profile.segments) if profile.segments else {}
            
            # Remove this segment
            if str(segment_id) in segments:
                del segments[str(segment_id)]
                profile.segments = json.dumps(segments)
                removed_count += 1
        
        self.db_session.commit()
        
        # Update segment last_updated
        segment.last_updated = datetime.utcnow()
        self.db_session.commit()
        
        return {
            "success": True, 
            "message": f"Segment refreshed: {updated_count} profiles added, {removed_count} profiles removed",
            "added_count": updated_count,
            "removed_count": removed_count,
            "total_members": updated_count
        }
    
    def add_profiles_to_segment(self, segment_id: int, profile_ids: List[int]) -> Dict[str, Any]:
        """Add customer profiles to a manual segment"""
        
        segment = CustomerSegment.query.get(segment_id)
        
        if not segment:
            raise ValueError(f"Segment with ID {segment_id} not found")
        
        if segment.type != 'Manual':
            raise ValueError(f"Cannot manually add profiles to dynamic segment with ID {segment_id}")
        
        # Get profiles with the specified IDs
        profiles = CustomerProfile.query.filter(CustomerProfile.id.in_(profile_ids)).all()
        
        added_count = 0
        for profile in profiles:
            segments = json.loads(profile.segments) if profile.segments else {}
            
            # Only add if not already in segment
            if str(segment_id) not in segments:
                segments[str(segment_id)] = datetime.utcnow().strftime('%Y-%m-%d')
                profile.segments = json.dumps(segments)
                added_count += 1
        
        self.db_session.commit()
        
        # Update segment last_updated
        segment.last_updated = datetime.utcnow()
        self.db_session.commit()
        
        return {
            "success": True,
            "message": f"{added_count} profiles added to segment",
            "added_count": added_count
        }
    
    def remove_profiles_from_segment(self, segment_id: int, profile_ids: List[int]) -> Dict[str, Any]:
        """Remove customer profiles from a manual segment"""
        
        segment = CustomerSegment.query.get(segment_id)
        
        if not segment:
            raise ValueError(f"Segment with ID {segment_id} not found")
        
        if segment.type != 'Manual':
            raise ValueError(f"Cannot manually remove profiles from dynamic segment with ID {segment_id}")
        
        # Get profiles with the specified IDs that are in this segment
        profiles = CustomerProfile.query.filter(
            CustomerProfile.id.in_(profile_ids),
            CustomerProfile.segments.contains(f"{segment_id}:")
        ).all()
        
        removed_count = 0
        for profile in profiles:
            segments = json.loads(profile.segments) if profile.segments else {}
            
            # Remove this segment
            if str(segment_id) in segments:
                del segments[str(segment_id)]
                profile.segments = json.dumps(segments)
                removed_count += 1
        
        self.db_session.commit()
        
        # Update segment last_updated
        segment.last_updated = datetime.utcnow()
        self.db_session.commit()
        
        return {
            "success": True,
            "message": f"{removed_count} profiles removed from segment",
            "removed_count": removed_count
        }
    
    def get_segment_members(self, segment_id: int, page: int = 1, per_page: int = 100) -> Dict[str, Any]:
        """Get customers in a segment with pagination"""
        
        segment = CustomerSegment.query.get(segment_id)
        
        if not segment:
            raise ValueError(f"Segment with ID {segment_id} not found")
        
        # For Dynamic segments, get matching profiles
        if segment.type == 'Dynamic':
            profiles_query = self._find_matching_profiles(segment_id)
        else:
            # For Manual segments, get profiles with this segment in their segments field
            profiles_query = CustomerProfile.query.filter(
                CustomerProfile.segments.contains(f"{segment_id}:")
            )
        
        # Paginate results
        paginated_profiles = profiles_query.paginate(page=page, per_page=per_page, error_out=False)
        
        return {
            "segment_id": segment_id,
            "segment_name": segment.name,
            "total_members": paginated_profiles.total,
            "page": page,
            "per_page": per_page,
            "total_pages": paginated_profiles.pages,
            "members": [profile.to_dict() for profile in paginated_profiles.items]
        }
    
    def get_segment_performance_over_time(self, segment_id: int, time_period: str = 'last_30_days') -> Dict[str, Any]:
        """Get segment performance metrics over time"""
        
        segment = CustomerSegment.query.get(segment_id)
        
        if not segment:
            raise ValueError(f"Segment with ID {segment_id} not found")
        
        # Determine date range based on time_period
        end_date = datetime.utcnow().date()
        
        if time_period == 'last_7_days':
            start_date = end_date - timedelta(days=7)
        elif time_period == 'last_30_days':
            start_date = end_date - timedelta(days=30)
        elif time_period == 'last_90_days':
            start_date = end_date - timedelta(days=90)
        elif time_period == 'year_to_date':
            start_date = datetime(end_date.year, 1, 1).date()
        else:
            # Default to last 30 days
            start_date = end_date - timedelta(days=30)
        
        # Get campaign performance data for this segment by date
        performance_by_date = self.db_session.query(
            FactCampaignPerformance.date,
            func.sum(FactCampaignPerformance.impressions).label('impressions'),
            func.sum(FactCampaignPerformance.clicks).label('clicks'),
            func.sum(FactCampaignPerformance.conversions).label('conversions'),
            func.sum(FactCampaignPerformance.cost).label('cost'),
            func.sum(FactCampaignPerformance.revenue).label('revenue')
        ).join(
            MarketingCampaign, MarketingCampaign.id == FactCampaignPerformance.campaign_id
        ).filter(
            MarketingCampaign.target_segment_id == segment_id,
            FactCampaignPerformance.date.between(start_date, end_date)
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
            roi = ((perf.revenue - perf.cost) / perf.cost) * 100 if perf.cost else 0
            ctr = (perf.clicks / perf.impressions) * 100 if perf.impressions else 0
            conv_rate = (perf.conversions / perf.impressions) * 100 if perf.impressions else 0
            
            rois.append(roi)
            ctrs.append(ctr)
            conversion_rates.append(conv_rate)
        
        # Calculate totals
        total_impressions = sum(impressions)
        total_clicks = sum(clicks)
        total_conversions = sum(conversions)
        total_cost = sum(costs)
        total_revenue = sum(revenues)
        
        return {
            'segment_id': segment_id,
            'segment_name': segment.name,
            'time_period': time_period,
            'date_range': {
                'start_date': start_date.strftime('%Y-%m-%d'),
                'end_date': end_date.strftime('%Y-%m-%d')
            },
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
                'impressions': total_impressions,
                'clicks': total_clicks,
                'conversions': total_conversions,
                'cost': total_cost,
                'revenue': total_revenue,
                'roi': ((total_revenue - total_cost) / total_cost) * 100 if total_cost else 0,
                'ctr': (total_clicks / total_impressions) * 100 if total_impressions else 0,
                'conversion_rate': (total_conversions / total_impressions) * 100 if total_impressions else 0,
                'cpa': total_cost / total_conversions if total_conversions else 0
            }
        }
    
    def analyze_segment_behavior(self, segment_id: int) -> Dict[str, Any]:
        """Analyze customer behavior patterns within a segment"""
        
        segment = CustomerSegment.query.get(segment_id)
        
        if not segment:
            raise ValueError(f"Segment with ID {segment_id} not found")
        
        # Get member IDs for this segment
        if segment.type == 'Dynamic':
            member_profiles = self._find_matching_profiles(segment_id).all()
        else:
            member_profiles = CustomerProfile.query.filter(
                CustomerProfile.segments.contains(f"{segment_id}:")
            ).all()
        
        member_ids = [profile.id for profile in member_profiles]
        
        if not member_ids:
            return {
                'segment_id': segment_id,
                'segment_name': segment.name,
                'member_count': 0,
                'message': 'No members in this segment for analysis'
            }
        
        # Get interactions for segment members
        interactions = CustomerInteraction.query.filter(
            CustomerInteraction.customer_id.in_(member_ids)
        ).all()
        
        # Analyze interaction types
        interaction_types = {}
        for inter in interactions:
            interaction_type = inter.interaction_type
            if interaction_type not in interaction_types:
                interaction_types[interaction_type] = 0
            interaction_types[interaction_type] += 1
        
        # Analyze channels
        channels = {}
        for inter in interactions:
            channel = inter.channel
            if channel not in channels:
                channels[channel] = 0
            channels[channel] += 1
        
        # Analyze time patterns
        hour_of_day = [0] * 24
        day_of_week = [0] * 7
        
        for inter in interactions:
            hour = inter.timestamp.hour
            day = inter.timestamp.weekday()
            
            hour_of_day[hour] += 1
            day_of_week[day] += 1
        
        # Calculate average interactions per customer
        avg_interactions = len(interactions) / len(member_ids) if member_ids else 0
        
        # Get most recent interaction date for recency analysis
        recent_interactions = []
        for member_id in member_ids:
            last_interaction = CustomerInteraction.query.filter_by(
                customer_id=member_id
            ).order_by(desc(CustomerInteraction.timestamp)).first()
            
            if last_interaction:
                days_since = (datetime.utcnow() - last_interaction.timestamp).days
                recent_interactions.append(days_since)
        
        avg_recency = sum(recent_interactions) / len(recent_interactions) if recent_interactions else 0
        
        # Find most common product categories
        product_categories = {}
        for inter in interactions:
            if inter.interaction_type == 'purchase' and inter.product_category:
                category = inter.product_category
                if category not in product_categories:
                    product_categories[category] = 0
                product_categories[category] += 1
        
        return {
            'segment_id': segment_id,
            'segment_name': segment.name,
            'member_count': len(member_ids),
            'interaction_analysis': {
                'total_interactions': len(interactions),
                'avg_interactions_per_customer': avg_interactions,
                'avg_days_since_last_interaction': avg_recency,
                'interaction_types': [{'type': k, 'count': v} for k, v in sorted(interaction_types.items(), key=lambda x: x[1], reverse=True)],
                'channels': [{'channel': k, 'count': v} for k, v in sorted(channels.items(), key=lambda x: x[1], reverse=True)],
                'hour_of_day': [{'hour': i, 'count': count} for i, count in enumerate(hour_of_day)],
                'day_of_week': [{'day': i, 'count': count} for i, count in enumerate(day_of_week)],
                'product_categories': [{'category': k, 'count': v} for k, v in sorted(product_categories.items(), key=lambda x: x[1], reverse=True)[:10]]
            }
        }
    
    def compare_segments(self, segment_ids: List[int]) -> Dict[str, Any]:
        """Compare performance and characteristics of multiple segments"""
        
        if not segment_ids or len(segment_ids) < 2:
            raise ValueError("At least two segment IDs must be provided for comparison")
        
        segments = CustomerSegment.query.filter(CustomerSegment.id.in_(segment_ids)).all()
        
        if len(segments) != len(segment_ids):
            raise ValueError("Some segment IDs were not found")
        
        segment_data = []
        
        for segment in segments:
            # Get segment details
            details = self.get_segment_details(segment.id)
            
            # Get member count
            member_count = details.get('member_count', 0)
            
            # Get performance metrics
            performance = details.get('performance', {})
            
            # Get basic behavioral patterns
            behavior_data = self.analyze_segment_behavior(segment.id)
            behavior = behavior_data.get('interaction_analysis', {})
            
            segment_data.append({
                'id': segment.id,
                'name': segment.name,
                'member_count': member_count,
                'performance': performance,
                'avg_interactions_per_customer': behavior.get('avg_interactions_per_customer', 0),
                'avg_days_since_last_interaction': behavior.get('avg_days_since_last_interaction', 0),
                'top_channels': behavior.get('channels', [])[:3],
                'top_interaction_types': behavior.get('interaction_types', [])[:3],
                'top_product_categories': behavior.get('product_categories', [])[:3]
            })
        
        return {
            'segments': segment_data,
            'comparison_date': datetime.utcnow().strftime('%Y-%m-%d')
        }
    
    def find_similar_profiles(self, profile_id: int, limit: int = 10) -> Dict[str, Any]:
        """Find customer profiles similar to the given profile"""
        
        profile = CustomerProfile.query.get(profile_id)
        
        if not profile:
            raise ValueError(f"Customer profile with ID {profile_id} not found")
        
        # Determine the segments this profile belongs to
        profile_segments = []
        if profile.segments:
            segments = json.loads(profile.segments)
            profile_segments = list(segments.keys())
        
        # Find other profiles in the same segments
        similar_profiles = []
        if profile_segments:
            # Build a query to find profiles in the same segments
            query = CustomerProfile.query.filter(CustomerProfile.id != profile_id)
            
            for segment_id in profile_segments:
                query = query.filter(CustomerProfile.segments.contains(f"{segment_id}:"))
            
            similar_profiles = query.limit(limit).all()
        
        # If not enough similar profiles found by segments, add more based on other attributes
        if len(similar_profiles) < limit:
            needed = limit - len(similar_profiles)
            existing_ids = [p.id for p in similar_profiles] + [profile_id]
            
            # Find profiles with similar attributes (age, location, etc.)
            more_similar = CustomerProfile.query.filter(
                CustomerProfile.id.notin_(existing_ids),
                or_(
                    CustomerProfile.age.between(profile.age - 5, profile.age + 5) if profile.age else False,
                    CustomerProfile.location == profile.location if profile.location else False,
                    CustomerProfile.gender == profile.gender if profile.gender else False
                )
            ).limit(needed).all()
            
            similar_profiles.extend(more_similar)
        
        return {
            'profile_id': profile_id,
            'similar_profiles': [p.to_dict() for p in similar_profiles],
            'similarity_criteria': {
                'common_segments': profile_segments,
                'demographic_matching': ['age', 'location', 'gender']
            }
        }
    
    def _find_matching_profiles(self, segment_id: int):
        """Find customer profiles that match segment criteria"""
        
        criteria = SegmentCriteria.query.filter_by(segment_id=segment_id).all()
        
        if not criteria:
            return CustomerProfile.query.filter(False)  # Empty result
        
        # Start with all profiles
        query = CustomerProfile.query
        
        # Apply each criterion
        for i, crit in enumerate(criteria):
            field = crit.field
            operator = crit.operator
            value = crit.value
            conjunction = crit.conjunction
            
            # Only consider conjunction for criteria after the first
            if i > 0 and conjunction == 'OR':
                # For OR conditions, we need to use a more complex approach
                # Save the current query state, then union with new condition
                current_matches = query
                
                # Create a new query with just this condition
                condition_query = self._apply_criterion_to_query(CustomerProfile.query, field, operator, value)
                
                # Union the two queries
                query = current_matches.union(condition_query)
            else:
                # For AND conditions, simply add the condition to the query
                query = self._apply_criterion_to_query(query, field, operator, value)
        
        return query
    
    def _apply_criterion_to_query(self, query, field, operator, value):
        """Apply a single criterion to a query"""
        
        model_attr = getattr(CustomerProfile, field, None)
        
        if not model_attr:
            return query  # Field not found, return unchanged query
        
        if operator == 'equals':
            return query.filter(model_attr == value)
        elif operator == 'not_equals':
            return query.filter(model_attr != value)
        elif operator == 'greater_than':
            try:
                numeric_value = float(value)
                return query.filter(model_attr > numeric_value)
            except ValueError:
                return query
        elif operator == 'less_than':
            try:
                numeric_value = float(value)
                return query.filter(model_attr < numeric_value)
            except ValueError:
                return query
        elif operator == 'contains':
            return query.filter(model_attr.contains(value))
        elif operator == 'not_contains':
            return query.filter(~model_attr.contains(value))
        elif operator == 'starts_with':
            return query.filter(model_attr.startswith(value))
        elif operator == 'ends_with':
            return query.filter(model_attr.endswith(value))
        elif operator == 'is_null':
            return query.filter(model_attr.is_(None))
        elif operator == 'is_not_null':
            return query.filter(model_attr.isnot(None))
        elif operator == 'in_list':
            try:
                list_values = value.split(',')
                return query.filter(model_attr.in_(list_values))
            except:
                return query
        elif operator == 'not_in_list':
            try:
                list_values = value.split(',')
                return query.filter(~model_attr.in_(list_values))
            except:
                return query
        elif operator == 'between':
            try:
                min_val, max_val = value.split(',')
                min_val = float(min_val.strip())
                max_val = float(max_val.strip())
                return query.filter(model_attr.between(min_val, max_val))
            except:
                return query
        else:
            return query  # Unknown operator, return unchanged query
    
    def _count_matching_profiles(self, segment_id: int) -> int:
        """Count customer profiles that match segment criteria"""
        
        query = self._find_matching_profiles(segment_id)
        return query.count() 