import os
import logging
from celery import shared_task
from flask import current_app, render_template
from flask_mail import Message, Mail

logger = logging.getLogger(__name__)

def get_mail_instance():
    """Get or create a Mail instance"""
    if 'mail' not in current_app.extensions:
        mail = Mail(current_app)
        return mail
    return current_app.extensions['mail']

@shared_task(bind=True, max_retries=3)
def send_email(self, subject, recipients, template_name, **context):
    """
    Send an email using a template
    
    Args:
        subject: Email subject
        recipients: List of recipient email addresses
        template_name: Name of the email template
        **context: Variables to pass to the template
    """
    try:
        mail = get_mail_instance()
        
        # Create message
        msg = Message(
            subject=subject,
            recipients=recipients,
            sender=current_app.config.get('MAIL_DEFAULT_SENDER')
        )
        
        # Render HTML body from template
        template_path = f"emails/{template_name}.html"
        msg.html = render_template(template_path, **context)
        
        # Render plain text body from template if available
        text_template_path = f"emails/{template_name}.txt"
        if os.path.exists(os.path.join(current_app.template_folder, text_template_path)):
            msg.body = render_template(text_template_path, **context)
        
        # Send email
        mail.send(msg)
        
        logger.info(f"Email sent to {recipients}: {subject}")
        return True
    except Exception as e:
        logger.error(f"Failed to send email: {str(e)}")
        self.retry(exc=e, countdown=60 * 5)  # Retry after 5 minutes
        return False

@shared_task
def send_alert_email(alert_type, recipients, **data):
    """
    Send an alert email
    
    Args:
        alert_type: Type of alert (model_drift, security, system, etc.)
        recipients: List of recipient email addresses
        **data: Alert data
    """
    # Map alert types to templates and subjects
    alert_templates = {
        'model_drift': {
            'template': 'model_drift_alert',
            'subject': 'Model Drift Alert: {model_name}'
        },
        'system': {
            'template': 'system_alert',
            'subject': 'System Alert: {alert_name}'
        },
        'security': {
            'template': 'security_alert',
            'subject': 'Security Alert: {alert_name}'
        }
    }
    
    if alert_type not in alert_templates:
        logger.error(f"Unknown alert type: {alert_type}")
        return False
    
    template_info = alert_templates[alert_type]
    template_name = template_info['template']
    subject = template_info['subject'].format(**data)
    
    return send_email.delay(subject, recipients, template_name, **data) 