{{ config(materialized='table') }}

WITH campaign_kpi_targets AS (
    -- Campaign KPI targets from campaign setup
    SELECT 
        ck.campaign_id,
        ck.kpi_id,
        ck.target_value,
        ck.target_type,
        ck.load_timestamp AS target_timestamp
    FROM stg.stg_campaign_kpi_targets ck
),

campaign_results AS (
    -- Actual campaign results for KPIs
    -- This would typically come from campaign performance data
    SELECT
        cp.campaign_id,
        cp.date_id,
        cp.channel_id,
        dk.id AS kpi_id,
        CASE
            WHEN dk.kpi_code = 'OPEN_RATE' THEN cp.open_rate
            WHEN dk.kpi_code = 'CTR' THEN cp.click_through_rate
            WHEN dk.kpi_code = 'CONVERSION_RATE' THEN cp.conversion_rate
            WHEN dk.kpi_code = 'CPA' THEN cp.cost_per_acquisition
            WHEN dk.kpi_code = 'ROI' THEN cp.roi
            ELSE NULL
        END AS actual_value,
        cp.load_dts AS result_timestamp
    FROM {{ ref('fact_campaign_performance') }} cp
    CROSS JOIN {{ ref('dim_kpis') }} dk
    WHERE dk.kpi_code IN ('OPEN_RATE', 'CTR', 'CONVERSION_RATE', 'CPA', 'ROI')
)

SELECT
    -- Composite ID 
    CONCAT(cr.campaign_id, '_', cr.kpi_id, '_', cr.date_id) AS id,
    
    -- Foreign keys
    cr.campaign_id,
    cr.kpi_id,
    cr.date_id,
    cr.channel_id,
    
    -- Actual vs Target comparison
    cr.actual_value,
    ckt.target_value,
    ckt.target_type,
    
    -- Achievement percentage
    CASE 
        WHEN ckt.target_value IS NOT NULL AND ckt.target_value != 0
        THEN ROUND((cr.actual_value / ckt.target_value) * 100, 2)
        ELSE NULL
    END AS achievement_percentage,
    
    -- Status based on achievement
    CASE 
        WHEN ckt.target_value IS NULL THEN 'NO_TARGET'
        WHEN cr.actual_value >= ckt.target_value THEN 'ACHIEVED'
        WHEN cr.actual_value >= ckt.target_value * 0.9 THEN 'NEAR_TARGET'
        ELSE 'BELOW_TARGET'
    END AS achievement_status,
    
    -- Metadata
    GREATEST(cr.result_timestamp, ckt.target_timestamp) AS last_updated_dts
FROM campaign_results cr
LEFT JOIN campaign_kpi_targets ckt 
    ON ckt.campaign_id = cr.campaign_id
    AND ckt.kpi_id = cr.kpi_id 