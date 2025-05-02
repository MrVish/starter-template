# Data Vault to Star Schema Integration

This dbt project integrates the Data Vault 2.0 staging layer with the existing star schema data warehouse. It creates a set of dimension and fact tables that can be used for analytics and reporting.

## Overview

The integration follows these key patterns:

1. **Dimension tables** are populated from hubs and their corresponding satellites.
2. **Fact tables** are populated from event satellites and link tables.
3. Surrogate keys are generated using `dense_rank()` to ensure consistent key generation.
4. Historical data is properly tracked with SCD-2 patterns and effective dating.

## Models

### Dimension Tables

#### From Data Vault Integration
- **dim_products**: Products dimension containing credit cards, loans, and other financial products.
- **dim_branches**: Branch and channel dimension for physical branches and digital channels.

#### Core Dimensions
- **dim_customers**: Customer dimension with profile information.
- **dim_dates**: Date dimension for time intelligence.
- **dim_segments**: Customer segmentation information.
- **dim_channels**: Multi-channel distribution and communication channels.
- **dim_campaigns**: Marketing campaign information.
- **dim_users**: System user accounts and permissions.
- **dim_roles**: User roles for access control.
- **dim_permissions**: Granular permissions for system functionality.

#### Extended Dimensions
- **dim_customer_ai_features**: Machine learning features for customer analysis.
- **dim_contact_preferences**: Customer contact preferences and consent management.
- **dim_kpis**: Key performance indicators for analytics.
- **dim_data_sources**: Data source metadata for data lineage tracking.

### Fact Tables

#### From Data Vault Integration
- **fact_transactions_datavault**: Main fact table for all financial transactions from the Data Vault.
- **fact_spend_cc**: Credit card spending analytics fact table.
- **fact_repayments**: Loan repayment fact table for amortization and delinquency analysis.
- **fact_customer_channel_activity**: Customer channel engagement fact table.

#### Core Fact Tables
- **fact_transactions**: General transaction fact table.
- **fact_campaign_performance**: Marketing campaign performance metrics.
- **fact_channel_performance**: Channel performance and engagement.
- **fact_feedback**: Customer feedback and satisfaction metrics.

#### Extended Fact Tables
- **fact_segment_performance**: Performance metrics by customer segment.
- **fact_user_actions**: System user activity for audit and usage analytics.
- **fact_campaign_kpi_results**: Campaign KPI targets and achievements.
- **fact_data_ingestion_runs**: Data ingestion process metrics.

## Integration Points

These models work together to provide a comprehensive view of customer activity:

- **dim_customers** is enhanced with data from customer satellites.
- **fact_channel_performance** is augmented with customer activity data.
- **fact_transactions** is linked to the new product dimension.
- **dim_channels** is connected to the new branch dimension through channel categorization.

## Data Flow

```
Data Vault Source                Star Schema Destination
-------------------------        -----------------------
hub_customer           ------->  dim_customers
sat_customer_profile   ------->  dim_customers
sat_customer_features  ------->  dim_customer_ai_features
sat_customer_constraints -----> dim_contact_preferences
hub_product           ------->  dim_products
sat_product_creditcard ------->  dim_products
sat_product_homeloan  ------->  dim_products
hub_branch            ------->  dim_branches
ev_transaction        ------->  fact_transactions_datavault
ev_transaction (CC)   ------->  fact_spend_cc
ev_transaction (HL)   ------->  fact_repayments
sat_customer_channel_activity -> fact_customer_channel_activity
stg_transactions      ------->  fact_transactions
stg_customer_profile  ------->  dim_customers
stg_campaign_metrics  ------->  fact_campaign_performance
stg_feedback_scores   ------->  fact_feedback
```

## Refresh Schedule

- Dimension tables are loaded incrementally as vault data changes.
- Fact tables for transactions are loaded incrementally.
- Aggregated fact tables are rebuilt fully on a scheduled basis.

## Usage

To build all models:

```bash
dbt build
```

To build specific models:

```bash
dbt build --select dim_products fact_spend_cc
```

To build models related to marketing:

```bash
dbt build --select +dim_campaigns+
```

To build models related to customer data:

```bash
dbt build --select +dim_customers+
```

To build models related to analytics:

```bash
dbt build --select +fact_*
```

## Dependencies

The models have the following dependencies:

- **Dimension models**: Typically have minimal dependencies, primarily on staging tables or static reference data.
- **Fact models**: Depend on dimension models for proper relationships.
- **Service models**: Depend on both fact and dimension models for advanced analytics.

## Documentation

For detailed model documentation, run:

```bash
dbt docs generate
dbt docs serve
``` 