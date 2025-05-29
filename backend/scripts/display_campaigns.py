#!/usr/bin/env python
"""
Display Campaigns Script

This script displays campaign data from the dim_campaigns table in a nicely formatted way.

Usage:
    python scripts/display_campaigns.py
"""

import os
import sqlite3

# Database path
DB_PATH = "instance/app.db"

def main():
    """Main function to display campaign data."""
    print(f"Displaying campaigns from {DB_PATH}...\n")
    
    if not os.path.exists(DB_PATH):
        print(f"Database file {DB_PATH} not found!")
        return
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Count rows
    cursor.execute("SELECT COUNT(*) FROM dim_campaigns")
    count = cursor.fetchone()[0]
    print(f"Total campaigns: {count}\n")
    
    # Display campaigns with key fields
    print("CAMPAIGN DETAILS:")
    print("=" * 80)
    print(f"{'ID':<3} | {'NAME':<35} | {'TYPE':<12} | {'STATUS':<10} | {'BUDGET':>10}")
    print("-" * 80)
    
    cursor.execute("""
        SELECT id, name, type, status, budget
        FROM dim_campaigns
        ORDER BY id
    """)
    
    rows = cursor.fetchall()
    for row in rows:
        budget_str = f"${row[4]:.2f}" if row[4] is not None else "N/A"
        print(f"{row[0]:<3} | {row[1]:<35} | {row[2]:<12} | {row[3]:<10} | {budget_str:>10}")
    
    # Display date information
    print("\nCAMPAIGN DATES:")
    print("=" * 80)
    print(f"{'ID':<3} | {'NAME':<35} | {'START DATE':<12} | {'END DATE':<12} | {'CREATED AT':<12}")
    print("-" * 80)
    
    cursor.execute("""
        SELECT id, name, start_date, end_date, created_at
        FROM dim_campaigns
        ORDER BY id
    """)
    
    rows = cursor.fetchall()
    for row in rows:
        start_date = row[2] if row[2] is not None else "N/A"
        end_date = row[3] if row[3] is not None else "N/A"
        created_at = row[4] if row[4] is not None else "N/A"
        print(f"{row[0]:<3} | {row[1]:<35} | {start_date:<12} | {end_date:<12} | {created_at:<12}")
    
    conn.close()
    print("\nDisplay completed!")

if __name__ == "__main__":
    main() 