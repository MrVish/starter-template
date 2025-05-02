{{ config(materialized='incremental', unique_key='id') }}

WITH user_source AS (
    -- In a real implementation, this would come from a staging table
    -- or a direct query against the users table
    SELECT 
        u.user_id,
        u.email,
        u.full_name,
        u.is_active,
        u.is_superuser,
        u.role_id,
        u.created_date,
        u.last_login,
        u.last_updated
    FROM stg.stg_users u
)

SELECT
    us.user_id AS id,
    us.email,
    us.full_name,
    us.is_active,
    us.is_superuser,
    us.role_id,
    us.created_date,
    us.last_login,
    
    -- Calculate derived fields
    CASE 
        WHEN us.last_login IS NULL THEN 'NEVER_LOGGED_IN'
        WHEN CURRENT_DATE - us.last_login <= 7 THEN 'ACTIVE'
        WHEN CURRENT_DATE - us.last_login <= 30 THEN 'RECENT'
        WHEN CURRENT_DATE - us.last_login <= 90 THEN 'INACTIVE'
        ELSE 'DORMANT'
    END AS login_status,
    
    -- Join to role for role name
    dr.role_name,
    
    -- Metadata
    COALESCE(us.last_updated, us.created_date) AS last_updated_dts
FROM user_source us
LEFT JOIN {{ ref('dim_roles') }} dr ON dr.id = us.role_id

{% if is_incremental() %}
  WHERE COALESCE(us.last_updated, us.created_date) > (SELECT max(last_updated_dts) FROM {{ this }})
{% endif %} 