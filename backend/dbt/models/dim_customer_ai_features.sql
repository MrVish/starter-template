{{ config(materialized='incremental', unique_key='id') }}

WITH customer_features AS (
    -- This would come from a machine learning model output
    -- or feature store in a real implementation
    SELECT 
        cf.customer_id,
        cf.lifetime_value_prediction,
        cf.churn_probability,
        cf.next_best_product,
        cf.credit_risk_score,
        cf.engagement_score,
        cf.price_sensitivity,
        cf.digital_adoption_score,
        cf.model_version,
        cf.prediction_date,
        cf.load_timestamp
    FROM stg.stg_customer_features cf
)

SELECT
    cf.customer_id AS id,
    -- Reference to customer dimension
    dc.customer_hk,
    
    -- ML Features
    cf.lifetime_value_prediction,
    cf.churn_probability,
    cf.next_best_product,
    cf.credit_risk_score,
    cf.engagement_score,
    cf.price_sensitivity,
    cf.digital_adoption_score,
    
    -- Feature categories (derived from scores)
    CASE 
        WHEN cf.churn_probability >= 0.7 THEN 'HIGH_RISK'
        WHEN cf.churn_probability >= 0.4 THEN 'MEDIUM_RISK'
        ELSE 'LOW_RISK'
    END AS churn_risk_category,
    
    CASE 
        WHEN cf.lifetime_value_prediction >= 10000 THEN 'HIGH_VALUE'
        WHEN cf.lifetime_value_prediction >= 5000 THEN 'MEDIUM_VALUE'
        ELSE 'STANDARD_VALUE'
    END AS value_category,
    
    CASE
        WHEN cf.engagement_score >= 8 THEN 'HIGHLY_ENGAGED'
        WHEN cf.engagement_score >= 5 THEN 'ENGAGED'
        WHEN cf.engagement_score >= 2 THEN 'PARTIALLY_ENGAGED'
        ELSE 'DISENGAGED'
    END AS engagement_category,
    
    -- Metadata
    cf.model_version,
    cf.prediction_date,
    cf.load_timestamp AS last_updated_dts
FROM customer_features cf
JOIN {{ ref('dim_customers') }} dc ON dc.id = cf.customer_id

{% if is_incremental() %}
  WHERE cf.load_timestamp > (SELECT max(last_updated_dts) FROM {{ this }})
{% endif %} 