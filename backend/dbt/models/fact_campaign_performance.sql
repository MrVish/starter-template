{{ config(materialized='incremental', unique_key=['campaign_id', 'date_id', 'channel_id']) }}

WITH campaign_metrics AS (
    -- In a real implementation, this would come from marketing data sources
    -- This is a placeholder query that would be replaced with actual source data
    SELECT 
        cm.campaign_id,
        cm.date,
        cm.channel_id,
        cm.sends,
        cm.opens,
        cm.clicks,
        cm.conversions,
        cm.cost,
        cm.revenue,
        cm.load_timestamp
    FROM stg.stg_campaign_metrics cm
)

SELECT
    -- Foreign keys
    cm.campaign_id,
    dd.id AS date_id,
    dc.id AS channel_id,
    ds.id AS segment_id,
    
    -- Performance metrics
    cm.sends,
    cm.opens,
    cm.clicks,
    cm.conversions,
    cm.cost,
    cm.revenue,
    
    -- Calculated metrics
    CASE 
        WHEN cm.sends > 0 THEN ROUND(cm.opens / cm.sends * 100, 2)
        ELSE 0 
    END AS open_rate,
    
    CASE 
        WHEN cm.opens > 0 THEN ROUND(cm.clicks / cm.opens * 100, 2)
        ELSE 0 
    END AS click_through_rate,
    
    CASE 
        WHEN cm.clicks > 0 THEN ROUND(cm.conversions / cm.clicks * 100, 2) 
        ELSE 0 
    END AS conversion_rate,
    
    CASE 
        WHEN cm.cost > 0 AND cm.conversions > 0 THEN ROUND(cm.cost / cm.conversions, 2)
        ELSE 0 
    END AS cost_per_acquisition,
    
    CASE 
        WHEN cm.cost > 0 THEN ROUND(cm.revenue / cm.cost, 2)
        ELSE 0 
    END AS roi,
    
    cm.load_timestamp AS load_dts
    
FROM campaign_metrics cm
JOIN {{ ref('dim_campaigns') }} dca ON dca.id = cm.campaign_id
JOIN {{ ref('dim_dates') }} dd ON dd.full_date = DATE(cm.date)
JOIN {{ ref('dim_channels') }} dc ON dc.id = cm.channel_id
LEFT JOIN {{ ref('dim_segments') }} ds ON ds.id = dca.target_segment_id

{% if is_incremental() %}
  WHERE cm.load_timestamp > (SELECT max(load_dts) FROM {{ this }})
{% endif %} 