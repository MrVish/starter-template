{{ config(materialized='table') }}

WITH segment_source AS (
    -- This would typically come from a staging table
    -- For illustration purposes, using a static list of segments
    -- In a real implementation, replace with a proper source table
    SELECT *
    FROM (VALUES
        (1, 'HIGH_VALUE', 'High Value Customers', 'Customers with high lifetime value or potential', 'HIGH', 'Y'),
        (2, 'LOYAL', 'Loyal Customers', 'Customers with long tenure and consistent activity', 'MEDIUM', 'Y'),
        (3, 'NEW', 'New Customers', 'Recently acquired customers', 'MEDIUM', 'Y'),
        (4, 'DORMANT', 'Dormant Customers', 'Customers with declining activity', 'LOW', 'Y'),
        (5, 'CHURN_RISK', 'Churn Risk', 'Customers with high probability of churn', 'HIGH', 'Y'),
        (6, 'CROSS_SELL', 'Cross-Sell Opportunity', 'Good candidates for additional products', 'MEDIUM', 'Y'),
        (7, 'CREDIT_RISK', 'Credit Risk', 'Customers with potential repayment issues', 'HIGH', 'Y'),
        (8, 'UPSELL', 'Upsell Opportunity', 'Candidates for premium products', 'MEDIUM', 'Y'),
        (9, 'DIGITAL_FIRST', 'Digital First', 'Primarily use digital channels', 'LOW', 'Y'),
        (10, 'BRANCH_PREFERRED', 'Branch Preferred', 'Prefer in-person branch services', 'LOW', 'Y')
    ) AS t(id, segment_code, segment_name, description, priority, is_active)
)

SELECT
    ss.id,
    ss.segment_code,
    ss.segment_name,
    ss.description,
    ss.priority,
    CASE WHEN ss.is_active = 'Y' THEN TRUE ELSE FALSE END AS is_active,
    CURRENT_TIMESTAMP AS created_date,
    CURRENT_TIMESTAMP AS last_updated_dts
FROM segment_source ss 