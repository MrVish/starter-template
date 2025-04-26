from typing import List, Dict, Any, Optional
from datetime import datetime
from sqlalchemy import func, desc, case
from extensions import db
from models import (
    DimCustomer,
    DimCustomerAIFeatures,
    DimSegment,
    FactCampaignPerformance,
    FactSegmentPerformance,
    StgCustomerProfile,
    StgCustomerFeature
)

class SegmentationService:
    """Service for customer segmentation operations"""
    
    def create_segment(self, segment_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new customer segment"""
        
        new_segment = DimSegment(
            name=segment_data.get('name'),
            definition=segment_data.get('definition')
        )
        
        db.session.add(new_segment)
        db.session.commit()
        
        return new_segment.to_dict()
    
    def update_segment(self, segment_id: int, segment_data: Dict[str, Any]) -> Dict[str, Any]:
        """Update an existing customer segment"""
        
        segment = DimSegment.query.get(segment_id)
        if not segment:
            return None
            
        if 'name' in segment_data:
            segment.name = segment_data['name']
        if 'definition' in segment_data:
            segment.definition = segment_data['definition']
            
        db.session.commit()
        return segment.to_dict()
    
    def delete_segment(self, segment_id: int) -> Dict[str, Any]:
        """Delete a customer segment"""
        
        segment = DimSegment.query.get(segment_id)
        if not segment:
            return {'status': 'error', 'message': 'Segment not found'}
            
        # Check if segment is in use
        customer_count = DimCustomer.query.filter_by(latest_segment_id=segment_id).count()
        if customer_count > 0:
            return {
                'status': 'error', 
                'message': f'Cannot delete segment. It is assigned to {customer_count} customers.'
            }
            
        # Check if segment has performance data
        performance_count = FactSegmentPerformance.query.filter_by(segment_id=segment_id).count()
        campaign_count = FactCampaignPerformance.query.filter_by(segment_id=segment_id).count()
        
        if performance_count > 0 or campaign_count > 0:
            return {
                'status': 'error', 
                'message': 'Cannot delete segment. It has associated performance data.'
            }
            
        # Delete the segment
        db.session.delete(segment)
        db.session.commit()
        
        return {'status': 'success', 'message': 'Segment deleted successfully'}
    
    def get_all_segments(self) -> List[Dict[str, Any]]:
        """Get all defined customer segments"""
        
        segments = DimSegment.query.all()
        return [segment.to_dict() for segment in segments]
    
    def get_segment_details(self, segment_id: int) -> Dict[str, Any]:
        """Get detailed information about a specific segment"""
        
        segment = DimSegment.query.get(segment_id)
        if not segment:
            return None
            
        # Get customer count
        customer_count = DimCustomer.query.filter_by(latest_segment_id=segment_id).count()
        
        # Get segment performance data
        performance = FactSegmentPerformance.query.filter_by(segment_id=segment_id).all()
        
        # Calculate average AI feature metrics
        ai_metrics = db.session.query(
            func.avg(DimCustomerAIFeatures.churn_risk_score).label('avg_churn_risk'),
            func.avg(DimCustomerAIFeatures.lifetime_value_score).label('avg_ltv'),
            func.avg(DimCustomerAIFeatures.propensity_score).label('avg_propensity')
        ).join(
            DimCustomer, DimCustomer.id == DimCustomerAIFeatures.customer_id
        ).filter(
            DimCustomer.latest_segment_id == segment_id
        ).first()
        
        return {
            'segment': segment.to_dict(),
            'customer_count': customer_count,
            'ai_metrics': {
                'avg_churn_risk': float(ai_metrics.avg_churn_risk or 0),
                'avg_lifetime_value': float(ai_metrics.avg_ltv or 0),
                'avg_propensity': float(ai_metrics.avg_propensity or 0)
            },
            'performance_data': [p.to_dict() for p in performance]
        }
    
    def get_customer_distribution_by_segment(self) -> List[Dict[str, Any]]:
        """Get distribution of customers across segments"""
        
        results = db.session.query(
            DimSegment.id,
            DimSegment.name,
            func.count(DimCustomer.id).label('customer_count')
        ).join(
            DimCustomer, DimCustomer.latest_segment_id == DimSegment.id
        ).group_by(
            DimSegment.id, DimSegment.name
        ).order_by(
            desc('customer_count')
        ).all()
        
        total_customers = sum(count for _, _, count in results)
        
        return [{
            'segment_id': segment_id,
            'segment_name': segment_name,
            'customer_count': count,
            'percentage': (count / total_customers * 100) if total_customers > 0 else 0
        } for segment_id, segment_name, count in results]
    
    def get_segment_ai_features(self, segment_id: int) -> Dict[str, Any]:
        """Get aggregated AI feature metrics for a segment"""
        
        metrics = db.session.query(
            func.avg(DimCustomerAIFeatures.churn_risk_score).label('avg_churn_risk'),
            func.avg(DimCustomerAIFeatures.lifetime_value_score).label('avg_ltv'),
            func.avg(DimCustomerAIFeatures.propensity_score).label('avg_propensity')
        ).join(
            DimCustomer, DimCustomer.id == DimCustomerAIFeatures.customer_id
        ).filter(
            DimCustomer.latest_segment_id == segment_id
        ).first()
        
        segment = DimSegment.query.get(segment_id)
        
        return {
            'segment_id': segment_id,
            'segment_name': segment.name if segment else 'Unknown',
            'metrics': {
                'avg_churn_risk': float(metrics.avg_churn_risk or 0),
                'avg_lifetime_value': float(metrics.avg_ltv or 0),
                'avg_propensity': float(metrics.avg_propensity or 0)
            }
        }
    
    def assign_customers_to_segment(self, segment_id: int, customer_ids: List[int]) -> Dict[str, Any]:
        """Assign multiple customers to a segment"""
        
        segment = DimSegment.query.get(segment_id)
        if not segment:
            return {'status': 'error', 'message': 'Segment not found'}
            
        updated_count = 0
        not_found_count = 0
        
        for customer_id in customer_ids:
            customer = DimCustomer.query.get(customer_id)
            if customer:
                customer.latest_segment_id = segment_id
                updated_count += 1
            else:
                not_found_count += 1
                
        db.session.commit()
        
        return {
            'status': 'success',
            'updated_count': updated_count,
            'not_found_count': not_found_count,
            'total': len(customer_ids)
        }
    
    def get_customers_in_segment(self, segment_id: int, page: int = 1, per_page: int = 20) -> Dict[str, Any]:
        """Get paginated list of customers in a segment"""
        
        segment = DimSegment.query.get(segment_id)
        if not segment:
            return None
            
        query = DimCustomer.query.filter_by(latest_segment_id=segment_id)
        total = query.count()
        
        customers = query.paginate(page=page, per_page=per_page, error_out=False)
        
        return {
            'segment': segment.to_dict(),
            'customers': [c.to_dict() for c in customers.items],
            'total': total,
            'page': page,
            'per_page': per_page,
            'pages': (total // per_page) + (1 if total % per_page > 0 else 0)
        }
    
    def import_customer_features(self) -> Dict[str, Any]:
        """Import customer AI features from staging to dimension table"""
        
        # Get features from staging
        staging_features = StgCustomerFeature.query.all()
        
        features_imported = 0
        features_updated = 0
        
        for stg_feature in staging_features:
            # Find customer ID from customer_id
            customer = DimCustomer.query.filter_by(email=stg_feature.customer_id).first()
            
            if not customer:
                continue
                
            # Check if customer already has features
            existing_features = DimCustomerAIFeatures.query.filter_by(customer_id=customer.id).first()
            
            if existing_features:
                # Update existing features
                existing_features.churn_risk_score = stg_feature.churn_risk_score
                existing_features.lifetime_value_score = stg_feature.lifetime_value_score
                existing_features.propensity_score = stg_feature.propensity_score
                existing_features.model_version = stg_feature.model_version
                existing_features.scored_at = stg_feature.scored_at
                features_updated += 1
            else:
                # Create new features
                new_features = DimCustomerAIFeatures(
                    customer_id=customer.id,
                    churn_risk_score=stg_feature.churn_risk_score,
                    lifetime_value_score=stg_feature.lifetime_value_score,
                    propensity_score=stg_feature.propensity_score,
                    model_version=stg_feature.model_version,
                    scored_at=stg_feature.scored_at
                )
                db.session.add(new_features)
                features_imported += 1
                
        db.session.commit()
        
        return {
            'features_imported': features_imported,
            'features_updated': features_updated,
            'total_processed': features_imported + features_updated
        } 