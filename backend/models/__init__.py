"""Models package for SQLAlchemy database models"""

# Import dimensional models
from .dim_dates import DimDate
from .dim_permissions import DimPermission
from .dim_roles import DimRole
from .dim_users import DimUser
from .dim_segments import DimSegment
from .dim_campaign_templates import DimCampaignTemplate
from .dim_channels import DimChannel, ChannelType
from .dim_campaigns import DimCampaign
from .dim_contact_preferences import DimContactPreferences
from .dim_customers import DimCustomer
from .dim_customer_ai_features import DimCustomerAIFeatures
from .dim_ad_groups import DimAdGroup
from .dim_kpis import DimKPI
from .dim_data_sources import DimDataSource

# Import fact tables that depend on dimension tables
from .fact_campaign_performance import FactCampaignPerformance
from .fact_channel_performance import FactChannelPerformance
from .fact_segment_performance import FactSegmentPerformance
from .fact_transactions import FactTransaction
from .fact_feedback import FactFeedback
from .fact_campaign_kpi_results import FactCampaignKPIResult
from .fact_data_ingestion_runs import FactDataIngestionRun
from .fact_user_actions import FactUserAction

# Import association tables
from .associations import user_roles, role_permissions
from .ad_group_role_mappings import ad_group_role_mappings

# Import staging tables
from .stg_customer_profile import StgCustomerProfile
from .stg_customer_channel_activity import StgCustomerChannelActivity
from .stg_transactions import StgTransaction
from .stg_product_ownership import StgProductOwnership
from .stg_feedback_scores import StgFeedbackScore
from .stg_contact_constraints import StgContactConstraint
from .stg_customer_features import StgCustomerFeature

# This file is intentionally left empty to mark the directory as a Python package 