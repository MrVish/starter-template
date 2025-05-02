{{ config(materialized='incremental', unique_key=['customer_key', 'date_key', 'channel_key']) }}

WITH channel_activity AS (
    SELECT
        scca.customer_hk,
        scca.channel,
        DATE(scca.activity_dts) AS activity_date,
        SUM(scca.opens) AS opens,
        SUM(scca.clicks) AS clicks,
        SUM(scca.logins) AS logins,
        scca.load_dts
    FROM stg.sat_customer_channel_activity scca
    GROUP BY scca.customer_hk, scca.channel, DATE(scca.activity_dts), scca.load_dts
)

SELECT
    -- Use surrogate keys from dimensions
    dc.customer_key,
    dd.date_key,
    dch.channel_key,
    -- Activity metrics
    ca.opens,
    ca.clicks,
    ca.logins,
    -- In a real implementation, these would come from additional sources
    -- For illustration, we'll simulate based on the available metrics
    CASE 
        WHEN ca.logins > 0 THEN ca.logins
        ELSE 0
    END AS session_count,
    -- Average session duration in seconds (simulated)
    CASE 
        WHEN ca.logins > 0 THEN ca.logins * 180
        ELSE 0
    END AS session_duration_seconds,
    -- Conversion count (simulated)
    CASE
        WHEN ca.clicks > 10 THEN 1
        ELSE 0
    END AS conversion_count,
    -- Bounce count (simulated)
    CASE
        WHEN ca.logins > 0 AND ca.clicks = 0 THEN 1
        ELSE 0
    END AS bounce_count,
    ca.activity_date,
    ca.load_dts
FROM channel_activity ca
-- Join to dimension tables
JOIN {{ ref('dim_customers') }} dc ON dc.customer_hk = ca.customer_hk
JOIN {{ ref('dim_dates') }} dd ON dd.full_date = ca.activity_date
JOIN {{ ref('dim_channels') }} dch ON dch.channel_name = ca.channel

{% if is_incremental() %}
  WHERE ca.load_dts > (SELECT max(load_dts) FROM {{ this }})
{% endif %}
; 