{{ config(materialized='incremental', unique_key=['channel_id', 'date_id']) }}

WITH channel_activity AS (
    SELECT
        cca.channel,
        DATE(cca.activity_dts) AS activity_date,
        SUM(cca.opens) AS opens,
        SUM(cca.clicks) AS clicks,
        SUM(cca.logins) AS logins,
        COUNT(DISTINCT cca.customer_hk) AS distinct_customers,
        MAX(cca.load_dts) AS load_timestamp
    FROM stg.sat_customer_channel_activity cca
    GROUP BY cca.channel, DATE(cca.activity_dts)
),

transaction_activity AS (
    SELECT
        t.channel_id,
        DATE(t.transaction_date) AS txn_date,
        COUNT(*) AS transaction_count,
        SUM(t.amount) AS transaction_amount,
        COUNT(DISTINCT t.customer_id) AS transacting_customers,
        MAX(t.load_timestamp) AS load_timestamp
    FROM stg.stg_transactions t
    GROUP BY t.channel_id, DATE(t.transaction_date)
)

SELECT
    -- Foreign keys
    dc.id AS channel_id,
    dd.id AS date_id,
    
    -- Activity metrics
    COALESCE(ca.opens, 0) AS opens,
    COALESCE(ca.clicks, 0) AS clicks,
    COALESCE(ca.logins, 0) AS logins,
    COALESCE(ca.distinct_customers, 0) AS active_customers,
    
    -- Transaction metrics
    COALESCE(ta.transaction_count, 0) AS transactions,
    COALESCE(ta.transaction_amount, 0) AS transaction_value,
    COALESCE(ta.transacting_customers, 0) AS transacting_customers,
    
    -- Calculated metrics
    CASE 
        WHEN COALESCE(ca.distinct_customers, 0) > 0 
        THEN ROUND(COALESCE(ta.transacting_customers, 0) / COALESCE(ca.distinct_customers, 1)::NUMERIC, 3)
        ELSE 0 
    END AS conversion_rate,
    
    CASE 
        WHEN COALESCE(ta.transacting_customers, 0) > 0 
        THEN ROUND(COALESCE(ta.transaction_amount, 0) / COALESCE(ta.transacting_customers, 1)::NUMERIC, 2)
        ELSE 0 
    END AS avg_value_per_customer,
    
    GREATEST(COALESCE(ca.load_timestamp, '1900-01-01'), COALESCE(ta.load_timestamp, '1900-01-01')) AS load_dts
    
FROM {{ ref('dim_channels') }} dc
JOIN {{ ref('dim_dates') }} dd ON 1=1
LEFT JOIN channel_activity ca ON 
    ca.channel = dc.channel_name AND
    ca.activity_date = dd.full_date
LEFT JOIN transaction_activity ta ON 
    ta.channel_id = dc.id AND
    ta.txn_date = dd.full_date

-- Only include rows where we have activity
WHERE (ca.distinct_customers > 0 OR ta.transaction_count > 0)

{% if is_incremental() %}
  AND GREATEST(COALESCE(ca.load_timestamp, '1900-01-01'), COALESCE(ta.load_timestamp, '1900-01-01'))
      > (SELECT max(load_dts) FROM {{ this }})
{% endif %} 