import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from core.config import settings

def send_email(to_email: str, subject: str, html_content: str):
    """
    Sends an HTML email to a user. Falls back to console printing
    if SMTP credentials are not configured in the settings.
    """
    if not settings.SMTP_HOST or not settings.SMTP_USER or not settings.SMTP_PASSWORD:
        print("\n=== [MOCK EMAIL SENT] ===")
        print(f"To: {to_email}")
        print(f"Subject: {subject}")
        print(f"Body: {html_content[:500]}...")
        print("==========================\n")
        return True

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = settings.SMTP_FROM
        msg["To"] = to_email

        part = MIMEText(html_content, "html")
        msg.attach(part)

        # Connect to SMTP server
        server = smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT)
        server.starttls()
        server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
        server.sendmail(settings.SMTP_FROM, to_email, msg.as_string())
        server.quit()
        print(f"Successfully sent email to {to_email} with subject: {subject}")
        return True
    except Exception as e:
        print(f"Error sending email to {to_email}: {e}")
        return False
