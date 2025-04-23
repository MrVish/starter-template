"""
Utility functions for debugging Flask routes
"""

def print_routes(app, pattern=None):
    """
    Print all routes registered in the Flask app,
    optionally filtering by a pattern
    """
    print("\nRegistered Routes:")
    print("-" * 80)
    print(f"{'Endpoint':<40} | {'Methods':<20} | URL Rule")
    print("-" * 80)
    
    # Get all rules
    rules = sorted([rule for rule in app.url_map.iter_rules()], key=lambda x: x.rule)
    
    # Filter if pattern is provided
    if pattern:
        rules = [rule for rule in rules if pattern in rule.endpoint or pattern in rule.rule]
    
    # Print the rules
    for rule in rules:
        methods = ','.join(sorted(rule.methods))
        print(f"{rule.endpoint:<40} | {methods:<20} | {rule.rule}")

def get_route_map(app):
    """
    Return a dictionary of routes grouped by prefix
    """
    route_map = {}
    
    for rule in app.url_map.iter_rules():
        parts = rule.rule.strip('/').split('/')
        prefix = parts[0] if parts else 'root'
        
        if prefix not in route_map:
            route_map[prefix] = []
            
        route_map[prefix].append({
            'endpoint': rule.endpoint,
            'methods': sorted(list(rule.methods)),
            'rule': rule.rule
        })
    
    # Sort each prefix group
    for prefix in route_map:
        route_map[prefix] = sorted(route_map[prefix], key=lambda x: x['rule'])
        
    return route_map

def print_route_map(app):
    """
    Print routes organized by prefix
    """
    route_map = get_route_map(app)
    
    print("\nRoutes By Prefix:")
    print("-" * 80)
    
    for prefix, routes in sorted(route_map.items()):
        print(f"\n[{prefix}]")
        print("-" * 40)
        
        for route in routes:
            methods = ','.join(route['methods'])
            print(f"{route['endpoint']:<40} | {methods:<20} | {route['rule']}")

def check_specific_route(app, path):
    """
    Check if a specific route exists and print details
    """
    found = False
    for rule in app.url_map.iter_rules():
        if rule.rule == path:
            found = True
            print(f"\nRoute '{path}' found:")
            print(f"  Endpoint: {rule.endpoint}")
            print(f"  Methods: {', '.join(sorted(rule.methods))}")
            print(f"  Arguments: {list(rule.arguments)}")
            
    if not found:
        print(f"\nRoute '{path}' not found in application routes.")
        # Find similar routes
        similar = []
        parts = path.strip('/').split('/')
        for rule in app.url_map.iter_rules():
            rule_parts = rule.rule.strip('/').split('/')
            if len(parts) > 0 and len(rule_parts) > 0 and parts[0] == rule_parts[0]:
                similar.append(rule.rule)
        
        if similar:
            print("Similar routes found:")
            for route in sorted(similar):
                print(f"  - {route}")
    
    return found 