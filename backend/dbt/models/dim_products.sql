{{ config(materialized='incremental', unique_key='product_hk') }}

WITH cc AS (
    SELECT product_hk, credit_limit, card_status, reward_program, apr_pct, load_dts
    FROM stg.sat_product_creditcard
    WHERE effective_to_dts = '9999-12-31'
),
hl AS (
    SELECT product_hk, principal_amt, interest_rate_pct, tenure_months, loan_status, property_type, load_dts
    FROM stg.sat_product_homeloan
    WHERE effective_to_dts = '9999-12-31'
)

SELECT
    dense_rank() OVER (ORDER BY p.product_hk) AS product_key,
    p.product_hk,
    p.product_bk AS account_number,
    p.product_type,
    cc.credit_limit,
    cc.card_status AS status,
    cc.reward_program,
    cc.apr_pct AS interest_rate_pct,
    hl.principal_amt,
    hl.interest_rate_pct AS loan_interest_rate_pct,
    hl.tenure_months,
    hl.property_type,
    CASE 
        WHEN cc.card_status IS NOT NULL THEN cc.card_status
        WHEN hl.loan_status IS NOT NULL THEN hl.loan_status
        ELSE 'UNKNOWN'
    END AS product_status,
    COALESCE(cc.load_dts, hl.load_dts, p.load_dts) AS last_updated_dts
FROM stg.hub_product p
LEFT JOIN cc ON cc.product_hk = p.product_hk
LEFT JOIN hl ON hl.product_hk = p.product_hk

{% if is_incremental() %}
  WHERE COALESCE(p.load_dts, cc.load_dts, hl.load_dts)
        > (SELECT max(last_updated_dts) FROM {{ this }})
{% endif %}
; 