{{ config(materialized='table') }}

WITH role_source AS (
    -- In a real implementation, this would come from a staging table
    -- For illustration purposes, we're creating a static set of roles
    SELECT *
    FROM (VALUES
        (1, 'ADMIN', 'System Administrator', 'Full system access', 'Y'),
        (2, 'MANAGER', 'Campaign Manager', 'Create and manage campaigns', 'Y'),
        (3, 'ANALYST', 'Data Analyst', 'View and analyze data, generate reports', 'Y'),
        (4, 'CONTENT_CREATOR', 'Content Creator', 'Create and manage content', 'Y'),
        (5, 'VIEWER', 'Report Viewer', 'View reports only', 'Y'),
        (6, 'API_USER', 'API Integration User', 'System-to-system integration access', 'Y')
    ) AS t(id, role_code, role_name, description, is_active)
)

SELECT
    rs.id,
    rs.role_code,
    rs.role_name,
    rs.description,
    CASE WHEN rs.is_active = 'Y' THEN TRUE ELSE FALSE END AS is_active,
    
    -- For a real implementation, you would join to permissions
    -- through the role_permissions join table
    -- This would be replaced with actual permission data
    ARRAY(
        SELECT 
            p.id
        FROM {{ ref('dim_permissions') }} p
        JOIN stg.stg_role_permissions rp ON rp.permission_id = p.id
        WHERE rp.role_id = rs.id
    ) AS permission_ids,
    
    CURRENT_TIMESTAMP AS last_updated_dts
FROM role_source rs 