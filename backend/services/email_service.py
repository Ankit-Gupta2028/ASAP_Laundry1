import aiosmtplib
from email.message import EmailMessage
from core.config import settings

async def send_email(subject: str, receiver_email: str, body: str):
    message = EmailMessage()
    message["From"] = settings.SMTP_EMAIL
    message["To"] = receiver_email
    message["Subject"] = subject
    message.set_content(body)

    try:
        # Determine TLS settings based on SMTP port
        use_tls = settings.SMTP_PORT == 465
        start_tls = settings.SMTP_PORT == 587

        await aiosmtplib.send(
            message,
            hostname=settings.SMTP_SERVER,
            port=settings.SMTP_PORT,
            username=settings.SMTP_EMAIL,
            password=settings.SMTP_PASSWORD_APP,
            use_tls=use_tls,
            start_tls=start_tls,
        )
        print(f"Successfully sent email to {receiver_email}")
        return True
    except Exception as e:
        print(f"Error sending email to {receiver_email}. Note: Ensure you are using a 16-digit Google App Password if using Gmail. Error details: {e}")
        return False

async def send_otp_email(receiver_email: str, otp: str):
    subject = "Laundry App - Your Login OTP"
    body = f"Hello,\n\nYour OTP for login is: {otp}\n\nIt is valid for 10 minutes.\n\nThanks,\nLaundry App Team"
    return await send_email(subject, receiver_email, body)

async def send_receipt_email(receiver_email: str, laundry_details: str):
    subject = "Laundry App - Order Receipt"
    body = f"Hello,\n\nYour laundry order has been approved with the following details:\n\n{laundry_details}\n\nThanks,\nLaundry App Team"
    return await send_email(subject, receiver_email, body)

async def send_ready_for_pickup_email(receiver_email: str, order_id: str):
    subject = "Laundry App - Laundry Ready for Pickup"
    body = f"Hello,\n\nYour laundry order {order_id} is ready for pickup. Please collect it from the laundry center.\n\nThanks,\nLaundry App Team"
    return await send_email(subject, receiver_email, body)

async def send_collection_confirmation(receiver_email: str, order_id: str):
    subject = "Laundry App - Pickup Confirmed"
    body = f"Hello,\n\nYour laundry order {order_id} has been marked as picked up. Thank you!\n\nThanks,\nLaundry App Team"
    return await send_email(subject, receiver_email, body)
