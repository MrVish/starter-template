from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.user import User, Role, Permission
from app.extensions import db
from flask_cors import cross_origin

admin_bp = Blueprint('admin', __name__)

def is_admin_user(user):
    return any(r.name.lower() in ['administrator', 'admin', 'Administrator'] for r in user.roles)

# ----- User endpoints -----
@admin_bp.route('/users', methods=['GET', 'OPTIONS'])
@cross_origin(origins=["http://localhost:3000"], supports_credentials=True)
@jwt_required(optional=True)
def list_users():
    if request.method == 'OPTIONS':
        return '', 200
    current_user = User.query.get(get_jwt_identity())
    if not current_user or not is_admin_user(current_user):
        return jsonify({'error': 'Unauthorized'}), 403
    users = User.query.all()
    return jsonify([user.to_dict() for user in users])

@admin_bp.route('/users', methods=['POST', 'OPTIONS'])
@cross_origin(origins=["http://localhost:3000"], supports_credentials=True)
@jwt_required(optional=True)
def create_user():
    if request.method == 'OPTIONS':
        return '', 200
    data = request.get_json()
    user = User(username=data.get('username'), email=data.get('email'))
    if data.get('password'):
        user.set_password(data['password'])
    if 'roles' in data:
        for role_name in data['roles']:
            role = Role.query.filter_by(name=role_name).first()
            if role:
                user.roles.append(role)
    db.session.add(user)
    db.session.commit()
    return jsonify(user.to_dict()), 201

@admin_bp.route('/users/<int:user_id>', methods=['PUT', 'OPTIONS'])
@cross_origin(origins=["http://localhost:3000"], supports_credentials=True)
@jwt_required(optional=True)
def update_user(user_id):
    if request.method == 'OPTIONS':
        return '', 200
    data = request.get_json()
    user = User.query.get_or_404(user_id)
    user.username = data.get('username', user.username)
    user.email = data.get('email', user.email)
    if data.get('password'):
        user.set_password(data['password'])
    if 'roles' in data:
        user.roles = []
        for role_name in data['roles']:
            role = Role.query.filter_by(name=role_name).first()
            if role:
                user.roles.append(role)
    db.session.commit()
    return jsonify(user.to_dict())

@admin_bp.route('/users/<int:user_id>', methods=['DELETE', 'OPTIONS'])
@cross_origin(origins=["http://localhost:3000"], supports_credentials=True)
@jwt_required(optional=True)
def delete_user(user_id):
    if request.method == 'OPTIONS':
        return '', 200
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return '', 204

# ----- Role endpoints -----
@admin_bp.route('/roles', methods=['GET', 'OPTIONS'])
@cross_origin(origins=["http://localhost:3000"], supports_credentials=True)
@jwt_required(optional=True)
def list_roles():
    if request.method == 'OPTIONS':
        return '', 200
    roles = Role.query.all()
    return jsonify([r.to_dict() for r in roles])

@admin_bp.route('/roles', methods=['POST', 'OPTIONS'])
@cross_origin(origins=["http://localhost:3000"], supports_credentials=True)
@jwt_required(optional=True)
def create_role():
    if request.method == 'OPTIONS':
        return '', 200
    data = request.get_json()
    role = Role(name=data.get('name'), description=data.get('description'))
    db.session.add(role)
    db.session.commit()
    return jsonify(role.to_dict()), 201

@admin_bp.route('/roles/<int:role_id>', methods=['PUT', 'OPTIONS'])
@cross_origin(origins=["http://localhost:3000"], supports_credentials=True)
@jwt_required(optional=True)
def update_role(role_id):
    if request.method == 'OPTIONS':
        return '', 200
    data = request.get_json()
    role = Role.query.get_or_404(role_id)
    role.name = data.get('name', role.name)
    role.description = data.get('description', role.description)
    db.session.commit()
    return jsonify(role.to_dict())

@admin_bp.route('/roles/<int:role_id>', methods=['DELETE', 'OPTIONS'])
@cross_origin(origins=["http://localhost:3000"], supports_credentials=True)
@jwt_required(optional=True)
def delete_role(role_id):
    if request.method == 'OPTIONS':
        return '', 200
    role = Role.query.get_or_404(role_id)
    db.session.delete(role)
    db.session.commit()
    return '', 204

# ----- Permission endpoints -----
@admin_bp.route('/permissions', methods=['GET', 'OPTIONS'])
@cross_origin(origins=["http://localhost:3000"], supports_credentials=True)
@jwt_required(optional=True)
def list_permissions():
    if request.method == 'OPTIONS':
        return '', 200
    permissions = Permission.query.all()
    return jsonify([p.to_dict() for p in permissions])

@admin_bp.route('/permissions', methods=['POST', 'OPTIONS'])
@cross_origin(origins=["http://localhost:3000"], supports_credentials=True)
@jwt_required(optional=True)
def create_permission():
    if request.method == 'OPTIONS':
        return '', 200
    data = request.get_json()
    perm = Permission(
        name=data.get('name'),
        description=data.get('description'),
        resource=data.get('resource'),
        action=data.get('action')
    )
    db.session.add(perm)
    db.session.commit()
    return jsonify(perm.to_dict()), 201

@admin_bp.route('/permissions/<int:perm_id>', methods=['PUT', 'OPTIONS'])
@cross_origin(origins=["http://localhost:3000"], supports_credentials=True)
@jwt_required(optional=True)
def update_permission(perm_id):
    if request.method == 'OPTIONS':
        return '', 200
    data = request.get_json()
    perm = Permission.query.get_or_404(perm_id)
    perm.name = data.get('name', perm.name)
    perm.description = data.get('description', perm.description)
    perm.resource = data.get('resource', perm.resource)
    perm.action = data.get('action', perm.action)
    db.session.commit()
    return jsonify(perm.to_dict())

@admin_bp.route('/permissions/<int:perm_id>', methods=['DELETE', 'OPTIONS'])
@cross_origin(origins=["http://localhost:3000"], supports_credentials=True)
@jwt_required(optional=True)
def delete_permission(perm_id):
    if request.method == 'OPTIONS':
        return '', 200
    perm = Permission.query.get_or_404(perm_id)
    db.session.delete(perm)
    db.session.commit()
    return '', 204
