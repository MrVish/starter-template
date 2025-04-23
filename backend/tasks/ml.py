"""
[DEPRECATED - CANDIDATE FOR REMOVAL]
This file contains ML background tasks that may no longer be needed.
If you're not using model risk management features, this file can be safely removed.
"""
import os
import json
import logging
import numpy as np
import joblib
from celery import shared_task
from datetime import datetime
from flask import current_app
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    mean_squared_error, mean_absolute_error, r2_score
)

logger = logging.getLogger(__name__)

@shared_task
def train_model(model_id, dataset_path, model_type, params, features, target):
    """
    Train a machine learning model
    
    Args:
        model_id: ID of the model record in the database
        dataset_path: Path to the dataset
        model_type: Type of model (classification, regression, etc.)
        params: Model hyperparameters
        features: List of feature columns
        target: Target column
    """
    from models.ml_model import MLModel
    from app import db
    
    try:
        # Update model status to training
        model = MLModel.query.get(model_id)
        if not model:
            logger.error(f"Model with ID {model_id} not found")
            return False
        
        model.status = 'training'
        db.session.commit()
        
        # Load dataset
        import pandas as pd
        data = pd.read_csv(dataset_path)
        
        # Split data
        from sklearn.model_selection import train_test_split
        X = data[features]
        y = data[target]
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        # Select model
        if model_type == 'classification':
            from sklearn.ensemble import RandomForestClassifier
            clf = RandomForestClassifier(**params)
        elif model_type == 'regression':
            from sklearn.ensemble import RandomForestRegressor
            clf = RandomForestRegressor(**params)
        else:
            raise ValueError(f"Unsupported model type: {model_type}")
        
        # Train model
        clf.fit(X_train, y_train)
        
        # Evaluate model
        y_pred = clf.predict(X_test)
        metrics = {}
        
        if model_type == 'classification':
            metrics['accuracy'] = float(accuracy_score(y_test, y_pred))
            metrics['precision'] = float(precision_score(y_test, y_pred, average='weighted'))
            metrics['recall'] = float(recall_score(y_test, y_pred, average='weighted'))
            metrics['f1'] = float(f1_score(y_test, y_pred, average='weighted'))
        else:
            metrics['mse'] = float(mean_squared_error(y_test, y_pred))
            metrics['mae'] = float(mean_absolute_error(y_test, y_pred))
            metrics['r2'] = float(r2_score(y_test, y_pred))
        
        # Save model
        models_dir = current_app.config.get('ML_MODELS_DIR', 'ml_models')
        os.makedirs(models_dir, exist_ok=True)
        model_path = os.path.join(models_dir, f"{model_id}.joblib")
        joblib.dump(clf, model_path)
        
        # Save feature list
        with open(os.path.join(models_dir, f"{model_id}_features.json"), 'w') as f:
            json.dump(features, f)
        
        # Update model in database
        model.status = 'trained'
        model.metrics = json.dumps(metrics)
        model.path = model_path
        model.updated_at = datetime.utcnow()
        db.session.commit()
        
        logger.info(f"Successfully trained model {model_id} with metrics: {metrics}")
        return True
        
    except Exception as e:
        logger.error(f"Error training model {model_id}: {str(e)}")
        
        # Update model status to failed
        try:
            model = MLModel.query.get(model_id)
            if model:
                model.status = 'failed'
                model.error = str(e)
                db.session.commit()
        except Exception as db_error:
            logger.error(f"Failed to update model status: {str(db_error)}")
        
        return False

@shared_task
def predict_batch(model_id, data_path, output_path):
    """
    Generate predictions for a batch of data
    
    Args:
        model_id: ID of the model
        data_path: Path to the data to predict on
        output_path: Path to save predictions
    """
    try:
        # Load model
        models_dir = current_app.config.get('ML_MODELS_DIR', 'ml_models')
        model_path = os.path.join(models_dir, f"{model_id}.joblib")
        model = joblib.load(model_path)
        
        # Load features
        with open(os.path.join(models_dir, f"{model_id}_features.json"), 'r') as f:
            features = json.load(f)
        
        # Load data
        import pandas as pd
        data = pd.read_csv(data_path)
        
        # Ensure all features are present
        missing_features = [f for f in features if f not in data.columns]
        if missing_features:
            raise ValueError(f"Missing features in data: {missing_features}")
        
        # Generate predictions
        X = data[features]
        predictions = model.predict(X)
        
        # Save predictions
        data['prediction'] = predictions
        data.to_csv(output_path, index=False)
        
        logger.info(f"Generated predictions for model {model_id} and saved to {output_path}")
        return True
        
    except Exception as e:
        logger.error(f"Error generating predictions with model {model_id}: {str(e)}")
        return False

@shared_task
def check_model_drift(model_id, new_data_path, drift_threshold=0.1):
    """
    Check for model drift by comparing performance on new data
    
    Args:
        model_id: ID of the model
        new_data_path: Path to new data
        drift_threshold: Threshold for considering drift significant
    """
    from models.ml_model import MLModel
    from app import db
    
    try:
        # Get model from database
        model = MLModel.query.get(model_id)
        if not model:
            logger.error(f"Model with ID {model_id} not found")
            return False
        
        # Load model
        models_dir = current_app.config.get('ML_MODELS_DIR', 'ml_models')
        model_path = os.path.join(models_dir, f"{model_id}.joblib")
        clf = joblib.load(model_path)
        
        # Load features and target
        with open(os.path.join(models_dir, f"{model_id}_features.json"), 'r') as f:
            features = json.load(f)
        
        # Load baseline metrics
        baseline_metrics = json.loads(model.metrics)
        
        # Load new data
        import pandas as pd
        new_data = pd.read_csv(new_data_path)
        
        # Check if target column exists
        if model.target_column not in new_data.columns:
            raise ValueError(f"Target column {model.target_column} not in new data")
        
        # Prepare data
        X_new = new_data[features]
        y_new = new_data[model.target_column]
        
        # Generate predictions
        y_pred = clf.predict(X_new)
        
        # Calculate new metrics
        new_metrics = {}
        
        if model.model_type == 'classification':
            new_metrics['accuracy'] = float(accuracy_score(y_new, y_pred))
            new_metrics['precision'] = float(precision_score(y_new, y_pred, average='weighted'))
            new_metrics['recall'] = float(recall_score(y_new, y_pred, average='weighted'))
            new_metrics['f1'] = float(f1_score(y_new, y_pred, average='weighted'))
            
            # Compare key metrics
            key_metric = 'f1'
        else:
            new_metrics['mse'] = float(mean_squared_error(y_new, y_pred))
            new_metrics['mae'] = float(mean_absolute_error(y_new, y_pred))
            new_metrics['r2'] = float(r2_score(y_new, y_pred))
            
            # Compare key metrics
            key_metric = 'r2'
        
        # Calculate drift
        metric_change = baseline_metrics.get(key_metric, 0) - new_metrics.get(key_metric, 0)
        drift_detected = abs(metric_change) > drift_threshold
        
        # Save drift check results
        from tasks.email import send_alert_email
        from tasks.slack import send_alert_slack
        
        if drift_detected:
            # Update model status
            model.drift_detected = True
            model.last_drift_check = datetime.utcnow()
            db.session.commit()
            
            # Send alerts
            admin_emails = [u.email for u in model.users if u.has_role('admin')]
            if admin_emails:
                send_alert_email.delay(
                    'model_drift',
                    admin_emails,
                    model_name=model.name,
                    model_id=model_id,
                    baseline_metric=baseline_metrics.get(key_metric, 0),
                    new_metric=new_metrics.get(key_metric, 0),
                    change=metric_change,
                    severity='High' if abs(metric_change) > 2*drift_threshold else 'Medium'
                )
            
            # Send Slack alert
            slack_channel = current_app.config.get('SLACK_ALERTS_CHANNEL')
            if slack_channel:
                send_alert_slack.delay(
                    'model_drift',
                    slack_channel,
                    model_name=model.name,
                    model_id=model_id,
                    severity='High' if abs(metric_change) > 2*drift_threshold else 'Medium',
                    description=f"Model drift detected: {key_metric} changed by {metric_change:.4f}",
                    url=f"/models/{model_id}/drift"
                )
        
        logger.info(f"Drift check for model {model_id}: {'Drift detected' if drift_detected else 'No significant drift'}")
        return drift_detected
        
    except Exception as e:
        logger.error(f"Error checking drift for model {model_id}: {str(e)}")
        return False 