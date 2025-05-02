"""Add Data Vault integration with Star Schema models

Revision ID: add_datavault_integration
Revises: 20093ad04d3a
Create Date: 2023-05-15 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'add_datavault_integration'
down_revision = '20093ad04d3a'
branch_labels = None
depends_on = None


def upgrade():
    # Create dim_products table
    op.create_table(
        'dim_products',
        sa.Column('product_key', sa.Integer(), nullable=False),
        sa.Column('product_hk', sa.CHAR(32), nullable=False),
        sa.Column('account_number', sa.String(50), nullable=True),
        sa.Column('product_type', sa.String(30), nullable=True),
        sa.Column('credit_limit', sa.Numeric(18, 2), nullable=True),
        sa.Column('principal_amt', sa.Numeric(18, 2), nullable=True),
        sa.Column('interest_rate_pct', sa.Numeric(5, 2), nullable=True),
        sa.Column('status', sa.String(20), nullable=True),
        sa.Column('reward_program', sa.String(50), nullable=True),
        sa.Column('tenure_months', sa.Integer(), nullable=True),
        sa.Column('property_type', sa.String(50), nullable=True),
        sa.Column('last_updated_dts', sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('product_key'),
        sa.UniqueConstraint('product_hk')
    )
    
    # Create dim_branches table
    op.create_table(
        'dim_branches',
        sa.Column('branch_key', sa.Integer(), nullable=False),
        sa.Column('branch_hk', sa.CHAR(32), nullable=False),
        sa.Column('branch_code', sa.String(20), nullable=False),
        sa.Column('branch_name', sa.String(100), nullable=True),
        sa.Column('region', sa.String(50), nullable=True),
        sa.Column('branch_type', sa.String(30), nullable=True),
        sa.Column('channel_category', sa.String(30), nullable=True),
        sa.Column('active_flag', sa.String(1), nullable=True, default="Y"),
        sa.Column('last_updated_dts', sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('branch_key'),
        sa.UniqueConstraint('branch_hk')
    )
    
    # Create fact_transactions table
    op.create_table(
        'fact_transactions',
        sa.Column('transaction_key', sa.Integer(), nullable=False),
        sa.Column('txn_hk', sa.CHAR(32), nullable=False),
        sa.Column('customer_key', sa.Integer(), nullable=False),
        sa.Column('product_key', sa.Integer(), nullable=False),
        sa.Column('date_key', sa.Integer(), nullable=False),
        sa.Column('branch_key', sa.Integer(), nullable=True),
        sa.Column('txn_type', sa.String(30), nullable=True),
        sa.Column('txn_amount', sa.Numeric(18, 2), nullable=True),
        sa.Column('txn_currency', sa.String(3), nullable=True),
        sa.Column('merchant_category', sa.String(50), nullable=True),
        sa.Column('txn_timestamp', sa.DateTime(timezone=True), nullable=True),
        sa.Column('load_dts', sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('transaction_key'),
        sa.UniqueConstraint('txn_hk'),
        sa.ForeignKeyConstraint(['customer_key'], ['dim_customers.customer_key']),
        sa.ForeignKeyConstraint(['product_key'], ['dim_products.product_key']),
        sa.ForeignKeyConstraint(['date_key'], ['dim_dates.date_key']),
        sa.ForeignKeyConstraint(['branch_key'], ['dim_branches.branch_key'])
    )
    
    # Create fact_spend_cc table
    op.create_table(
        'fact_spend_cc',
        sa.Column('spend_txn_key', sa.Integer(), nullable=False),
        sa.Column('txn_hk', sa.CHAR(32), nullable=False),
        sa.Column('customer_key', sa.Integer(), nullable=False),
        sa.Column('product_key', sa.Integer(), nullable=False),
        sa.Column('date_key', sa.Integer(), nullable=False),
        sa.Column('merchant_key', sa.Integer(), nullable=True),
        sa.Column('txn_amount', sa.Numeric(18, 2), nullable=True),
        sa.Column('txn_currency', sa.String(3), nullable=True),
        sa.Column('rewards_earned', sa.Numeric(18, 2), nullable=True),
        sa.Column('interest_charged', sa.Numeric(18, 2), nullable=True),
        sa.Column('credit_limit', sa.Numeric(18, 2), nullable=True),
        sa.Column('available_credit', sa.Numeric(18, 2), nullable=True),
        sa.Column('reward_program', sa.String(50), nullable=True),
        sa.Column('txn_timestamp', sa.DateTime(timezone=True), nullable=True),
        sa.Column('load_dts', sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('spend_txn_key'),
        sa.UniqueConstraint('txn_hk'),
        sa.ForeignKeyConstraint(['customer_key'], ['dim_customers.customer_key']),
        sa.ForeignKeyConstraint(['product_key'], ['dim_products.product_key']),
        sa.ForeignKeyConstraint(['date_key'], ['dim_dates.date_key']),
        sa.ForeignKeyConstraint(['merchant_key'], ['dim_merchants.merchant_key'])
    )
    
    # Create fact_repayments table
    op.create_table(
        'fact_repayments',
        sa.Column('repayment_key', sa.Integer(), nullable=False),
        sa.Column('repayment_id', sa.CHAR(32), nullable=False),
        sa.Column('customer_key', sa.Integer(), nullable=False),
        sa.Column('product_key', sa.Integer(), nullable=False),
        sa.Column('date_key', sa.Integer(), nullable=False),
        sa.Column('repayment_amount', sa.Numeric(18, 2), nullable=True),
        sa.Column('principal_component', sa.Numeric(18, 2), nullable=True),
        sa.Column('interest_component', sa.Numeric(18, 2), nullable=True),
        sa.Column('fee_component', sa.Numeric(18, 2), nullable=True),
        sa.Column('remaining_principal', sa.Numeric(18, 2), nullable=True),
        sa.Column('payment_method', sa.String(30), nullable=True),
        sa.Column('payment_status', sa.String(20), nullable=True),
        sa.Column('days_past_due', sa.Integer(), nullable=True),
        sa.Column('repayment_timestamp', sa.DateTime(timezone=True), nullable=True),
        sa.Column('due_date', sa.DateTime(timezone=True), nullable=True),
        sa.Column('load_dts', sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('repayment_key'),
        sa.UniqueConstraint('repayment_id'),
        sa.ForeignKeyConstraint(['customer_key'], ['dim_customers.customer_key']),
        sa.ForeignKeyConstraint(['product_key'], ['dim_products.product_key']),
        sa.ForeignKeyConstraint(['date_key'], ['dim_dates.date_key'])
    )
    
    # Create fact_customer_channel_activity table
    op.create_table(
        'fact_customer_channel_activity',
        sa.Column('activity_key', sa.Integer(), nullable=False),
        sa.Column('customer_key', sa.Integer(), nullable=False),
        sa.Column('date_key', sa.Integer(), nullable=False),
        sa.Column('channel_key', sa.Integer(), nullable=False),
        sa.Column('opens', sa.Integer(), nullable=True, default=0),
        sa.Column('clicks', sa.Integer(), nullable=True, default=0),
        sa.Column('logins', sa.Integer(), nullable=True, default=0),
        sa.Column('session_count', sa.Integer(), nullable=True, default=0),
        sa.Column('session_duration_seconds', sa.Integer(), nullable=True),
        sa.Column('conversion_count', sa.Integer(), nullable=True, default=0),
        sa.Column('bounce_count', sa.Integer(), nullable=True, default=0),
        sa.Column('activity_date', sa.DateTime(timezone=True), nullable=True),
        sa.Column('load_dts', sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('activity_key'),
        sa.ForeignKeyConstraint(['customer_key'], ['dim_customers.customer_key']),
        sa.ForeignKeyConstraint(['date_key'], ['dim_dates.date_key']),
        sa.ForeignKeyConstraint(['channel_key'], ['dim_channels.channel_key'])
    )
    
    # Create indexes
    op.create_index('ix_dim_products_product_type', 'dim_products', ['product_type'])
    op.create_index('ix_dim_branches_region', 'dim_branches', ['region'])
    op.create_index('ix_fact_transactions_txn_timestamp', 'fact_transactions', ['txn_timestamp'])
    op.create_index('ix_fact_spend_cc_txn_timestamp', 'fact_spend_cc', ['txn_timestamp'])
    op.create_index('ix_fact_repayments_due_date', 'fact_repayments', ['due_date'])
    op.create_index('ix_fact_customer_channel_activity_activity_date', 'fact_customer_channel_activity', ['activity_date'])


def downgrade():
    # Drop tables in reverse order to avoid foreign key constraint issues
    op.drop_table('fact_customer_channel_activity')
    op.drop_table('fact_repayments')
    op.drop_table('fact_spend_cc')
    op.drop_table('fact_transactions')
    op.drop_table('dim_branches')
    op.drop_table('dim_products') 