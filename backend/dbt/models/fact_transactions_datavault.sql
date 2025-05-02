{{ config(materialized='incremental', unique_key='txn_hk') }}

SELECT
    t.txn_hk,
    -- Use surrogate keys from dimensions
    dc.customer_key,
    dp.product_key,
    dd.date_key,
    db.branch_key,
    -- Transaction details
    t.txn_type,
    t.txn_amount,
    t.txn_currency,
    t.merchant_cat_cd AS merchant_category,
    t.txn_dts AS txn_timestamp,
    t.load_dts
FROM stg.ev_transaction t
-- Join to dimension tables using hash keys from the vault
JOIN {{ ref('dim_customers') }} dc ON dc.customer_hk = t.customer_hk
JOIN {{ ref('dim_products') }} dp ON dp.product_hk = t.product_hk
-- Join to date dimension using the transaction date
JOIN {{ ref('dim_dates') }} dd ON dd.full_date = DATE(t.txn_dts)
-- Optional join to branch dimension if the transaction has branch context
LEFT JOIN {{ ref('dim_branches') }} db ON db.branch_hk = t.branch_hk

{% if is_incremental() %}
  WHERE t.load_dts > (SELECT max(load_dts) FROM {{ this }})
{% endif %}; 