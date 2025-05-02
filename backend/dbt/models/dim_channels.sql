{{ config(materialized='table') }}

WITH channel_source AS (
    -- This would typically come from a staging table
    -- For illustration purposes, using a static list of channels
    -- In a real implementation, replace with a proper source table
    SELECT *
    FROM (VALUES
        ('WEB', 'Web', 'DIGITAL', 'Online', 'Y'),
        ('MOB', 'Mobile App', 'DIGITAL', 'Online', 'Y'),
        ('BRN', 'Branch', 'PHYSICAL', 'Branch Network', 'Y'),
        ('ATM', 'ATM', 'PHYSICAL', 'ATM Network', 'Y'),
        ('POS', 'Point of Sale', 'PHYSICAL', 'Merchant', 'Y'),
        ('EML', 'Email', 'DIGITAL', 'Marketing', 'Y'),
        ('SMS', 'SMS', 'DIGITAL', 'Marketing', 'Y'),
        ('PHN', 'Phone', 'VOICE', 'Call Center', 'Y'),
        ('API', 'API', 'DIGITAL', 'Integration', 'Y')
    ) AS t(channel_code, channel_name, channel_type, channel_group, is_active)
)

SELECT
    ROW_NUMBER() OVER (ORDER BY cs.channel_code) AS id,
    cs.channel_code,
    cs.channel_name,
    cs.channel_type,
    cs.channel_group,
    CASE WHEN cs.is_active = 'Y' THEN TRUE ELSE FALSE END AS is_active,
    MD5(cs.channel_code) AS channel_hk,
    CURRENT_TIMESTAMP AS last_updated_dts
FROM channel_source cs 