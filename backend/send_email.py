import logging
import smtplib as sb
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import backend.email_secrets as es

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def send_welcome_email(to_email: str, name: str = "") -> None:
	"""Send a welcome email to a new user. Safe to call from a background task.

	This function intentionally performs all SMTP work when invoked so the
	module import is side-effect free.
	"""
	try:
		print(f"\n{'='*60}")
		print(f"[EMAIL] Starting welcome email send to {to_email}")
		print(f"{'='*60}")
		logger.info(f"Starting welcome email send to {to_email}")
		email_address, email_password = es.data()

		msg = MIMEMultipart()
		msg['From'] = email_address
		msg['To'] = to_email
		msg['Subject'] = "Welcome to RentProof - Your Property Management Platform"

		content = f"""Dear {name or 'Valued User'},

Thank you for joining RentProof. We're excited to have you as part of our community.

RentProof is your comprehensive property management platform designed to streamline operations, enhance communication with tenants, and provide real-time insights into your rental portfolio.

KEY FEATURES

Property Management Dashboard
  • Centralized view of all your properties and units
  • Detailed property analytics and performance metrics
  • Easy multi-property management

Tenant Portal & Communication
  • Secure tenant portal for lease management
  • Streamlined rent payment processing
  • Maintenance request tracking system
  • Direct communication channels

Documentation & Compliance
  • Digital lease storage and management
  • Document organization and accessibility
  • Audit trail for all transactions

GETTING STARTED

1. Log in to your dashboard at https://rentproof.app
2. Add your first property with unit details
3. Invite tenants via direct links
4. Upload and organize lease agreements
5. Begin managing rent and maintenance requests

NEED HELP?

Our support team is here to assist you. Visit our Help Center or contact us at rentproof.support@gmail.com for any questions or technical support.

Best regards,
The RentProof Team
https://rentproof.app"""

		msg.attach(MIMEText(content, 'plain'))

		print(f"[EMAIL] Connecting to SMTP server for {email_address}...")
		logger.info(f"Connecting to SMTP server for {email_address}...")
		server = sb.SMTP('smtp.gmail.com', 587)
		server.starttls()
		print(f"[EMAIL] Authenticating...")
		logger.info(f"Authenticating...")
		server.login(email_address, email_password)
		print(f"[EMAIL] Sending email to {to_email}...")
		logger.info(f"Sending email to {to_email}...")
		server.send_message(msg)
		server.quit()
		print(f"[EMAIL] ✓ Email sent successfully to {to_email}")
		logger.info(f"✓ Email sent successfully to {to_email}")

	except Exception as e:
		print(f"[EMAIL] ✗ Failed to send welcome email to {to_email}: {str(e)}")
		logger.exception(f"✗ Failed to send welcome email to {to_email}: {str(e)}")
		# swallow exceptions so background tasks don't crash the app
		return
