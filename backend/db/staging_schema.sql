-- Data Vault 2.0 Staging Schema
-- This schema folds seven legacy tables into a Data-Vault 2.0 backbone

-- Create staging schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS stg;

-- ========== HUBS ==========
CREATE TABLE stg.hub_customer (
    customer_hk   CHAR(32)    PRIMARY KEY,
    customer_bk   TEXT        NOT NULL,     -- natural key (e.g. CRM ID)
    load_dts      TIMESTAMPTZ NOT NULL,
    record_source TEXT        NOT NULL
);

CREATE INDEX idx_hub_customer_bk ON stg.hub_customer (customer_bk);

CREATE TABLE stg.hub_product (
    product_hk    CHAR(32)    PRIMARY KEY,
    product_bk    TEXT        NOT NULL,     -- acct #, card #, loan ID …
    product_type  TEXT        NOT NULL,     -- CREDIT_CARD | HOME_LOAN …
    load_dts      TIMESTAMPTZ NOT NULL,
    record_source TEXT        NOT NULL
);

CREATE INDEX idx_hub_product_bk ON stg.hub_product (product_bk);

CREATE TABLE stg.hub_branch (
    branch_hk     CHAR(32)    PRIMARY KEY,
    branch_bk     TEXT        NOT NULL,     -- branch / channel code
    load_dts      TIMESTAMPTZ NOT NULL,
    record_source TEXT        NOT NULL
);

-- ========== LINKS ==========
CREATE TABLE stg.lnk_customer_product (
    customer_hk   CHAR(32)    NOT NULL REFERENCES stg.hub_customer(customer_hk),
    product_hk    CHAR(32)    NOT NULL REFERENCES stg.hub_product(product_hk),
    link_load_dts TIMESTAMPTZ NOT NULL,
    record_source TEXT        NOT NULL,
    PRIMARY KEY (customer_hk, product_hk)
);

CREATE TABLE stg.lnk_customer_branch (
    customer_hk   CHAR(32)    NOT NULL REFERENCES stg.hub_customer(customer_hk),
    branch_hk     CHAR(32)    NOT NULL REFERENCES stg.hub_branch(branch_hk),
    first_seen_dts TIMESTAMPTZ NOT NULL,
    record_source TEXT        NOT NULL,
    PRIMARY KEY (customer_hk, branch_hk)
);

-- ========== SATELLITES ==========
-- Profile (formerly stg_customer_profile)
CREATE TABLE stg.sat_customer_profile (
    customer_hk        CHAR(32) NOT NULL REFERENCES stg.hub_customer(customer_hk),
    effective_from_dts TIMESTAMPTZ NOT NULL,
    effective_to_dts   TIMESTAMPTZ NOT NULL DEFAULT '9999-12-31',
    gender             TEXT,
    dob                DATE,
    income_band        TEXT,
    marital_status     TEXT,
    load_dts           TIMESTAMPTZ NOT NULL,
    record_source      TEXT NOT NULL,
    PRIMARY KEY (customer_hk, effective_from_dts)
);

-- Constraints (formerly stg_customer_constraints)
CREATE TABLE stg.sat_customer_constraints (
    customer_hk        CHAR(32) NOT NULL REFERENCES stg.hub_customer(customer_hk),
    effective_from_dts TIMESTAMPTZ NOT NULL,
    effective_to_dts   TIMESTAMPTZ NOT NULL DEFAULT '9999-12-31',
    aml_flag           BOOLEAN,
    credit_score       INT,
    consent_marketing  BOOLEAN,
    load_dts           TIMESTAMPTZ NOT NULL,
    record_source      TEXT NOT NULL,
    PRIMARY KEY (customer_hk, effective_from_dts)
);

-- Channel activity (formerly stg_customer_channel_activity)
CREATE TABLE stg.sat_customer_channel_activity (
    customer_hk        CHAR(32) NOT NULL REFERENCES stg.hub_customer(customer_hk),
    activity_dts       TIMESTAMPTZ NOT NULL,         -- granularity = event or daily
    channel            TEXT,                         -- EMAIL | APP | WEB …
    opens              INT,
    clicks             INT,
    logins             INT,
    load_dts           TIMESTAMPTZ NOT NULL,
    record_source      TEXT NOT NULL,
    PRIMARY KEY (customer_hk, activity_dts, channel)
);

-- Feedback / NPS (formerly stg_feedback_score)
CREATE TABLE stg.sat_customer_feedback (
    customer_hk        CHAR(32) NOT NULL REFERENCES stg.hub_customer(customer_hk),
    interaction_dts    TIMESTAMPTZ NOT NULL,
    channel            TEXT,
    nps_score          SMALLINT,
    csat_score         SMALLINT,
    comment_txt        TEXT,
    load_dts           TIMESTAMPTZ NOT NULL,
    record_source      TEXT NOT NULL,
    PRIMARY KEY (customer_hk, interaction_dts)
);

-- ML features (formerly stg_customer_features)
CREATE TABLE stg.sat_customer_features (
    customer_hk        CHAR(32) NOT NULL REFERENCES stg.hub_customer(customer_hk),
    feature_snapshot_dts TIMESTAMPTZ NOT NULL,
    feature_vector     JSONB,          -- flexible bag of engineered features
    model_version      TEXT,
    load_dts           TIMESTAMPTZ NOT NULL,
    record_source      TEXT NOT NULL,
    PRIMARY KEY (customer_hk, feature_snapshot_dts)
);

-- Credit-card attributes
CREATE TABLE stg.sat_product_creditcard (
    product_hk        CHAR(32) NOT NULL REFERENCES stg.hub_product(product_hk),
    effective_from_dts TIMESTAMPTZ NOT NULL,
    effective_to_dts   TIMESTAMPTZ NOT NULL DEFAULT '9999-12-31',
    credit_limit      NUMERIC(18,2),
    card_status       TEXT,
    reward_program    TEXT,
    apr_pct           NUMERIC(5,2),
    load_dts          TIMESTAMPTZ NOT NULL,
    record_source     TEXT NOT NULL,
    PRIMARY KEY (product_hk, effective_from_dts)
);

-- Home-loan attributes
CREATE TABLE stg.sat_product_homeloan (
    product_hk        CHAR(32) NOT NULL REFERENCES stg.hub_product(product_hk),
    effective_from_dts TIMESTAMPTZ NOT NULL,
    effective_to_dts   TIMESTAMPTZ NOT NULL DEFAULT '9999-12-31',
    principal_amt     NUMERIC(18,2),
    interest_rate_pct NUMERIC(5,2),
    tenure_months     INT,
    loan_status       TEXT,
    property_type     TEXT,
    load_dts          TIMESTAMPTZ NOT NULL,
    record_source     TEXT NOT NULL,
    PRIMARY KEY (product_hk, effective_from_dts)
);

-- Transactions (formerly stg_transactions)
CREATE TABLE stg.ev_transaction (
    txn_hk           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    customer_hk      CHAR(32) NOT NULL REFERENCES stg.hub_customer(customer_hk),
    product_hk       CHAR(32) NOT NULL REFERENCES stg.hub_product(product_hk),
    txn_type         TEXT,
    txn_amount       NUMERIC(18,2),
    txn_currency     CHAR(3),
    txn_dts          TIMESTAMPTZ NOT NULL,
    merchant_cat_cd  TEXT,
    load_dts         TIMESTAMPTZ NOT NULL,
    record_source    TEXT NOT NULL
);

CREATE INDEX idx_ev_transaction_time ON stg.ev_transaction (txn_dts);

-- Audit & control tables
CREATE TABLE stg.batch_metadata (
    batch_id         UUID        PRIMARY KEY,
    source_system    TEXT,
    file_path        TEXT,
    row_cnt_raw      BIGINT,
    row_cnt_stage    BIGINT,
    load_started_dts TIMESTAMPTZ,
    load_ended_dts   TIMESTAMPTZ,
    status           TEXT,       -- SUCCESS | WARN | FAIL
    error_message    TEXT
);

CREATE TABLE stg.schema_versions (
    object_name      TEXT PRIMARY KEY,
    ddl_hash         CHAR(32),
    applied_dts      TIMESTAMPTZ
);

-- Migration helper function to generate MD5 hash keys
CREATE OR REPLACE FUNCTION stg.generate_hash_key(text) 
RETURNS char(32) AS $$
  SELECT md5($1)
$$ LANGUAGE SQL IMMUTABLE;

COMMENT ON SCHEMA stg IS 'Data Vault 2.0 staging schema for banking data';
COMMENT ON TABLE stg.hub_customer IS 'Customer hub - stores unique customer identifiers';
COMMENT ON TABLE stg.hub_product IS 'Product hub - stores unique product identifiers for all product types';
COMMENT ON TABLE stg.hub_branch IS 'Branch hub - stores unique branch/channel identifiers';
COMMENT ON TABLE stg.lnk_customer_product IS 'Link between customers and products';
COMMENT ON TABLE stg.lnk_customer_branch IS 'Link between customers and branches';
COMMENT ON TABLE stg.sat_customer_profile IS 'Customer profile information (SCD-2)';
COMMENT ON TABLE stg.sat_customer_constraints IS 'Customer constraints and compliance data (SCD-2)';
COMMENT ON TABLE stg.sat_customer_channel_activity IS 'Customer activity across channels';
COMMENT ON TABLE stg.sat_customer_feedback IS 'Customer feedback and NPS scores';
COMMENT ON TABLE stg.sat_customer_features IS 'ML feature vectors for customer analytics';
COMMENT ON TABLE stg.sat_product_creditcard IS 'Credit card product attributes (SCD-2)';
COMMENT ON TABLE stg.sat_product_homeloan IS 'Home loan product attributes (SCD-2)';
COMMENT ON TABLE stg.ev_transaction IS 'Transaction events/facts';
COMMENT ON TABLE stg.batch_metadata IS 'ETL batch processing metadata';
COMMENT ON TABLE stg.schema_versions IS 'Schema version tracking for migrations'; 