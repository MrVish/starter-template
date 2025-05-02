{{ config(materialized='incremental', unique_key='id') }}

WITH customer_profile AS (
    SELECT 
        cp.customer_id,
        cp.full_name,
        cp.email,
        cp.dob,
        cp.gender,
        cp.income_bracket,
        cp.location,
        cp.joined_date,
        cp.load_timestamp
    FROM stg.stg_customer_profile cp
),

product_ownership AS (
    SELECT
        po.customer_id,
        COUNT(DISTINCT po.product_id) AS active_product_count,
        MAX(po.load_timestamp) AS load_timestamp
    FROM stg.stg_product_ownership po
    WHERE po.is_active = 1
    GROUP BY po.customer_id
),

customer_features AS (
    SELECT
        cf.customer_id,
        cf.risk_profile,
        cf.segment_id,
        cf.load_timestamp
    FROM stg.stg_customer_features cf
)

SELECT
    cp.customer_id AS id,
    cp.full_name,
    cp.email,
    cp.dob,
    cp.gender,
    cp.income_bracket,
    cf.risk_profile,
    cp.location,
    cp.joined_date,
    COALESCE(po.active_product_count, 0) AS active_product_count,
    cf.segment_id AS latest_segment_id,
    'Y' AS active_flag,
    COALESCE(cp.customer_id, MD5(cp.email)) AS customer_hk,
    GREATEST(cp.load_timestamp, COALESCE(po.load_timestamp, '1900-01-01'), COALESCE(cf.load_timestamp, '1900-01-01')) AS last_updated_dts
FROM customer_profile cp
LEFT JOIN product_ownership po ON po.customer_id = cp.customer_id
LEFT JOIN customer_features cf ON cf.customer_id = cp.customer_id

{% if is_incremental() %}
  WHERE GREATEST(cp.load_timestamp, COALESCE(po.load_timestamp, '1900-01-01'), COALESCE(cf.load_timestamp, '1900-01-01'))
        > (SELECT max(last_updated_dts) FROM {{ this }})
{% endif %} 