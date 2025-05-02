{{ config(materialized='table') }}

WITH txns AS (
    SELECT *
    FROM stg.ev_transaction tx
    JOIN stg.hub_product p ON tx.product_hk = p.product_hk
    WHERE p.product_type = 'CREDIT_CARD'
)

SELECT
    t.txn_hk AS spend_txn_key,
    dc.customer_key,
    dp.product_key,
    dd.date_key,
    -- If there's a merchant dimension, join to it
    -- dm.merchant_key,
    NULL AS merchant_key,
    t.txn_amount,
    t.txn_currency,
    -- For rewards calculation, this would come from a business rule or a separate fact
    ROUND(t.txn_amount * 0.01, 2) AS rewards_earned,
    -- Interest charged would come from a separate fact in a real implementation
    0.00 AS interest_charged,
    spc.credit_limit,
    CASE
        WHEN spc.credit_limit IS NOT NULL THEN spc.credit_limit - t.txn_amount
        ELSE NULL
    END AS available_credit,
    spc.reward_program,
    t.txn_dts AS txn_timestamp,
    t.load_dts
FROM txns t
-- Join to dimension tables using hash keys from the vault
JOIN {{ ref('dim_customers') }} dc ON dc.customer_hk = t.customer_hk
JOIN {{ ref('dim_products') }} dp ON dp.product_hk = t.product_hk
-- Join to date dimension using the transaction date
JOIN {{ ref('dim_dates') }} dd ON dd.full_date = DATE(t.txn_dts)
-- Join to product satellite for credit card-specific attributes
LEFT JOIN stg.sat_product_creditcard spc ON 
    spc.product_hk = t.product_hk
    AND spc.effective_from_dts <= t.txn_dts
    AND (spc.effective_to_dts > t.txn_dts OR spc.effective_to_dts = '9999-12-31'::TIMESTAMPTZ)
; 