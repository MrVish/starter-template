# Data Vault 2.0 Implementation

This directory contains the implementation of a Data Vault 2.0 schema for a banking data warehouse. Data Vault 2.0 is a modeling methodology designed to provide long-term historical storage of data coming in from multiple operational systems.

## Directory Contents

- `staging_schema.sql` - Complete DDL for the Data Vault 2.0 staging schema
- `migrate_to_datavault.sql` - Migration script to transition from legacy tables to Data Vault
- `datavault_loader.py` - Python utility for loading data into the Data Vault structure

## Data Vault 2.0 Architecture

The schema follows standard Data Vault 2.0 conventions:

### 1. Hubs
- Core business entities: customers, products, branches
- Contain only business keys and metadata (load timestamp, record source)
- Immutable and append-only

### 2. Links
- Represent relationships between business entities
- Many-to-many relationships across the business
- Also immutable and append-only

### 3. Satellites
- Store descriptive attributes that change over time
- Implement Slowly Changing Dimension Type 2 (SCD-2) tracking
- Group related attributes by rate of change and subject area

### 4. Event Satellites
- Store transaction/fact-like data
- Referenced via hub keys but not modeled as traditional facts yet

## Entity Relationship Diagram

```
hub_customer     ←── sat_customer_profile
       ↑                 ↑
       │                 ├── sat_customer_constraints
       │                 ├── sat_customer_features
       │                 ├── sat_customer_channel_activity
       │                 └── sat_customer_feedback
       │
lnk_customer_product
       │
hub_product  ←──── sat_product_creditcard
       │          sat_product_homeloan
       │
ev_transaction
```

## Migration Process

The migration from legacy tables to Data Vault 2.0 involves:

1. Creating the Data Vault schema (`staging_schema.sql`)
2. Populating hubs from legacy tables
3. Establishing relationships in link tables
4. Migrating descriptive data to satellites
5. Creating compatibility views to support existing applications

## Loading Data

Use `datavault_loader.py` to load data into the Data Vault schema:

```python
from datavault_loader import DataVaultLoader

# Initialize the loader with your database connection
loader = DataVaultLoader("postgresql://user:password@localhost:5432/mydatabase")

# Load data into hub, link, and satellite tables
loader.load_hub(...)
loader.load_link(...)
loader.load_satellite(...)
```

## Extending the Schema

- To add new customer attributes: create a new satellite table `sat_customer_<context>`
- To add new product lines (e.g., Gold Loan): add `sat_product_goldloan`
- To add new relationships: add a new link table (e.g., `lnk_customer_advisor`)

## Data Loading Process

1. Hash natural keys and load/update hubs first
2. Establish relationships by loading links
3. Compare incoming attributes to current satellites
   - If different, close the current record and insert a new one
   - If same, no action needed
4. Insert event data (transactions) with references to hub keys

## Conventions

- Hash keys: `CHAR(32)` - MD5 hashes of business keys with context
- Dates/timestamps: `TIMESTAMPTZ` (UTC)
- History: SCD-2 tracking with `effective_from_dts` and `effective_to_dts`
- Open records: `effective_to_dts = '9999-12-31'`
- Mandatory metadata: `load_dts` and `record_source`
- Nullable attributes: Only allowed in satellite tables 