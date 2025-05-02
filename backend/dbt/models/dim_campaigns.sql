{{ config(materialized='incremental', unique_key='id') }}

WITH campaign_source AS (
    -- In a real implementation, this would come from a staging table
    -- For this example, we're simulating the source data
    SELECT 
        c.campaign_id,
        c.campaign_name,
        c.campaign_type,
        c.description,
        c.start_date,
        c.end_date,
        c.budget,
        c.target_segment_id,
        c.target_audience_size,
        c.created_by_user_id,
        c.status,
        c.template_id,
        c.load_timestamp
    FROM stg.stg_campaigns c
)

SELECT
    cs.campaign_id AS id,
    cs.campaign_name,
    cs.campaign_type,
    cs.description,
    cs.start_date,
    cs.end_date,
    cs.budget,
    cs.target_segment_id,
    cs.target_audience_size,
    cs.created_by_user_id,
    cs.status,
    cs.template_id,
    
    -- Calculate derived fields
    CASE 
        WHEN CURRENT_DATE BETWEEN cs.start_date AND cs.end_date THEN 'ACTIVE'
        WHEN CURRENT_DATE < cs.start_date THEN 'SCHEDULED'
        WHEN CURRENT_DATE > cs.end_date THEN 'COMPLETED'
        ELSE cs.status
    END AS derived_status,
    
    DATE_PART('day', cs.end_date - cs.start_date) + 1 AS campaign_duration_days,
    
    -- Metadata
    cs.load_timestamp AS last_updated_dts
FROM campaign_source cs

{% if is_incremental() %}
  WHERE cs.load_timestamp > (SELECT max(last_updated_dts) FROM {{ this }})
{% endif %} 