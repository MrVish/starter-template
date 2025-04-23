from flask import Flask
from app import create_app


app = create_app()
with app.app_context():
    for rule in app.url_map.iter_rules():
        methods = ','.join(rule.methods)
        print(f"{rule.endpoint:30s} | {methods:20s} | {rule.rule}")