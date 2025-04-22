import logging
from celery import shared_task
from slack_sdk import WebClient
from slack_sdk.errors import SlackApiError
from flask import current_app

logger = logging.getLogger(__name__)

@shared_task(bind=True, max_retries=3)
def send_slack_message(self, channel, message, blocks=None):
    """
    Send a message to a Slack channel
    
    Args:
        channel: Slack channel ID or name
        message: Message text
        blocks: Slack blocks for rich formatting
    """
    try:
        slack_token = current_app.config.get('SLACK_API_TOKEN')
        if not slack_token:
            logger.error("Slack API token not configured")
            return False
        
        client = WebClient(token=slack_token)
        
        # Send message
        response = client.chat_postMessage(
            channel=channel,
            text=message,
            blocks=blocks
        )
        
        logger.info(f"Message sent to Slack channel {channel}")
        return True
    except SlackApiError as e:
        logger.error(f"Failed to send Slack message: {str(e)}")
        self.retry(exc=e, countdown=60)  # Retry after 1 minute
        return False

@shared_task
def send_alert_slack(alert_type, channel, **data):
    """
    Send an alert to Slack
    
    Args:
        alert_type: Type of alert (model_drift, security, system, etc.)
        channel: Slack channel ID or name
        **data: Alert data
    """
    
    # Format message based on alert type
    if alert_type == 'model_drift':
        message = f"⚠️ *Model Drift Alert*: {data.get('model_name', 'Unknown model')}"
        blocks = [
            {
                "type": "header",
                "text": {
                    "type": "plain_text",
                    "text": "🔔 Model Drift Alert",
                    "emoji": True
                }
            },
            {
                "type": "section",
                "fields": [
                    {
                        "type": "mrkdwn",
                        "text": f"*Model:*\n{data.get('model_name', 'Unknown')}"
                    },
                    {
                        "type": "mrkdwn",
                        "text": f"*Severity:*\n{data.get('severity', 'Medium')}"
                    }
                ]
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": f"*Drift Details:*\n{data.get('description', 'No details available')}"
                }
            },
            {
                "type": "actions",
                "elements": [
                    {
                        "type": "button",
                        "text": {
                            "type": "plain_text",
                            "text": "View Details",
                            "emoji": True
                        },
                        "url": data.get('url', '#')
                    }
                ]
            }
        ]
    elif alert_type == 'system':
        message = f"🔧 *System Alert*: {data.get('alert_name', 'System issue')}"
        blocks = [
            {
                "type": "header",
                "text": {
                    "type": "plain_text",
                    "text": "🔧 System Alert",
                    "emoji": True
                }
            },
            {
                "type": "section",
                "fields": [
                    {
                        "type": "mrkdwn",
                        "text": f"*Alert:*\n{data.get('alert_name', 'System issue')}"
                    },
                    {
                        "type": "mrkdwn",
                        "text": f"*Severity:*\n{data.get('severity', 'Medium')}"
                    }
                ]
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": f"*Details:*\n{data.get('description', 'No details available')}"
                }
            }
        ]
    else:
        message = f"*Alert*: {data.get('alert_name', 'Unknown alert')}"
        blocks = None
    
    return send_slack_message.delay(channel, message, blocks) 