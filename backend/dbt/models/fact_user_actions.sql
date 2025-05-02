{{ config(materialized='incremental', unique_key='id') }}

WITH user_actions AS (
    -- This would typically come from application logs
    -- capturing user activity within the system
    SELECT 
        ua.action_id,
        ua.user_id,
        ua.action_type,
        ua.action_timestamp,
        ua.entity_type,
        ua.entity_id,
        ua.action_details,
        ua.ip_address,
        ua.user_agent,
        ua.session_id,
        ua.load_timestamp
    FROM stg.stg_user_actions ua
)

SELECT
    ua.action_id AS id,
    -- Foreign keys
    du.id AS user_key,
    dd.id AS date_key,
    
    -- Action details
    ua.action_type,
    ua.entity_type,
    ua.entity_id,
    ua.action_details,
    ua.ip_address,
    ua.user_agent,
    ua.session_id,
    
    -- Time components for easier analysis
    ua.action_timestamp,
    EXTRACT(HOUR FROM ua.action_timestamp) AS action_hour,
    
    -- Action category based on type
    CASE 
        WHEN ua.action_type LIKE 'VIEW%' THEN 'READ'
        WHEN ua.action_type LIKE 'CREATE%' THEN 'CREATE'
        WHEN ua.action_type LIKE 'UPDATE%' THEN 'UPDATE'
        WHEN ua.action_type LIKE 'DELETE%' THEN 'DELETE'
        WHEN ua.action_type LIKE 'EXPORT%' THEN 'EXPORT'
        WHEN ua.action_type LIKE 'LOGIN%' OR ua.action_type LIKE 'LOGOUT%' THEN 'AUTHENTICATION'
        ELSE 'OTHER'
    END AS action_category,
    
    -- Entity category based on type
    CASE 
        WHEN ua.entity_type LIKE '%CAMPAIGN%' THEN 'CAMPAIGN'
        WHEN ua.entity_type LIKE '%SEGMENT%' THEN 'SEGMENT'
        WHEN ua.entity_type LIKE '%USER%' THEN 'USER'
        WHEN ua.entity_type LIKE '%REPORT%' THEN 'REPORT'
        WHEN ua.entity_type LIKE '%CUSTOMER%' THEN 'CUSTOMER'
        ELSE ua.entity_type
    END AS entity_category,
    
    -- Metadata
    ua.load_timestamp AS load_dts
FROM user_actions ua
JOIN {{ ref('dim_users') }} du ON du.id = ua.user_id
JOIN {{ ref('dim_dates') }} dd ON dd.full_date = DATE(ua.action_timestamp)

{% if is_incremental() %}
  WHERE ua.load_timestamp > (SELECT max(load_dts) FROM {{ this }})
{% endif %} 