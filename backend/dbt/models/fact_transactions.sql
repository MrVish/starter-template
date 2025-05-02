{{ config(materialized='incremental', unique_key='id') }}

WITH transaction_source AS (
    SELECT 
        t.transaction_id,
        t.customer_id,
        t.transaction_date,
        t.amount,
        t.currency,
        t.transaction_type,
        t.status,
        t.channel_id,
        t.product_id,
        t.load_timestamp
    FROM stg.stg_transactions t
)

SELECT
    t.transaction_id AS id,
    dc.id AS customer_key,
    dd.id AS date_key,
    dch.id AS channel_key,
    COALESCE(dp.product_key, -1) AS product_key,
    t.amount,
    t.currency,
    t.transaction_type,
    t.status,
    t.transaction_date AS transaction_timestamp,
    CURRENT_TIMESTAMP AS load_dts
FROM transaction_source t
-- Join to dimension tables 
JOIN {{ ref('dim_customers') }} dc ON dc.id = t.customer_id
JOIN {{ ref('dim_dates') }} dd ON dd.full_date = DATE(t.transaction_date)
LEFT JOIN {{ ref('dim_channels') }} dch ON dch.id = t.channel_id
LEFT JOIN {{ ref('dim_products') }} dp ON dp.account_number = CAST(t.product_id AS VARCHAR)

{% if is_incremental() %}
  WHERE t.load_timestamp > (SELECT max(load_dts) FROM {{ this }})
{% endif %} 