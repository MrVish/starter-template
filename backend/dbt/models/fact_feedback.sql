{{ config(materialized='incremental', unique_key='id') }}

WITH feedback_source AS (
    -- Customer feedback from various channels
    SELECT 
        fs.feedback_id,
        fs.customer_id,
        fs.feedback_date,
        fs.channel_id,
        fs.category,
        fs.sub_category,
        fs.sentiment_score,
        fs.verbatim,
        fs.nps_score,
        fs.csat_score,
        fs.ces_score,
        fs.touchpoint,
        fs.resolved_flag,
        fs.load_timestamp
    FROM stg.stg_feedback_scores fs
)

SELECT
    fs.feedback_id AS id,
    -- Foreign keys to dimension tables
    dc.id AS customer_key,
    dd.id AS date_key,
    dch.id AS channel_key,
    
    -- Feedback attributes
    fs.category,
    fs.sub_category,
    fs.sentiment_score,
    fs.verbatim,
    fs.nps_score,
    fs.csat_score,
    fs.ces_score,
    fs.touchpoint,
    fs.resolved_flag,
    
    -- Derived sentiment category
    CASE 
        WHEN fs.sentiment_score >= 0.5 THEN 'POSITIVE'
        WHEN fs.sentiment_score >= 0 THEN 'NEUTRAL'
        ELSE 'NEGATIVE'
    END AS sentiment_category,
    
    -- NPS categorization
    CASE 
        WHEN fs.nps_score >= 9 THEN 'PROMOTER'
        WHEN fs.nps_score >= 7 THEN 'PASSIVE'
        WHEN fs.nps_score >= 0 THEN 'DETRACTOR'
        ELSE NULL
    END AS nps_category,
    
    -- CSAT categorization
    CASE 
        WHEN fs.csat_score >= 4 THEN 'SATISFIED'
        WHEN fs.csat_score >= 3 THEN 'NEUTRAL'
        WHEN fs.csat_score >= 1 THEN 'DISSATISFIED'
        ELSE NULL
    END AS csat_category,
    
    -- Metadata
    fs.feedback_date AS feedback_timestamp,
    fs.load_timestamp AS load_dts
FROM feedback_source fs
-- Join to dimension tables
JOIN {{ ref('dim_customers') }} dc ON dc.id = fs.customer_id
JOIN {{ ref('dim_dates') }} dd ON dd.full_date = DATE(fs.feedback_date)
LEFT JOIN {{ ref('dim_channels') }} dch ON dch.id = fs.channel_id

{% if is_incremental() %}
  WHERE fs.load_timestamp > (SELECT max(load_dts) FROM {{ this }})
{% endif %} 