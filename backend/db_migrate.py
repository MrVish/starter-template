#!/usr/bin/env python3
import os
import sys
import argparse
from flask_migrate import Migrate, MigrateCommand, upgrade, init, migrate, stamp

# Add project root to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import create_app, db

def run_migrations(args):
    """Run database migrations based on command line arguments"""
    app = create_app()
    
    with app.app_context():
        # Initialize migrations if not already done
        if not os.path.exists('migrations'):
            print("Initializing migrations directory...")
            init()
        
        # Create migration
        if args.command == 'create':
            if not args.message:
                print("Error: Migration message required for 'create' command")
                sys.exit(1)
            print(f"Creating migration: {args.message}")
            migrate(message=args.message)
        
        # Apply migrations
        elif args.command == 'upgrade':
            print("Applying migrations...")
            target = args.revision if args.revision else 'head'
            upgrade(target)
        
        # Set revision without migrating
        elif args.command == 'stamp':
            if not args.revision:
                print("Error: Revision required for 'stamp' command")
                sys.exit(1)
            print(f"Stamping database with revision: {args.revision}")
            stamp(args.revision)
        
        # Initialize DB with default data
        elif args.command == 'init_data':
            print("Initializing database with default data...")
            from utils.init_db import init_roles_and_permissions
            init_roles_and_permissions()
        
        print("Migration operation completed successfully")

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Database migration manager')
    parser.add_argument('command', choices=['create', 'upgrade', 'stamp', 'init_data'],
                        help='Migration command to run')
    parser.add_argument('--message', '-m', help='Migration message (for create command)')
    parser.add_argument('--revision', '-r', help='Migration revision (for upgrade and stamp commands)')
    
    args = parser.parse_args()
    run_migrations(args) 