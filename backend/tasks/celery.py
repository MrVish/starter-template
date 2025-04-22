from celery import Celery

# Initialize Celery with Redis as broker and backend
celery = Celery(
    'modular_framework',
    broker='redis://redis:6379/0',
    backend='redis://redis:6379/0',
    include=[
        'tasks.email',
        'tasks.slack',
        'tasks.ml'
    ]
)

# Optional configuration
celery.conf.update(
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='UTC',
    enable_utc=True,
)

if __name__ == '__main__':
    celery.start() 