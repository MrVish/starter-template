{{ config(materialized='table') }}

-- This model assumes there's a source of repayment data
-- In a real implementation, this would come from a core banking system
-- For illustration, we'll simulate it by deriving from transactions
WITH loan_txns AS (
    SELECT 
        tx.*,
        sphl.principal_amt,
        sphl.interest_rate_pct,
        sphl.tenure_months,
        sphl.loan_status
    FROM stg.ev_transaction tx
    JOIN stg.hub_product p ON tx.product_hk = p.product_hk
    LEFT JOIN stg.sat_product_homeloan sphl ON 
        sphl.product_hk = tx.product_hk
        AND sphl.effective_from_dts <= tx.txn_dts
        AND (sphl.effective_to_dts > tx.txn_dts OR sphl.effective_to_dts = '9999-12-31'::TIMESTAMPTZ)
    WHERE 
        p.product_type = 'HOME_LOAN'
        AND tx.txn_type = 'REPAYMENT'
)

SELECT
    -- Generate a unique ID for each repayment
    md5(lt.txn_hk || 'REPAYMENT') AS repayment_id,
    -- Use surrogate keys from dimensions
    dc.customer_key,
    dp.product_key,
    dd.date_key,
    -- Repayment details
    lt.txn_amount AS repayment_amount,
    -- In a real implementation, these amounts would come from the core banking system
    -- For illustration, we'll use a simple calculation based on interest rate
    ROUND(lt.txn_amount * 0.7, 2) AS principal_component,
    ROUND(lt.txn_amount * 0.3, 2) AS interest_component,
    ROUND(lt.txn_amount * 0.0, 2) AS fee_component,
    -- Simulate remaining principal by subtracting principal component from loan amount
    CASE
        WHEN lt.principal_amt IS NOT NULL 
            THEN lt.principal_amt - (ROUND(lt.txn_amount * 0.7, 2))
        ELSE NULL
    END AS remaining_principal,
    'BANK_TRANSFER' AS payment_method,
    CASE 
        WHEN lt.txn_dts <= CURRENT_DATE THEN 'PAID'
        ELSE 'PENDING'
    END AS payment_status,
    -- Simulate days past due
    CASE
        WHEN lt.txn_dts < CURRENT_DATE - INTERVAL '30 days' THEN 30
        WHEN lt.txn_dts < CURRENT_DATE - INTERVAL '15 days' THEN 15
        WHEN lt.txn_dts < CURRENT_DATE THEN 0
        ELSE NULL
    END AS days_past_due,
    lt.txn_dts AS repayment_timestamp,
    -- Set a due date 15 days after transaction date for illustration
    lt.txn_dts + INTERVAL '15 days' AS due_date,
    lt.load_dts
FROM loan_txns lt
-- Join to dimension tables using hash keys from the vault
JOIN {{ ref('dim_customers') }} dc ON dc.customer_hk = lt.customer_hk
JOIN {{ ref('dim_products') }} dp ON dp.product_hk = lt.product_hk
-- Join to date dimension using the transaction date
JOIN {{ ref('dim_dates') }} dd ON dd.full_date = DATE(lt.txn_dts); 