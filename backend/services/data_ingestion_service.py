from typing import List, Dict, Any, Optional
from datetime import datetime
import json
from sqlalchemy import func
from extensions import db
from models import (
    DimDataSource,
    FactDataIngestionRun,
    StgCustomerProfile,
    DimCustomer,
    StgProductOwnership,
    StgTransaction,
    FactTransaction,
    StgFeedbackScore,
    FactFeedback,
    StgContactConstraint,
    DimContactPreferences
)

class DataIngestionService:
    """Service for data ingestion and ETL operations"""
    
    def create_data_source(self, source_data: Dict[str, Any]) -> Dict[str, Any]:
        """Register a new data source system"""
        
        new_source = DimDataSource(
            name=source_data.get('name')
        )
        
        db.session.add(new_source)
        db.session.commit()
        
        return new_source.to_dict()
    
    def get_all_data_sources(self) -> List[Dict[str, Any]]:
        """Get all registered data sources"""
        
        sources = DimDataSource.query.all()
        return [source.to_dict() for source in sources]
    
    def record_ingestion_run(self, source_id: int, status: str, row_count: int) -> Dict[str, Any]:
        """Record a data ingestion run"""
        
        run = FactDataIngestionRun(
            source_id=source_id,
            status=status,
            row_count=row_count,
            run_time=datetime.utcnow()
        )
        
        db.session.add(run)
        db.session.commit()
        
        return run.to_dict()
    
    def import_customer_profiles(self) -> Dict[str, Any]:
        """Import customer profiles from staging to dimension table"""
        
        # Get profiles from staging
        staging_profiles = StgCustomerProfile.query.all()
        
        profiles_imported = 0
        profiles_updated = 0
        
        for stg_profile in staging_profiles:
            # Check if customer already exists
            existing_customer = DimCustomer.query.filter_by(email=stg_profile.email).first()
            
            if existing_customer:
                # Update existing customer
                existing_customer.full_name = stg_profile.full_name
                existing_customer.dob = stg_profile.dob
                existing_customer.gender = stg_profile.gender
                existing_customer.income_bracket = stg_profile.income_bracket
                existing_customer.risk_profile = stg_profile.risk_profile
                existing_customer.location = stg_profile.location
                profiles_updated += 1
            else:
                # Create new customer
                new_customer = DimCustomer(
                    full_name=stg_profile.full_name,
                    email=stg_profile.email,
                    dob=stg_profile.dob,
                    gender=stg_profile.gender,
                    income_bracket=stg_profile.income_bracket,
                    risk_profile=stg_profile.risk_profile,
                    location=stg_profile.location,
                    joined_date=stg_profile.joined_date
                )
                db.session.add(new_customer)
                profiles_imported += 1
                
        db.session.commit()
        
        return {
            'profiles_imported': profiles_imported,
            'profiles_updated': profiles_updated,
            'total_processed': profiles_imported + profiles_updated
        }
    
    def import_transactions(self) -> Dict[str, Any]:
        """Import transactions from staging to fact table"""
        
        # Get transactions from staging
        staging_transactions = StgTransaction.query.all()
        
        transactions_imported = 0
        skipped_count = 0
        
        for stg_txn in staging_transactions:
            # Check if transaction already exists
            existing_txn = FactTransaction.query.filter_by(txn_id=stg_txn.txn_id).first()
            
            if existing_txn:
                skipped_count += 1
                continue
            
            # Find customer
            customer = DimCustomer.query.filter_by(email=stg_txn.customer_id).first()
            
            if not customer:
                skipped_count += 1
                continue
                
            # Create new transaction
            new_txn = FactTransaction(
                txn_id=stg_txn.txn_id,
                customer_id=customer.id,
                txn_date=stg_txn.txn_date,
                product_code=stg_txn.product,
                txn_amount=stg_txn.txn_amount,
                txn_type=stg_txn.txn_type
            )
            
            db.session.add(new_txn)
            transactions_imported += 1
                
        db.session.commit()
        
        return {
            'transactions_imported': transactions_imported,
            'skipped_count': skipped_count,
            'total_processed': transactions_imported + skipped_count
        }
    
    def import_feedback(self) -> Dict[str, Any]:
        """Import feedback scores from staging to fact table"""
        
        # Get feedback from staging
        staging_feedback = StgFeedbackScore.query.all()
        
        feedback_imported = 0
        skipped_count = 0
        
        for stg_feedback in staging_feedback:
            # Check if feedback already exists
            existing_feedback = FactFeedback.query.filter_by(
                customer_id=stg_feedback.customer_id,
                submitted_at=stg_feedback.submitted_at
            ).first()
            
            if existing_feedback:
                skipped_count += 1
                continue
            
            # Find customer
            customer = DimCustomer.query.filter_by(email=stg_feedback.customer_id).first()
            
            if not customer:
                skipped_count += 1
                continue
                
            # Create new feedback
            new_feedback = FactFeedback(
                customer_id=customer.id,
                campaign_id=stg_feedback.campaign_id,
                rating=stg_feedback.rating,
                comments=stg_feedback.comments,
                submitted_at=stg_feedback.submitted_at
            )
            
            db.session.add(new_feedback)
            feedback_imported += 1
                
        db.session.commit()
        
        return {
            'feedback_imported': feedback_imported,
            'skipped_count': skipped_count,
            'total_processed': feedback_imported + skipped_count
        }
    
    def import_contact_preferences(self) -> Dict[str, Any]:
        """Import contact preferences from staging to dimension table"""
        
        # Get preferences from staging
        staging_preferences = StgContactConstraint.query.all()
        
        preferences_imported = 0
        preferences_updated = 0
        skipped_count = 0
        
        for stg_pref in staging_preferences:
            # Find customer
            customer = DimCustomer.query.filter_by(email=stg_pref.customer_id).first()
            
            if not customer:
                skipped_count += 1
                continue
                
            # Check if preferences already exist
            existing_prefs = DimContactPreferences.query.filter_by(customer_id=customer.id).first()
            
            if existing_prefs:
                # Update existing preferences
                existing_prefs.do_not_email = stg_pref.do_not_email
                existing_prefs.do_not_sms = stg_pref.do_not_sms
                existing_prefs.preferred_contact_time = stg_pref.preferred_contact_time
                preferences_updated += 1
            else:
                # Create new preferences
                new_prefs = DimContactPreferences(
                    customer_id=customer.id,
                    do_not_email=stg_pref.do_not_email,
                    do_not_sms=stg_pref.do_not_sms,
                    preferred_contact_time=stg_pref.preferred_contact_time
                )
                db.session.add(new_prefs)
                preferences_imported += 1
                
        db.session.commit()
        
        return {
            'preferences_imported': preferences_imported,
            'preferences_updated': preferences_updated,
            'skipped_count': skipped_count,
            'total_processed': preferences_imported + preferences_updated + skipped_count
        }
    
    def get_data_ingestion_stats(self) -> Dict[str, Any]:
        """Get statistics on data ingestion runs"""
        
        # Get overall stats
        overall_stats = db.session.query(
            func.count(FactDataIngestionRun.id).label('total_runs'),
            func.sum(case([(FactDataIngestionRun.status == 'Success', 1)], else_=0)).label('successful_runs'),
            func.sum(case([(FactDataIngestionRun.status == 'Failure', 1)], else_=0)).label('failed_runs'),
            func.sum(FactDataIngestionRun.row_count).label('total_rows'),
            func.avg(FactDataIngestionRun.row_count).label('avg_rows_per_run')
        ).first()
        
        # Get stats by source
        source_stats = db.session.query(
            DimDataSource.id,
            DimDataSource.name,
            func.count(FactDataIngestionRun.id).label('runs'),
            func.sum(FactDataIngestionRun.row_count).label('rows')
        ).join(
            FactDataIngestionRun, FactDataIngestionRun.source_id == DimDataSource.id
        ).group_by(
            DimDataSource.id, DimDataSource.name
        ).all()
        
        return {
            'overall': {
                'total_runs': overall_stats.total_runs or 0,
                'successful_runs': overall_stats.successful_runs or 0,
                'failed_runs': overall_stats.failed_runs or 0,
                'success_rate': (overall_stats.successful_runs / overall_stats.total_runs * 100) 
                               if overall_stats.total_runs else 0,
                'total_rows': overall_stats.total_rows or 0,
                'avg_rows_per_run': float(overall_stats.avg_rows_per_run or 0)
            },
            'by_source': [{
                'source_id': source_id,
                'source_name': source_name,
                'runs': runs,
                'rows': rows
            } for source_id, source_name, runs, rows in source_stats]
        }
    
    def run_full_etl_process(self, source_id: int) -> Dict[str, Any]:
        """Run a full ETL process importing all staging data to dimension and fact tables"""
        
        start_time = datetime.utcnow()
        row_count = 0
        
        try:
            # Import customer profiles
            profile_result = self.import_customer_profiles()
            row_count += profile_result['total_processed']
            
            # Import contact preferences
            preferences_result = self.import_contact_preferences()
            row_count += preferences_result['total_processed']
            
            # Import transactions
            transaction_result = self.import_transactions()
            row_count += transaction_result['total_processed']
            
            # Import feedback
            feedback_result = self.import_feedback()
            row_count += feedback_result['total_processed']
            
            # Record successful run
            self.record_ingestion_run(source_id, 'Success', row_count)
            
            end_time = datetime.utcnow()
            duration = (end_time - start_time).total_seconds()
            
            return {
                'status': 'success',
                'source_id': source_id,
                'total_rows': row_count,
                'duration_seconds': duration,
                'details': {
                    'profiles': profile_result,
                    'preferences': preferences_result,
                    'transactions': transaction_result,
                    'feedback': feedback_result
                }
            }
            
        except Exception as e:
            # Record failed run
            self.record_ingestion_run(source_id, 'Failure', 0)
            
            return {
                'status': 'error',
                'source_id': source_id,
                'message': str(e)
            } 