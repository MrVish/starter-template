# Initialize Celery for async tasks
from celery import Celery

def make_celery(app=None):
    """
    Create a Celery instance for the Flask app
    
    Args:
        app: Flask app instance
        
    Returns:
        Celery instance
    """
    # Create Celery app
    celery = Celery(
        app.import_name if app else 'modular_framework',
        broker=app.config['CELERY_BROKER_URL'] if app else 'redis://localhost:6379/0',
        backend=app.config['CELERY_RESULT_BACKEND'] if app else 'redis://localhost:6379/0',
        include=[
            'tasks.email',
            'tasks.slack',
            'tasks.ml'
        ]
    )
    
    # Update Celery config from Flask app config
    if app:
        celery.conf.update(app.config)
        
        # Create TaskBase class with Flask app context
        class ContextTask(celery.Task):
            def __call__(self, *args, **kwargs):
                with app.app_context():
                    return self.run(*args, **kwargs)
        
        celery.Task = ContextTask
    
    return celery 