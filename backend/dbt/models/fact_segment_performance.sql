{{ config(materialized='incremental', unique_key=['segment_id', 'date_id']) }}

WITH segment_metrics AS (
    -- Daily aggregation of key metrics per segment
    -- In a real implementation, this would be calculated from 
    -- customer transactions, campaign responses, etc.
    
    -- Transactions by segment
    SELECT
        cf.segment_id,
        DATE(t.transaction_date) AS metric_date,
        COUNT(DISTINCT t.customer_id) AS active_customers,
        COUNT(*) AS transaction_count,
        SUM(t.amount) AS transaction_amount,
        'TRANSACTIONS' AS metric_source,
        MAX(t.load_timestamp) AS load_timestamp
    FROM stg.stg_transactions t
    JOIN stg.stg_customer_features cf ON cf.customer_id = t.customer_id
    GROUP BY cf.segment_id, DATE(t.transaction_date)
    
    UNION ALL
    
    -- Campaign responses by segment
    SELECT
        c.target_segment_id AS segment_id,
        DATE(r.response_date) AS metric_date,
        COUNT(DISTINCT r.customer_id) AS active_customers,
        COUNT(*) AS response_count,
        SUM(CASE WHEN r.conversion_flag = 1 THEN r.conversion_value ELSE 0 END) AS conversion_value,
        'CAMPAIGNS' AS metric_source,
        MAX(r.load_timestamp) AS load_timestamp
    FROM stg.stg_campaign_responses r
    JOIN stg.stg_campaigns c ON c.campaign_id = r.campaign_id
    WHERE c.target_segment_id IS NOT NULL
    GROUP BY c.target_segment_id, DATE(r.response_date)
)

SELECT
    -- Foreign keys
    sm.segment_id,
    dd.id AS date_id,
    
    -- Performance metrics
    SUM(CASE WHEN sm.metric_source = 'TRANSACTIONS' THEN sm.active_customers ELSE 0 END) AS transacting_customers,
    SUM(CASE WHEN sm.metric_source = 'TRANSACTIONS' THEN sm.transaction_count ELSE 0 END) AS transaction_count,
    SUM(CASE WHEN sm.metric_source = 'TRANSACTIONS' THEN sm.transaction_amount ELSE 0 END) AS transaction_amount,
    
    SUM(CASE WHEN sm.metric_source = 'CAMPAIGNS' THEN sm.active_customers ELSE 0 END) AS responding_customers,
    SUM(CASE WHEN sm.metric_source = 'CAMPAIGNS' THEN sm.response_count ELSE 0 END) AS response_count,
    SUM(CASE WHEN sm.metric_source = 'CAMPAIGNS' THEN sm.conversion_value ELSE 0 END) AS conversion_value,
    
    -- Calculated metrics
    CASE 
        WHEN ds.id IS NOT NULL THEN 
            SUM(CASE WHEN sm.metric_source = 'TRANSACTIONS' THEN sm.transaction_amount ELSE 0 END) / 
            NULLIF(COUNT(DISTINCT CASE WHEN sm.metric_source = 'TRANSACTIONS' THEN sm.active_customers END), 0)
        ELSE 0
    END AS avg_value_per_customer,
    
    -- Metadata
    MAX(sm.load_timestamp) AS load_dts
FROM segment_metrics sm
JOIN {{ ref('dim_segments') }} ds ON ds.id = sm.segment_id
JOIN {{ ref('dim_dates') }} dd ON dd.full_date = sm.metric_date
GROUP BY sm.segment_id, dd.id, ds.id

{% if is_incremental() %}
  HAVING MAX(sm.load_timestamp) > (SELECT max(load_dts) FROM {{ this }})
{% endif %} 