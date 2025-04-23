"""
[DEPRECATED - CANDIDATE FOR REMOVAL]
This file contains ML model management endpoints that may no longer be needed.
If you're not using model risk management features, this file can be safely removed.
"""
import os
import json
import joblib
from datetime import datetime
from flask import Blueprint, request, jsonify, current_app, send_file
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
from extensions import db
from models.user import User
from models.ml_model import MLModel
from tasks.ml import train_model, predict_batch, check_model_drift
from utils.decorators import audit_log, permission_required

ml_bp = Blueprint('ml', __name__)

@ml_bp.route('/', methods=['GET'])
@jwt_required()
@audit_log(action_type='list_models')
def list_models():
    """
    List ML Models
    ---
    tags:
      - Models
    security:
      - Bearer: []
    responses:
      200:
        description: List of ML models
      401:
        description: Unauthorized
    """
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    # Admin sees all models, others see only models they have access to
    if user.is_admin:
        models = MLModel.query.all()
    else:
        models = user.models
    
    models_data = [{
        'id': model.id,
        'name': model.name,
        'description': model.description,
        'model_type': model.model_type,
        'status': model.status,
        'version': model.version,
        'created_at': model.created_at.isoformat() if model.created_at else None,
        'updated_at': model.updated_at.isoformat() if model.updated_at else None,
        'metrics': json.loads(model.metrics) if model.metrics else None,
        'drift_detected': model.drift_detected
    } for model in models]
    
    return jsonify({'models': models_data}), 200

@ml_bp.route('/<int:model_id>', methods=['GET'])
@jwt_required()
@audit_log(action_type='get_model')
def get_model(model_id):
    """
    Get ML Model Details
    ---
    tags:
      - Models
    security:
      - Bearer: []
    parameters:
      - name: model_id
        in: path
        required: true
        schema:
          type: integer
    responses:
      200:
        description: Model details
      404:
        description: Model not found
    """
    model = MLModel.query.get(model_id)
    
    if not model:
        return jsonify({'error': 'Model not found'}), 404
    
    # Check if user has access to the model
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user.is_admin and model not in user.models:
        return jsonify({'error': 'Unauthorized access'}), 403
    
    model_data = {
        'id': model.id,
        'name': model.name,
        'description': model.description,
        'model_type': model.model_type,
        'status': model.status,
        'version': model.version,
        'created_at': model.created_at.isoformat() if model.created_at else None,
        'updated_at': model.updated_at.isoformat() if model.updated_at else None,
        'metrics': json.loads(model.metrics) if model.metrics else None,
        'parameters': json.loads(model.parameters) if model.parameters else None,
        'feature_columns': json.loads(model.feature_columns) if model.feature_columns else None,
        'target_column': model.target_column,
        'drift_detected': model.drift_detected,
        'last_drift_check': model.last_drift_check.isoformat() if model.last_drift_check else None,
        'created_by': {
            'id': model.created_by.id,
            'username': model.created_by.username
        } if model.created_by else None,
        'users': [{
            'id': u.id,
            'username': u.username
        } for u in model.users]
    }
    
    return jsonify(model_data), 200

@ml_bp.route('/', methods=['POST'])
@jwt_required()
@permission_required('create', 'model')
@audit_log(action_type='create_model')
def create_model():
    """
    Create a New ML Model
    ---
    tags:
      - Models
    security:
      - Bearer: []
    requestBody:
      content:
        application/json:
          schema:
            type: object
            required:
              - name
              - model_type
            properties:
              name:
                type: string
              description:
                type: string
              model_type:
                type: string
                enum: [classification, regression]
    responses:
      201:
        description: Model created
      400:
        description: Invalid request
    """
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['name', 'model_type']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Missing required field: {field}'}), 400
    
    user_id = get_jwt_identity()
    
    # Create new model
    new_model = MLModel(
        name=data['name'],
        description=data.get('description', ''),
        model_type=data['model_type'],
        created_by_id=user_id
    )
    
    # Add creator to model users
    user = User.query.get(user_id)
    new_model.users.append(user)
    
    db.session.add(new_model)
    db.session.commit()
    
    return jsonify({
        'message': 'Model created successfully',
        'model': {
            'id': new_model.id,
            'name': new_model.name,
            'model_type': new_model.model_type
        }
    }), 201

@ml_bp.route('/<int:model_id>/upload-dataset', methods=['POST'])
@jwt_required()
@permission_required('update', 'model')
@audit_log(action_type='upload_dataset')
def upload_dataset(model_id):
    """
    Upload Dataset for a Model
    ---
    tags:
      - Models
    security:
      - Bearer: []
    parameters:
      - name: model_id
        in: path
        required: true
        schema:
          type: integer
    requestBody:
      content:
        multipart/form-data:
          schema:
            type: object
            required:
              - dataset
              - target_column
            properties:
              dataset:
                type: string
                format: binary
              target_column:
                type: string
              feature_columns:
                type: string
                description: JSON string of feature column names
    responses:
      200:
        description: Dataset uploaded
      404:
        description: Model not found
    """
    model = MLModel.query.get(model_id)
    
    if not model:
        return jsonify({'error': 'Model not found'}), 404
    
    # Check if user has access to the model
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user.is_admin and model not in user.models:
        return jsonify({'error': 'Unauthorized access'}), 403
    
    # Check if file is in request
    if 'dataset' not in request.files:
        return jsonify({'error': 'No dataset file provided'}), 400
    
    file = request.files['dataset']
    if file.filename == '':
        return jsonify({'error': 'No dataset file selected'}), 400
    
    # Check target column
    target_column = request.form.get('target_column')
    if not target_column:
        return jsonify({'error': 'Target column is required'}), 400
    
    # Save file
    filename = secure_filename(file.filename)
    datasets_dir = current_app.config.get('ML_DATASETS_DIR', 'ml_datasets')
    os.makedirs(datasets_dir, exist_ok=True)
    file_path = os.path.join(datasets_dir, f"{model_id}_{filename}")
    file.save(file_path)
    
    # Update model
    model.dataset_path = file_path
    model.target_column = target_column
    
    # Set feature columns if provided
    feature_columns = request.form.get('feature_columns')
    if feature_columns:
        model.feature_columns = feature_columns
    
    db.session.commit()
    
    return jsonify({
        'message': 'Dataset uploaded successfully',
        'file_path': file_path
    }), 200

@ml_bp.route('/<int:model_id>/train', methods=['POST'])
@jwt_required()
@permission_required('update', 'model')
@audit_log(action_type='train_model')
def start_training(model_id):
    """
    Start Training a Model
    ---
    tags:
      - Models
    security:
      - Bearer: []
    parameters:
      - name: model_id
        in: path
        required: true
        schema:
          type: integer
    requestBody:
      content:
        application/json:
          schema:
            type: object
            properties:
              parameters:
                type: object
                description: Model hyperparameters
              feature_columns:
                type: array
                items:
                  type: string
                description: List of feature columns
    responses:
      200:
        description: Training started
      404:
        description: Model not found
    """
    model = MLModel.query.get(model_id)
    
    if not model:
        return jsonify({'error': 'Model not found'}), 404
    
    # Check dataset
    if not model.dataset_path:
        return jsonify({'error': 'No dataset uploaded for this model'}), 400
    
    # Check target column
    if not model.target_column:
        return jsonify({'error': 'No target column specified'}), 400
    
    data = request.get_json() or {}
    
    # Get feature columns from request or model
    features = data.get('feature_columns')
    if not features and model.feature_columns:
        features = json.loads(model.feature_columns)
    
    if not features:
        return jsonify({'error': 'Feature columns not specified'}), 400
    
    # Get model parameters
    params = data.get('parameters', {})
    
    # Update model
    model.status = 'pending'
    if params:
        model.parameters = json.dumps(params)
    if features:
        model.feature_columns = json.dumps(features)
    db.session.commit()
    
    # Start training task
    task = train_model.delay(
        model_id,
        model.dataset_path,
        model.model_type,
        params,
        features,
        model.target_column
    )
    
    return jsonify({
        'message': 'Model training started',
        'task_id': task.id
    }), 200

@ml_bp.route('/<int:model_id>/predict', methods=['POST'])
@jwt_required()
@audit_log(action_type='model_predict')
def predict(model_id):
    """
    Generate Predictions with a Model
    ---
    tags:
      - Models
    security:
      - Bearer: []
    parameters:
      - name: model_id
        in: path
        required: true
        schema:
          type: integer
    requestBody:
      content:
        multipart/form-data:
          schema:
            type: object
            required:
              - data
            properties:
              data:
                type: string
                format: binary
    responses:
      200:
        description: Predictions generated
      404:
        description: Model not found
    """
    model = MLModel.query.get(model_id)
    
    if not model:
        return jsonify({'error': 'Model not found'}), 404
    
    # Check if model is trained
    if model.status != 'trained':
        return jsonify({'error': 'Model is not trained'}), 400
    
    # Check if file is in request
    if 'data' not in request.files:
        return jsonify({'error': 'No data file provided'}), 400
    
    file = request.files['data']
    if file.filename == '':
        return jsonify({'error': 'No data file selected'}), 400
    
    # Save input file
    filename = secure_filename(file.filename)
    predictions_dir = current_app.config.get('ML_PREDICTIONS_DIR', 'ml_predictions')
    os.makedirs(predictions_dir, exist_ok=True)
    input_path = os.path.join(predictions_dir, f"input_{model_id}_{filename}")
    file.save(input_path)
    
    # Set output path
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_path = os.path.join(predictions_dir, f"output_{model_id}_{timestamp}_{filename}")
    
    # Start prediction task
    task = predict_batch.delay(model_id, input_path, output_path)
    
    return jsonify({
        'message': 'Prediction task started',
        'task_id': task.id,
        'output_path': output_path
    }), 200

@ml_bp.route('/<int:model_id>/check-drift', methods=['POST'])
@jwt_required()
@permission_required('update', 'model')
@audit_log(action_type='check_model_drift')
def drift_check(model_id):
    """
    Check Model Drift
    ---
    tags:
      - Models
    security:
      - Bearer: []
    parameters:
      - name: model_id
        in: path
        required: true
        schema:
          type: integer
    requestBody:
      content:
        multipart/form-data:
          schema:
            type: object
            required:
              - data
            properties:
              data:
                type: string
                format: binary
              threshold:
                type: number
                default: 0.1
    responses:
      200:
        description: Drift check started
      404:
        description: Model not found
    """
    model = MLModel.query.get(model_id)
    
    if not model:
        return jsonify({'error': 'Model not found'}), 404
    
    # Check if model is trained
    if model.status != 'trained':
        return jsonify({'error': 'Model is not trained'}), 400
    
    # Check if file is in request
    if 'data' not in request.files:
        return jsonify({'error': 'No data file provided'}), 400
    
    file = request.files['data']
    if file.filename == '':
        return jsonify({'error': 'No data file selected'}), 400
    
    # Get drift threshold
    threshold = request.form.get('threshold', 0.1)
    try:
        threshold = float(threshold)
    except ValueError:
        return jsonify({'error': 'Invalid threshold value'}), 400
    
    # Save input file
    filename = secure_filename(file.filename)
    drift_dir = current_app.config.get('ML_DRIFT_DIR', 'ml_drift')
    os.makedirs(drift_dir, exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    data_path = os.path.join(drift_dir, f"drift_{model_id}_{timestamp}_{filename}")
    file.save(data_path)
    
    # Start drift check task
    task = check_model_drift.delay(model_id, data_path, threshold)
    
    return jsonify({
        'message': 'Drift check started',
        'task_id': task.id
    }), 200 