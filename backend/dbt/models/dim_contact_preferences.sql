{{ config(materialized='incremental', unique_key='id') }}

WITH contact_preferences AS (
    -- Customer contact preferences and consent information
    SELECT 
        cp.customer_id,
        cp.email_consent,
        cp.sms_consent,
        cp.call_consent,
        cp.mail_consent,
        cp.push_consent,
        cp.do_not_contact,
        cp.marketing_allowed,
        cp.preferred_contact_channel,
        cp.preferred_contact_time,
        cp.update_date,
        cp.load_timestamp
    FROM stg.stg_contact_preferences cp
),

contact_constraints AS (
    -- Additional constraints from regulations or business rules
    SELECT
        cc.customer_id,
        cc.contact_reason,
        cc.channel_type,
        cc.constraint_type,
        cc.constraint_value,
        cc.is_override,
        cc.override_reason,
        cc.override_expiry_date,
        cc.load_timestamp
    FROM stg.stg_contact_constraints cc
    WHERE cc.is_active = 1
)

SELECT
    cp.customer_id AS id,
    -- Reference to customer dimension
    dc.customer_hk,
    
    -- Contact consent flags
    cp.email_consent,
    cp.sms_consent,
    cp.call_consent,
    cp.mail_consent,
    cp.push_consent,
    cp.do_not_contact,
    cp.marketing_allowed,
    cp.preferred_contact_channel,
    cp.preferred_contact_time,
    
    -- Constraints array (for each active customer-channel-reason combination)
    ARRAY(
        SELECT 
            CONCAT(cc.channel_type, ':', cc.constraint_type, ':', cc.constraint_value)
        FROM contact_constraints cc
        WHERE cc.customer_id = cp.customer_id
    ) AS contact_constraints,
    
    -- Overrides array (for any constraints with approved overrides)
    ARRAY(
        SELECT 
            CONCAT(cc.channel_type, ':', cc.constraint_type, ':', cc.override_reason)
        FROM contact_constraints cc
        WHERE cc.customer_id = cp.customer_id
        AND cc.is_override = 1
        AND (cc.override_expiry_date IS NULL OR cc.override_expiry_date >= CURRENT_DATE)
    ) AS active_overrides,
    
    -- Derived contact status
    CASE
        WHEN cp.do_not_contact = TRUE THEN 'DO_NOT_CONTACT'
        WHEN cp.email_consent = FALSE AND cp.sms_consent = FALSE AND 
             cp.call_consent = FALSE AND cp.mail_consent = FALSE AND 
             cp.push_consent = FALSE THEN 'NO_CONSENT'
        WHEN cp.marketing_allowed = FALSE THEN 'SERVICE_ONLY'
        ELSE 'CONTACTABLE'
    END AS contact_status,
    
    -- Metadata
    cp.update_date,
    GREATEST(cp.load_timestamp, 
             COALESCE((SELECT MAX(cc.load_timestamp) FROM contact_constraints cc 
                      WHERE cc.customer_id = cp.customer_id), '1900-01-01')) 
    AS last_updated_dts
FROM contact_preferences cp
JOIN {{ ref('dim_customers') }} dc ON dc.id = cp.customer_id

{% if is_incremental() %}
WHERE GREATEST(cp.load_timestamp, 
               COALESCE((SELECT MAX(cc.load_timestamp) FROM contact_constraints cc 
                        WHERE cc.customer_id = cp.customer_id), '1900-01-01'))
      > (SELECT max(last_updated_dts) FROM {{ this }})
{% endif %} 