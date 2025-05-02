{{ config(materialized='table') }}

WITH permission_source AS (
    -- In a real implementation, this would come from a staging table
    -- For illustration purposes, we're creating a static set of permissions
    SELECT *
    FROM (VALUES
        (1, 'campaigns_read', 'Read Campaigns', 'View campaign details', 'CAMPAIGNS', 'Y'),
        (2, 'campaigns_create', 'Create Campaigns', 'Create new campaigns', 'CAMPAIGNS', 'Y'),
        (3, 'campaigns_update', 'Update Campaigns', 'Modify existing campaigns', 'CAMPAIGNS', 'Y'),
        (4, 'campaigns_delete', 'Delete Campaigns', 'Remove campaigns from the system', 'CAMPAIGNS', 'Y'),
        (5, 'segments_read', 'Read Segments', 'View customer segments', 'SEGMENTS', 'Y'),
        (6, 'segments_create', 'Create Segments', 'Create new customer segments', 'SEGMENTS', 'Y'),
        (7, 'segments_update', 'Update Segments', 'Modify existing segments', 'SEGMENTS', 'Y'),
        (8, 'segments_delete', 'Delete Segments', 'Remove segments from the system', 'SEGMENTS', 'Y'),
        (9, 'reports_read', 'Access Reports', 'View analytical reports', 'ANALYTICS', 'Y'),
        (10, 'reports_export', 'Export Reports', 'Export reports to CSV/Excel', 'ANALYTICS', 'Y'),
        (11, 'users_read', 'View Users', 'View user accounts', 'ADMIN', 'Y'),
        (12, 'users_create', 'Create Users', 'Create new user accounts', 'ADMIN', 'Y'),
        (13, 'users_update', 'Update Users', 'Modify existing user accounts', 'ADMIN', 'Y'),
        (14, 'users_delete', 'Delete Users', 'Remove user accounts', 'ADMIN', 'Y'),
        (15, 'settings_read', 'View Settings', 'View system settings', 'ADMIN', 'Y'),
        (16, 'settings_update', 'Update Settings', 'Modify system settings', 'ADMIN', 'Y')
    ) AS t(id, permission_code, permission_name, description, resource_group, is_active)
)

SELECT
    ps.id,
    ps.permission_code,
    ps.permission_name,
    ps.description,
    ps.resource_group,
    CASE WHEN ps.is_active = 'Y' THEN TRUE ELSE FALSE END AS is_active,
    CURRENT_TIMESTAMP AS last_updated_dts
FROM permission_source ps 