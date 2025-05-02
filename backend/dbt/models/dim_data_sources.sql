{{ config(materialized='table') }}

WITH data_source AS (
    -- In a real implementation, this would come from a staging table
    -- For illustration purposes, creating a static set of data sources
    SELECT *
    FROM (VALUES
        (1, 'TRANSACTIONS', 'Transaction Data', 'Core banking transaction data', 'DATABASE', 'daily', 'Y'),
        (2, 'CUSTOMER_PROFILE', 'Customer Profiles', 'Customer demographic and profile data', 'DATABASE', 'daily', 'Y'),
        (3, 'CREDIT_SCORES', 'Credit Scores', 'Customer credit scores from bureau', 'API', 'monthly', 'Y'),
        (4, 'MARKETING_CAMPAIGNS', 'Marketing Campaigns', 'Campaign metadata and targeting', 'DATABASE', 'daily', 'Y'),
        (5, 'CAMPAIGN_RESPONSES', 'Campaign Responses', 'Customer responses to campaigns', 'DATABASE', 'daily', 'Y'),
        (6, 'CUSTOMER_FEEDBACK', 'Customer Feedback', 'Surveys and feedback submissions', 'API', 'daily', 'Y'),
        (7, 'WEB_ANALYTICS', 'Web Analytics', 'Website usage and behavior', 'FILE', 'daily', 'Y'),
        (8, 'MOBILE_APP_ANALYTICS', 'Mobile App Analytics', 'Mobile app usage and behavior', 'FILE', 'daily', 'Y'),
        (9, 'CALL_CENTER_LOGS', 'Call Center Logs', 'Customer service call records', 'FILE', 'daily', 'Y'),
        (10, 'PRODUCT_CATALOG', 'Product Catalog', 'Banking product information', 'DATABASE', 'weekly', 'Y')
    ) AS t(id, source_code, source_name, description, source_type, refresh_frequency, is_active)
)

SELECT
    ds.id,
    ds.source_code,
    ds.source_name,
    ds.description,
    ds.source_type,
    ds.refresh_frequency,
    CASE WHEN ds.is_active = 'Y' THEN TRUE ELSE FALSE END AS is_active,
    
    -- Connection details would come from secure storage in real implementation
    -- and would be specific to the source_type
    CASE 
        WHEN ds.source_type = 'DATABASE' THEN '{"connection_type": "jdbc", "schema": "banking_' || LOWER(ds.source_code) || '"}'
        WHEN ds.source_type = 'API' THEN '{"connection_type": "rest", "base_url": "https://api.example.com/' || LOWER(ds.source_code) || '"}'
        WHEN ds.source_type = 'FILE' THEN '{"connection_type": "s3", "bucket": "data-lake", "prefix": "' || LOWER(ds.source_code) || '/"}'
        ELSE '{}'
    END::JSONB AS connection_details,
    
    -- Latest run status would join to fact_data_ingestion_runs in a real implementation
    -- This is just a placeholder
    'SUCCESS' AS latest_run_status,
    
    CURRENT_TIMESTAMP AS last_updated_dts
FROM data_source ds 