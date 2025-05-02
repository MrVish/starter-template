{{ config(materialized='incremental', unique_key='branch_hk') }}

SELECT
    dense_rank() OVER (ORDER BY b.branch_hk) AS branch_key,
    b.branch_hk,
    b.branch_bk AS branch_code,
    -- In a real implementation, you would join to a satellite table
    -- with branch attributes like name, region, etc.
    -- For now, use branch_code as branch_name as a placeholder
    b.branch_bk AS branch_name,
    'UNKNOWN' AS region,
    CASE
        WHEN b.branch_bk LIKE 'B%' THEN 'PHYSICAL'
        WHEN b.branch_bk LIKE 'W%' THEN 'DIGITAL'
        ELSE 'OTHER'
    END AS branch_type,
    CASE
        WHEN b.branch_bk LIKE 'B%' THEN 'BRANCH'
        WHEN b.branch_bk LIKE 'W%' THEN 'WEB'
        WHEN b.branch_bk LIKE 'A%' THEN 'APP'
        WHEN b.branch_bk LIKE 'C%' THEN 'CALL_CENTER'
        ELSE 'OTHER'
    END AS channel_category,
    'Y' AS active_flag,
    b.load_dts AS last_updated_dts
FROM stg.hub_branch b

{% if is_incremental() %}
  WHERE b.load_dts > (SELECT max(last_updated_dts) FROM {{ this }})
{% endif %}
; 