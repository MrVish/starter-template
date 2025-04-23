#!/usr/bin/env python
"""
Script to handle database migrations.
This is a convenience wrapper around Flask-Migrate/Alembic.
"""
import os
import sys
import argparse

from flask_migrate import init, migrate, upgrade, revision
from cli_app import app
from extensions import db

def run_migrations(args):
    """Run migration commands based on arguments"""
    with app.app_context():
        if args.command == 'init':
            init()
        elif args.command == 'migrate':
            migrate(message=args.message)
        elif args.command == 'upgrade':
            upgrade()
        elif args.command == 'revision':
            revision(message=args.message)

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Database migration utility')
    parser.add_argument('command', choices=['init', 'migrate', 'upgrade', 'revision'],
                        help='Migration command to run')
    parser.add_argument('-m', '--message', help='Migration message')
    
    args = parser.parse_args()
    run_migrations(args) 