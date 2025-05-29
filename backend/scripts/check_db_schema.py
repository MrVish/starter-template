#!/usr/bin/env python
"""
Database Schema Check Script

This script checks the schema of app.db and compares it with the model definitions.
It identifies missing columns and suggests migrations to fix them.

Usage:
    python backend/scripts/check_db_schema.py
"""

import os
import sys
import sqlite3
import logging
import importlib
import inspect
from sqlalchemy import Column, inspect as sa_inspect

# Add parent directory to Python path to import modules
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("schema_check")

DB_PATH = "app.db"

def get_db_tables_and_columns():
    """Get all tables and their columns from the database."""
    if not os.path.exists(DB_PATH):
        logger.error(f"Database file {DB_PATH} not found!")
        return None
    
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        # Get all tables
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = [row[0] for row in cursor.fetchall()]
        logger.info(f"Found {len(tables)} tables in database")
        
        # Get columns for each table
        db_schema = {}
        for table in tables:
            cursor.execute(f"PRAGMA table_info({table});")
            columns = cursor.fetchall()
            column_info = {}
            for col in columns:
                # col format: (cid, name, type, notnull, dflt_value, pk)
                column_info[col[1]] = {
                    'type': col[2],
                    'nullable': col[3] == 0,
                    'default': col[4],
                    'primary_key': col[5] == 1
                }
            db_schema[table] = column_info
        
        conn.close()
        return db_schema
    except Exception as e:
        logger.error(f"Error getting database schema: {str(e)}")
        return None

def get_model_classes():
    """Get all SQLAlchemy model classes from the models directory."""
    models_dir = os.path.join(os.path.dirname(__file__), '..', 'models')
    model_files = [f for f in os.listdir(models_dir) if f.endswith('.py') and not f.startswith('__')]
    
    # Import app to get db.Model
    try:
        from app import create_app
        from extensions import db
        
        app = create_app()
        with app.app_context():
            # Find all model classes
            model_classes = {}
            
            for model_file in model_files:
                module_name = f"models.{model_file[:-3]}"  # Remove .py extension
                try:
                    module = importlib.import_module(module_name)
                    
                    # Find all classes that inherit from db.Model
                    for name, obj in inspect.getmembers(module):
                        if inspect.isclass(obj) and issubclass(obj, db.Model) and obj != db.Model:
                            # Get table name
                            table_name = obj.__tablename__
                            model_classes[table_name] = obj
                            
                except ImportError as e:
                    logger.warning(f"Could not import module {module_name}: {str(e)}")
            
            logger.info(f"Found {len(model_classes)} model classes")
            return model_classes, db
    except Exception as e:
        logger.error(f"Error importing models: {str(e)}")
        return None, None

def get_model_columns(model_class, db):
    """Get all columns for a SQLAlchemy model class."""
    columns = {}
    for name, column in model_class.__dict__.items():
        if isinstance(column, db.Column):
            column_type = str(column.type)
            nullable = column.nullable
            default = column.default.arg if column.default is not None else None
            primary_key = column.primary_key
            
            columns[name] = {
                'type': column_type,
                'nullable': nullable,
                'default': default,
                'primary_key': primary_key
            }
    return columns

def compare_schemas(db_schema, model_classes, db):
    """Compare database schema with model definitions."""
    logger.info("Comparing database schema with model definitions...")
    
    # Track differences
    missing_tables = []
    missing_columns = {}
    type_mismatches = {}
    
    # Check model classes against database
    for table_name, model_class in model_classes.items():
        # Check if table exists
        if table_name not in db_schema:
            missing_tables.append(table_name)
            continue
        
        # Get columns for model and database
        model_columns = {}
        with app.app_context():
            inspector = sa_inspect(db.engine)
            model_columns_info = inspector.get_columns(table_name)
            for col in model_columns_info:
                model_columns[col['name']] = {
                    'type': str(col['type']),
                    'nullable': col['nullable'],
                    'default': col.get('default'),
                }
        
        db_columns = db_schema[table_name]
        
        # Check for missing columns
        table_missing_columns = []
        for col_name in model_columns:
            if col_name not in db_columns:
                table_missing_columns.append(col_name)
        
        if table_missing_columns:
            missing_columns[table_name] = table_missing_columns
        
        # Check for type mismatches (simplified check)
        table_type_mismatches = []
        for col_name, col_info in model_columns.items():
            if col_name in db_columns:
                # Simple string comparison of types
                db_type = db_columns[col_name]['type'].lower().replace('varchar', 'character varying')
                model_type = col_info['type'].lower()
                
                # Simplify comparison (this is basic - SQLAlchemy types might not match exactly)
                if not (db_type in model_type or model_type in db_type):
                    table_type_mismatches.append((col_name, db_type, model_type))
        
        if table_type_mismatches:
            type_mismatches[table_name] = table_type_mismatches
    
    return {
        'missing_tables': missing_tables,
        'missing_columns': missing_columns,
        'type_mismatches': type_mismatches
    }

def generate_alembic_migration(differences):
    """Generate Alembic migration code for the differences."""
    if not any([differences['missing_tables'], differences['missing_columns'], differences['type_mismatches']]):
        return "# No differences found, no migration needed."
    
    migration_code = """\"\"\"
Add missing columns to database tables

Revision ID: auto_generated
Revises: 
Create Date: auto_generated

\"\"\"
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'auto_generated'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # Add missing tables
"""
    
    # Add missing tables (placeholder - would need more info about the models)
    if differences['missing_tables']:
        for table in differences['missing_tables']:
            migration_code += f"    # TODO: Create table {table}\n"
    else:
        migration_code += "    # No missing tables\n"
    
    # Add missing columns
    migration_code += "\n    # Add missing columns\n"
    if differences['missing_columns']:
        for table, columns in differences['missing_columns'].items():
            for column in columns:
                migration_code += f"    op.add_column('{table}', sa.Column('{column}', sa.String(), nullable=True))\n"
                # Note: This is a placeholder. Real migration would need proper column type and attributes
    else:
        migration_code += "    # No missing columns\n"
    
    # Fix type mismatches
    migration_code += "\n    # Fix type mismatches\n"
    if differences['type_mismatches']:
        for table, mismatches in differences['type_mismatches'].items():
            for column, db_type, model_type in mismatches:
                migration_code += f"    # Column {column} in table {table}: DB type {db_type}, Model type {model_type}\n"
                # Note: Would need proper alter column syntax here
    else:
        migration_code += "    # No type mismatches\n"
    
    migration_code += """

def downgrade():
    # This is a one-way migration, no downgrade
    pass
"""
    
    return migration_code

def generate_sqlite_commands(differences):
    """Generate SQLite commands to fix the differences."""
    commands = []
    
    # Add missing columns
    if differences['missing_columns']:
        for table, columns in differences['missing_columns'].items():
            for column in columns:
                # Default to TEXT type with NULL allowed for simplicity
                commands.append(f"ALTER TABLE {table} ADD COLUMN {column} TEXT;")
    
    return commands

def check_dim_campaigns_table():
    """Specifically check the dim_campaigns table for needed fields."""
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        # Check if dim_campaigns exists
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='dim_campaigns';")
        if not cursor.fetchone():
            logger.error("dim_campaigns table does not exist!")
            conn.close()
            return False, []
        
        # Get columns for dim_campaigns
        cursor.execute("PRAGMA table_info(dim_campaigns);")
        columns = [col[1] for col in cursor.fetchall()]
        logger.info(f"dim_campaigns columns: {columns}")
        
        # Check for critical columns
        missing_columns = []
        critical_columns = ['id', 'name', 'type', 'status', 'budget', 'start_date', 'end_date']
        for col in critical_columns:
            if col not in columns:
                missing_columns.append(col)
        
        if missing_columns:
            logger.error(f"Missing critical columns in dim_campaigns: {missing_columns}")
            
            # Generate commands to add missing columns
            commands = []
            for col in missing_columns:
                if col == 'status':
                    commands.append("ALTER TABLE dim_campaigns ADD COLUMN status TEXT DEFAULT 'active';")
                elif col == 'budget':
                    commands.append("ALTER TABLE dim_campaigns ADD COLUMN budget NUMERIC(12,2) DEFAULT 0;")
                else:
                    commands.append(f"ALTER TABLE dim_campaigns ADD COLUMN {col} TEXT;")
            
            conn.close()
            return False, commands
        
        conn.close()
        logger.info("dim_campaigns table has all critical columns")
        return True, []
    except Exception as e:
        logger.error(f"Error checking dim_campaigns table: {str(e)}")
        return False, []

def main():
    """Main function to check database schema."""
    # Make sure we're in the project root directory
    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
    os.chdir(project_root)
    
    logger.info(f"Current working directory: {os.getcwd()}")
    
    # Check specifically for dim_campaigns table first
    dim_campaigns_ok, commands = check_dim_campaigns_table()
    
    if not dim_campaigns_ok:
        logger.warning("dim_campaigns table needs updates!")
        if commands:
            logger.info("SQLite commands to fix dim_campaigns:")
            for cmd in commands:
                logger.info(f"  {cmd}")
        
        # Suggest creating a Python script to apply these changes
        logger.info("\nCreate a Python script like this to apply the changes:")
        script = """
import sqlite3

def fix_dim_campaigns():
    conn = sqlite3.connect('app.db')
    cursor = conn.cursor()
    
    # Add missing columns
"""
        for cmd in commands:
            script += f"    cursor.execute(\"{cmd}\")\n"
        
        script += """
    # Commit changes
    conn.commit()
    conn.close()
    print("dim_campaigns table fixed successfully")

if __name__ == "__main__":
    fix_dim_campaigns()
"""
        logger.info(script)
    
    # Get full database schema
    db_schema = get_db_tables_and_columns()
    if not db_schema:
        logger.error("Failed to get database schema")
        return
    
    # Get model classes
    model_classes, db = get_model_classes()
    if not model_classes:
        logger.error("Failed to get model classes")
        return
    
    # Compare schemas
    differences = compare_schemas(db_schema, model_classes, db)
    
    # Generate migration code
    migration_code = generate_alembic_migration(differences)
    logger.info("\nAlembic migration code:")
    logger.info(migration_code)
    
    # Generate SQLite commands
    sqlite_commands = generate_sqlite_commands(differences)
    if sqlite_commands:
        logger.info("\nSQLite commands to fix schema:")
        for cmd in sqlite_commands:
            logger.info(cmd)
    
    logger.info("\nSchema check completed!")

if __name__ == "__main__":
    # Import app for app context
    from app import create_app
    app = create_app()
    
    main() 