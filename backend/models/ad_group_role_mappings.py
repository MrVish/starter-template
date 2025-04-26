from extensions import db

# Association table for AD Groups and Roles
ad_group_role_mappings = db.Table(
    'ad_group_role_mappings',
    db.Column('ad_group_id', db.BigInteger, db.ForeignKey('dim_ad_groups.id', ondelete='CASCADE'), primary_key=True),
    db.Column('role_id', db.BigInteger, db.ForeignKey('roles.id', ondelete='CASCADE'), primary_key=True),
    extend_existing=True
) 