#!/usr/bin/env python
"""
Data Vault 2.0 Loader Utility

This script provides helper functions to load data into a Data Vault 2.0 model.
It implements the standard pattern for loading data from source systems:
1. Generate hash keys
2. Load hubs first (upsert)
3. Load links
4. Compare and load satellites (SCD-2)

Usage:
    from datavault_loader import DataVaultLoader
    
    loader = DataVaultLoader(connection_string)
    
    # Load a hub
    loader.load_hub(
        source_df=customer_df,
        hub_table="stg.hub_customer",
        business_key="customer_id",
        business_key_alias="customer_bk",
        source_name="CRM_SYSTEM"
    )
    
    # Load a satellite with SCD-2 tracking
    loader.load_satellite(
        source_df=profile_df,
        satellite_table="stg.sat_customer_profile",
        hub_key_name="customer_hk",
        hub_key_value_expr="MD5(customer_id || 'CUSTOMER_PROFILE')",
        columns_to_track=["gender", "dob", "income_band", "marital_status"],
        source_name="CRM_SYSTEM"
    )
"""

import hashlib
import uuid
import pandas as pd
import sqlalchemy as sa
import logging
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional, Union

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('datavault_loader')

class DataVaultLoader:
    """Helper class to load data into Data Vault 2.0 structures"""
    
    def __init__(self, connection_string: str):
        """Initialize with database connection string"""
        self.engine = sa.create_engine(connection_string)
        self.metadata = sa.MetaData()
        self.batch_id = str(uuid.uuid4())
        logger.info(f"DataVaultLoader initialized with batch ID: {self.batch_id}")
    
    def _generate_hash_key(self, text: str) -> str:
        """Generate an MD5 hash key from input text"""
        return hashlib.md5(text.encode('utf-8')).hexdigest()
    
    def _get_current_timestamp(self) -> datetime:
        """Get current timestamp in UTC"""
        return datetime.now(timezone.utc)
    
    def load_hub(
        self, 
        source_df: pd.DataFrame, 
        hub_table: str,
        business_key: str,
        business_key_alias: str = None,
        additional_columns: Dict[str, str] = None,
        source_name: str = "DATA_PIPELINE"
    ) -> int:
        """
        Load data into a hub table using upsert pattern
        
        Args:
            source_df: Source dataframe
            hub_table: Target hub table name (schema.table)
            business_key: Column name in source containing business key
            business_key_alias: Column name in target for business key (if different)
            additional_columns: Dict of additional columns to include {target_col: source_col}
            source_name: Source system name for record_source
        
        Returns:
            Number of rows inserted
        """
        if business_key_alias is None:
            business_key_alias = business_key
            
        if additional_columns is None:
            additional_columns = {}
            
        logger.info(f"Loading hub: {hub_table} from {len(source_df)} source records")
        
        # Create hash keys 
        source_df['hash_key'] = source_df[business_key].astype(str).apply(
            lambda x: self._generate_hash_key(f"{x}{source_name}")
        )
        
        # Prepare hub dataframe
        hub_df = pd.DataFrame()
        hub_df['hash_key'] = source_df['hash_key']
        hub_df[business_key_alias] = source_df[business_key]
        
        # Add additional columns
        for target_col, source_col in additional_columns.items():
            hub_df[target_col] = source_df[source_col]
            
        # Add metadata columns
        current_time = self._get_current_timestamp()
        hub_df['load_dts'] = current_time
        hub_df['record_source'] = source_name
        
        # Insert into hub table (upsert)
        with self.engine.begin() as conn:
            # Get existing keys to avoid duplicates
            schema, table = hub_table.split('.')
            hub_table_obj = sa.Table(
                table, 
                self.metadata, 
                schema=schema, 
                autoload_with=self.engine
            )
            
            # Find primary key column
            pk_column = [c.name for c in hub_table_obj.primary_key.columns][0]
            
            # Get existing keys
            query = sa.select([hub_table_obj.c[pk_column]])
            existing_keys = pd.read_sql(query, conn)[pk_column].tolist()
            
            # Filter out existing keys
            new_hub_df = hub_df[~hub_df['hash_key'].isin(existing_keys)]
            
            # Insert new records
            if not new_hub_df.empty:
                # Rename hash_key column to match PK
                new_hub_df = new_hub_df.rename(columns={'hash_key': pk_column})
                
                # Insert
                new_hub_df.to_sql(
                    name=table,
                    schema=schema,
                    con=conn,
                    if_exists='append',
                    index=False
                )
                
                logger.info(f"Inserted {len(new_hub_df)} new records into {hub_table}")
                return len(new_hub_df)
            else:
                logger.info(f"No new records to insert into {hub_table}")
                return 0
    
    def load_link(
        self,
        source_df: pd.DataFrame,
        link_table: str,
        link_keys: Dict[str, str],
        source_name: str = "DATA_PIPELINE"
    ) -> int:
        """
        Load data into a link table
        
        Args:
            source_df: Source dataframe
            link_table: Target link table name (schema.table)
            link_keys: Dict mapping {target_hub_key_column: source_column}
            source_name: Source system name for record_source
            
        Returns:
            Number of rows inserted
        """
        logger.info(f"Loading link: {link_table} from {len(source_df)} source records")
        
        # Prepare link dataframe
        link_df = pd.DataFrame()
        
        # Generate hash keys for each hub relationship
        for target_col, source_col in link_keys.items():
            hub_name = target_col.replace('_hk', '')
            source_df[f'src_{target_col}'] = source_df[source_col].astype(str).apply(
                lambda x: self._generate_hash_key(f"{x}{hub_name.upper()}")
            )
            link_df[target_col] = source_df[f'src_{target_col}']
            
        # Add metadata columns
        current_time = self._get_current_timestamp()
        link_df['link_load_dts'] = current_time  # Use 'link_load_dts' as the standard field name
        link_df['record_source'] = source_name
        
        # Insert into link table (ignore duplicates)
        with self.engine.begin() as conn:
            # Get schema info
            schema, table = link_table.split('.')
            link_table_obj = sa.Table(
                table, 
                self.metadata, 
                schema=schema, 
                autoload_with=self.engine
            )
            
            # Find composite PK columns
            pk_columns = [c.name for c in link_table_obj.primary_key.columns]
            
            # Build query to get existing combinations
            query = sa.select([link_table_obj.c[col] for col in pk_columns])
            existing_df = pd.read_sql(query, conn)
            
            # Merge to find existing records (this handles composite keys)
            merged_df = pd.merge(
                link_df, 
                existing_df,
                on=pk_columns,
                how='left', 
                indicator=True
            )
            
            # Filter to new records only
            new_link_df = merged_df[merged_df['_merge'] == 'left_only'].drop('_merge', axis=1)
            
            # Insert new records
            if not new_link_df.empty:
                new_link_df.to_sql(
                    name=table,
                    schema=schema,
                    con=conn,
                    if_exists='append',
                    index=False
                )
                
                logger.info(f"Inserted {len(new_link_df)} new records into {link_table}")
                return len(new_link_df)
            else:
                logger.info(f"No new records to insert into {link_table}")
                return 0
    
    def load_satellite(
        self,
        source_df: pd.DataFrame,
        satellite_table: str,
        hub_key_name: str,
        hub_key_value_expr: str,
        columns_to_track: List[str],
        effective_from_col: str = None,
        source_name: str = "DATA_PIPELINE"
    ) -> int:
        """
        Load data into a satellite table with SCD-2 tracking
        
        Args:
            source_df: Source dataframe 
            satellite_table: Target satellite table name (schema.table)
            hub_key_name: Column name in target for hub hash key
            hub_key_value_expr: Expression to generate hub hash key from source
            columns_to_track: List of business columns to track changes
            effective_from_col: Column name in source for effective timestamp (or None for current time)
            source_name: Source system name for record_source
            
        Returns:
            Number of rows inserted
        """
        logger.info(f"Loading satellite: {satellite_table} from {len(source_df)} source records")
        
        # Prepare satellite dataframe
        sat_df = pd.DataFrame()
        
        # Generate hash keys based on expression
        if "MD5(" in hub_key_value_expr:
            # Extract the column and suffix from MD5(column || 'SUFFIX')
            # This is a simple parser - you might need more sophistication for complex expressions
            parts = hub_key_value_expr.split("'")
            if len(parts) >= 2:
                col_parts = parts[0].split("(")[1].split(" || ")[0].strip()
                suffix = parts[1]
                source_df['hub_key'] = source_df[col_parts].astype(str).apply(
                    lambda x: self._generate_hash_key(f"{x}{suffix}")
                )
        else:
            # Direct column reference
            source_df['hub_key'] = source_df[hub_key_value_expr]
            
        sat_df[hub_key_name] = source_df['hub_key']
        
        # Set effective timestamps
        current_time = self._get_current_timestamp()
        
        if effective_from_col and effective_from_col in source_df.columns:
            sat_df['effective_from_dts'] = source_df[effective_from_col]
        else:
            sat_df['effective_from_dts'] = current_time
            
        sat_df['effective_to_dts'] = pd.Timestamp('9999-12-31 23:59:59').tz_localize('UTC')
        
        # Copy tracked business columns
        for col in columns_to_track:
            if col in source_df.columns:
                sat_df[col] = source_df[col]
            else:
                logger.warning(f"Column {col} not found in source data")
                sat_df[col] = None
        
        # Add metadata columns
        sat_df['load_dts'] = current_time
        sat_df['record_source'] = source_name
        
        # Insert with SCD-2 tracking
        with self.engine.begin() as conn:
            # Get schema info
            schema, table = satellite_table.split('.')
            sat_table_obj = sa.Table(
                table, 
                self.metadata, 
                schema=schema, 
                autoload_with=self.engine
            )
            
            # Get existing records
            query = sa.select([
                sat_table_obj.c[hub_key_name],
                *[sat_table_obj.c[col] for col in columns_to_track if hasattr(sat_table_obj.c, col)],
                sat_table_obj.c.effective_from_dts,
                sat_table_obj.c.effective_to_dts
            ]).where(
                sat_table_obj.c.effective_to_dts == '9999-12-31 23:59:59+00'
            )
            
            existing_df = pd.read_sql(query, conn)
            
            # For each source record, check if it's different from the current record
            rows_inserted = 0
            rows_closed = 0
            
            for _, src_row in sat_df.iterrows():
                hub_key = src_row[hub_key_name]
                
                # Find current record for this hub key
                if not existing_df.empty:
                    curr_records = existing_df[existing_df[hub_key_name] == hub_key]
                else:
                    curr_records = pd.DataFrame()
                
                if curr_records.empty:
                    # No existing record, insert new one
                    src_row_df = pd.DataFrame([src_row])
                    src_row_df.to_sql(
                        name=table,
                        schema=schema,
                        con=conn,
                        if_exists='append',
                        index=False
                    )
                    rows_inserted += 1
                else:
                    # Check if business attributes have changed
                    changed = False
                    curr_record = curr_records.iloc[0]
                    
                    for col in columns_to_track:
                        if col in curr_record and col in src_row:
                            if pd.isna(curr_record[col]) and pd.isna(src_row[col]):
                                continue  # Both are NULL/NaN
                            elif pd.isna(curr_record[col]) or pd.isna(src_row[col]):
                                changed = True  # One is NULL, one is not
                                break
                            elif str(curr_record[col]) != str(src_row[col]):
                                changed = True
                                break
                    
                    if changed:
                        # Close current record
                        update_stmt = sa.update(sat_table_obj).where(
                            sa.and_(
                                sat_table_obj.c[hub_key_name] == hub_key,
                                sat_table_obj.c.effective_to_dts == '9999-12-31 23:59:59+00'
                            )
                        ).values(
                            effective_to_dts=current_time
                        )
                        conn.execute(update_stmt)
                        rows_closed += 1
                        
                        # Insert new record
                        src_row_df = pd.DataFrame([src_row])
                        src_row_df.to_sql(
                            name=table,
                            schema=schema,
                            con=conn,
                            if_exists='append',
                            index=False
                        )
                        rows_inserted += 1
            
            logger.info(f"Satellite {satellite_table}: {rows_inserted} records inserted, {rows_closed} records closed")
            return rows_inserted
    
    def load_event_satellite(
        self,
        source_df: pd.DataFrame,
        satellite_table: str,
        key_mappings: Dict[str, str],
        event_date_col: str,
        business_cols: List[str],
        source_name: str = "DATA_PIPELINE"
    ) -> int:
        """
        Load data into an event satellite or fact-like table
        
        Args:
            source_df: Source dataframe
            satellite_table: Target event satellite table name (schema.table)
            key_mappings: Dict mapping {target_hub_key_column: source_column/expr}
            event_date_col: Column name in source for event date
            business_cols: List of business columns to copy
            source_name: Source system name for record_source
            
        Returns:
            Number of rows inserted
        """
        logger.info(f"Loading event satellite: {satellite_table} from {len(source_df)} source records")
        
        # Prepare event satellite dataframe
        ev_df = pd.DataFrame()
        
        # Generate hash keys for each hub relationship
        for target_col, source_col in key_mappings.items():
            if "MD5(" in source_col:
                # Extract the column and suffix
                parts = source_col.split("'")
                if len(parts) >= 2:
                    col_parts = parts[0].split("(")[1].split(" || ")[0].strip()
                    suffix = parts[1]
                    source_df[f'key_{target_col}'] = source_df[col_parts].astype(str).apply(
                        lambda x: self._generate_hash_key(f"{x}{suffix}")
                    )
            else:
                # Direct column reference
                source_df[f'key_{target_col}'] = source_df[source_col]
                
            ev_df[target_col] = source_df[f'key_{target_col}']
            
        # Copy business columns
        for col in business_cols:
            if col in source_df.columns:
                ev_df[col] = source_df[col]
        
        # Copy event date
        if event_date_col in source_df.columns:
            ev_df['txn_dts'] = source_df[event_date_col]
        else:
            ev_df['txn_dts'] = self._get_current_timestamp()
            
        # Add metadata columns
        ev_df['load_dts'] = self._get_current_timestamp()
        ev_df['record_source'] = source_name
        
        # Insert data
        with self.engine.begin() as conn:
            schema, table = satellite_table.split('.')
            
            ev_df.to_sql(
                name=table,
                schema=schema,
                con=conn,
                if_exists='append',
                index=False
            )
            
            logger.info(f"Inserted {len(ev_df)} records into {satellite_table}")
            return len(ev_df)
    
    def record_batch_metadata(
        self,
        source_system: str,
        file_path: str = None,
        row_cnt_raw: int = None,
        row_cnt_stage: int = None,
        status: str = "SUCCESS",
        error_message: str = None
    ) -> None:
        """
        Record batch metadata for auditing
        
        Args:
            source_system: Source system name
            file_path: Path to source file (optional)
            row_cnt_raw: Raw row count (optional)
            row_cnt_stage: Staged row count (optional)
            status: Status of the batch (SUCCESS, WARN, FAIL)
            error_message: Error message if any
        """
        metadata = {
            'batch_id': self.batch_id,
            'source_system': source_system,
            'file_path': file_path,
            'row_cnt_raw': row_cnt_raw,
            'row_cnt_stage': row_cnt_stage,
            'load_started_dts': self._get_current_timestamp(),
            'load_ended_dts': self._get_current_timestamp(),
            'status': status,
            'error_message': error_message
        }
        
        # Create DataFrame and insert
        metadata_df = pd.DataFrame([metadata])
        
        with self.engine.begin() as conn:
            metadata_df.to_sql(
                name='batch_metadata',
                schema='stg',
                con=conn,
                if_exists='append',
                index=False
            )
            
        logger.info(f"Recorded batch metadata: {self.batch_id}, status: {status}")

# Example usage
if __name__ == "__main__":
    # Connection string for your database
    conn_string = "postgresql://user:password@localhost:5432/yourdatabase"
    
    # Initialize loader
    loader = DataVaultLoader(conn_string)
    
    # Example: Load customer data
    customer_df = pd.DataFrame({
        'customer_id': ['C001', 'C002', 'C003'],
        'gender': ['M', 'F', 'M'],
        'date_of_birth': ['1980-01-01', '1985-05-15', '1990-10-20'],
        'income_band': ['HIGH', 'MEDIUM', 'LOW'],
        'marital_status': ['MARRIED', 'SINGLE', 'DIVORCED'],
        'branch_code': ['B001', 'B002', 'B001']
    })
    
    try:
        # Start a batch
        loader.record_batch_metadata(
            source_system="SAMPLE_DATA",
            file_path="sample_data.csv",
            row_cnt_raw=len(customer_df),
            status="RUNNING"
        )
        
        # Load hub_customer
        loader.load_hub(
            source_df=customer_df,
            hub_table="stg.hub_customer",
            business_key="customer_id", 
            business_key_alias="customer_bk",
            source_name="SAMPLE_DATA"
        )
        
        # Load hub_branch
        branch_df = pd.DataFrame({
            'branch_code': ['B001', 'B002'],
            'branch_name': ['Main Branch', 'Downtown Branch']
        })
        
        loader.load_hub(
            source_df=branch_df,
            hub_table="stg.hub_branch",
            business_key="branch_code",
            business_key_alias="branch_bk",
            source_name="SAMPLE_DATA"
        )
        
        # Load link_customer_branch
        loader.load_link(
            source_df=customer_df,
            link_table="stg.lnk_customer_branch",
            link_keys={
                "customer_hk": "customer_id",
                "branch_hk": "branch_code"
            },
            source_name="SAMPLE_DATA"
        )
        
        # Load sat_customer_profile
        loader.load_satellite(
            source_df=customer_df,
            satellite_table="stg.sat_customer_profile",
            hub_key_name="customer_hk",
            hub_key_value_expr="MD5(customer_id || 'CUSTOMER_PROFILE')",
            columns_to_track=["gender", "dob", "income_band", "marital_status"],
            source_name="SAMPLE_DATA"
        )
        
        # Record successful completion
        loader.record_batch_metadata(
            source_system="SAMPLE_DATA",
            file_path="sample_data.csv",
            row_cnt_raw=len(customer_df),
            row_cnt_stage=len(customer_df),
            status="SUCCESS"
        )
        
    except Exception as e:
        # Record failure
        loader.record_batch_metadata(
            source_system="SAMPLE_DATA",
            file_path="sample_data.csv",
            row_cnt_raw=len(customer_df),
            status="FAIL",
            error_message=str(e)
        )
        raise 