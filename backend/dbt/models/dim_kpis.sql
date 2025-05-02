{{ config(materialized='table') }}

WITH kpi_source AS (
    -- In a real implementation, this would come from a staging table
    -- For illustration purposes, creating a static set of KPIs
    SELECT *
    FROM (VALUES
        (1, 'OPEN_RATE', 'Email Open Rate', 'Percentage of emails opened by recipients', 'CAMPAIGN', 'PERCENTAGE', 'Y'),
        (2, 'CTR', 'Click-Through Rate', 'Percentage of users who click on a link', 'CAMPAIGN', 'PERCENTAGE', 'Y'),
        (3, 'CONVERSION_RATE', 'Conversion Rate', 'Percentage of users who complete a desired action', 'CAMPAIGN', 'PERCENTAGE', 'Y'),
        (4, 'CPA', 'Cost Per Acquisition', 'Cost to acquire a customer', 'CAMPAIGN', 'CURRENCY', 'Y'),
        (5, 'ROI', 'Return on Investment', 'Revenue generated per dollar spent', 'CAMPAIGN', 'RATIO', 'Y'),
        (6, 'NPS', 'Net Promoter Score', 'Customer loyalty metric', 'CUSTOMER', 'SCORE', 'Y'),
        (7, 'CSAT', 'Customer Satisfaction', 'Customer satisfaction score', 'CUSTOMER', 'SCORE', 'Y'),
        (8, 'CES', 'Customer Effort Score', 'Ease of customer experience', 'CUSTOMER', 'SCORE', 'Y'),
        (9, 'CHURN_RATE', 'Churn Rate', 'Rate at which customers leave', 'CUSTOMER', 'PERCENTAGE', 'Y'),
        (10, 'LTV', 'Lifetime Value', 'Expected revenue from a customer', 'CUSTOMER', 'CURRENCY', 'Y'),
        (11, 'UPSELL_RATE', 'Upsell Rate', 'Rate of existing customers purchasing more', 'PRODUCT', 'PERCENTAGE', 'Y'),
        (12, 'CROSS_SELL_RATE', 'Cross-Sell Rate', 'Rate of existing customers buying additional products', 'PRODUCT', 'PERCENTAGE', 'Y'),
        (13, 'ACTIVE_USERS', 'Active Users', 'Count of active users in the system', 'SYSTEM', 'COUNT', 'Y'),
        (14, 'RESPONSE_TIME', 'Response Time', 'Time to respond to customer inquiries', 'SERVICE', 'TIME', 'Y'),
        (15, 'RESOLUTION_RATE', 'Resolution Rate', 'Percentage of issues resolved successfully', 'SERVICE', 'PERCENTAGE', 'Y')
    ) AS t(id, kpi_code, kpi_name, description, category, value_type, is_active)
)

SELECT
    ks.id,
    ks.kpi_code,
    ks.kpi_name,
    ks.description,
    ks.category,
    ks.value_type,
    CASE WHEN ks.is_active = 'Y' THEN TRUE ELSE FALSE END AS is_active,
    
    -- Good/bad direction for this KPI
    CASE 
        WHEN ks.kpi_code IN ('OPEN_RATE', 'CTR', 'CONVERSION_RATE', 'ROI', 'NPS', 'CSAT', 'LTV', 'UPSELL_RATE', 
                            'CROSS_SELL_RATE', 'ACTIVE_USERS', 'RESOLUTION_RATE') 
        THEN 'HIGHER_BETTER'
        WHEN ks.kpi_code IN ('CPA', 'CHURN_RATE', 'RESPONSE_TIME') 
        THEN 'LOWER_BETTER'
        ELSE 'NEUTRAL'
    END AS direction,
    
    -- Default target if applicable
    CASE 
        WHEN ks.kpi_code = 'OPEN_RATE' THEN 25.0  -- 25%
        WHEN ks.kpi_code = 'CTR' THEN 3.0         -- 3%
        WHEN ks.kpi_code = 'CONVERSION_RATE' THEN 2.0  -- 2%
        WHEN ks.kpi_code = 'ROI' THEN 3.0         -- 3x
        WHEN ks.kpi_code = 'NPS' THEN 30.0        -- Score 30
        WHEN ks.kpi_code = 'CSAT' THEN 4.0        -- Score 4/5
        WHEN ks.kpi_code = 'CHURN_RATE' THEN 5.0  -- 5%
        ELSE NULL
    END AS default_target,
    
    CURRENT_TIMESTAMP AS last_updated_dts
FROM kpi_source ks 