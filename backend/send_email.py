import smtplib as sb
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

email_address = "rentproof.support@gmail.com"
email_password = "yivl woxd utut dcei"

msg = MIMEMultipart()
msg['From'] = email_address
msg['To'] = "siddharth.lakshminarayanan@gmail.com"
msg['Subject'] = "Welcome to RentProof!"

content = """
\033[1mHi there 👋\033[0m

Welcome to RentProof!

We're excited to have you on board 🚀

RentProof is your all-in-one property operating system designed to help landlords and property managers stay organized and in control.

Here’s what you can do inside RentProof:

🏠 Manage all your properties in one dashboard  
👥 Track tenants and their details  
💰 Monitor rent payments and statusx
📄 Organize lease information
⚡ Get real-time updates


---

## Getting Started

1. Log in to your dashboard  
2. Add your first property  
3. Start tracking tenants and rent
4. Start living your best landlord life!  

---

If you have any questions or feedback, feel free to reach out (this inbox is monitored).

We're excited to see what you accomplish with RentProof.

Welcome aboard! 🚀

— The RentProof Team
"""

msg.attach(MIMEText(content, 'plain'))

server = sb.SMTP('smtp.gmail.com', 587)
server.starttls()
server.login(email_address, email_password)

server.send_message(msg)
server.quit()