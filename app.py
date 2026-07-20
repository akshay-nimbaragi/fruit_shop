import os
import smtplib
from email.message import EmailMessage
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# Load .env in development if python-dotenv is available (optional)
try:
	from dotenv import load_dotenv
	load_dotenv()
except Exception:
	# dotenv not installed or .env missing - that's fine
	pass

# Optional direct configuration (edit these values here if you do NOT want to use environment variables)
# IMPORTANT: replace the placeholders below with your actual credentials.
FEEDBACK_SENDER_EMAIL = "codingwithak6@gmail.com"        # <-- your sender email (owner)
FEEDBACK_APP_PASSWORD = "eljdepjcjioexvft"              # <-- your Gmail app password
FEEDBACK_TO_EMAIL = "codingwithak6@gmail.com"           # <-- recipient (owner)

# Static fruits data (no DB)
FRUITS = [
	{"id": "apple", "name": "Apple", "price": 60, "image": "apple.svg"},
	{"id": "banana", "name": "Banana", "price": 50, "image": "banana.svg"},
	{"id": "orange", "name": "Orange", "price": 60, "image": "orange.svg"},
	{"id": "papaya", "name": "Papaya", "price": 70, "image": "papaya.svg"},
	{"id": "watermelon", "name": "Watermelon", "price": 80, "image": "watermelon.svg"},
]

@app.route("/")
def home():
	return render_template("index.html")

@app.route("/fruits")
def fruits():
	return render_template("fruits.html", fruits=FRUITS)

@app.route("/order", methods=["GET", "POST"])
def order():
	success = False
	if request.method == "POST":
		# Simple server-side guard (still not storing anything)
		name = request.form.get("name", "").strip()
		mobile = request.form.get("mobile", "").strip()
		fruit = request.form.get("fruit", "")
		quantity = request.form.get("quantity", "").strip()
		address = request.form.get("address", "").strip()
		if name and mobile and fruit and quantity and address:
			# In a real app we'd save or process; here we just show success
			success = True
	return render_template("order.html", fruits=FRUITS, success=success)

@app.route("/contact", methods=["GET", "POST"])
def contact():
	# Contact form: frontend demo + sending feedback via SMTP
	success = False
	error = None
	if request.method == "POST":
		name = request.form.get("name", "").strip()
		email = request.form.get("email", "").strip()
		message = request.form.get("message", "").strip()
		if not (name and email and message):
			error = "Please fill in all fields."
		else:
			# Use the config values declared at top of file
			SENDER = FEEDBACK_SENDER_EMAIL
			APP_PASS = FEEDBACK_APP_PASSWORD
			TO = FEEDBACK_TO_EMAIL

			app.logger.debug("Feedback email config: sender=%s, to=%s", bool(SENDER), bool(TO))

			if not (SENDER and APP_PASS):
				error = ("Email sending is not configured. Open app.py and set FEEDBACK_SENDER_EMAIL "
					"and FEEDBACK_APP_PASSWORD near the top of the file.")
			else:
				# Prepare email with helpful metadata
				msg = EmailMessage()
				msg["Subject"] = f"[Fruit Shop] Feedback from {name}"
				msg["From"] = SENDER
				msg["To"] = TO
				msg["Reply-To"] = email

				meta = (
					f"Sender IP: {request.remote_addr}\n"
					f"User-Agent: {request.headers.get('User-Agent')}\n"
				)
				msg.set_content(f"Name: {name}\nEmail: {email}\n\nMessage:\n{message}\n\n---\n{meta}")

				try:
					with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
						smtp.login(SENDER, APP_PASS)
						smtp.send_message(msg)
					success = True
				except Exception:
					app.logger.exception("Failed to send feedback email")
					error = "Failed to send feedback. Check server logs and verify credentials (app password, 2FA, SMTP)."

	# If AJAX request, return JSON so contact.js can update UI
	if request.headers.get("X-Requested-With") == "XMLHttpRequest":
		return jsonify({"success": success, "error": error})
	return render_template("contact.html", success=success, error=error)

# New: simple test endpoint to verify email sending from this server
@app.route("/test-email")
def test_email():
	result = {"success": False, "error": None}
	SENDER = FEEDBACK_SENDER_EMAIL
	APP_PASS = FEEDBACK_APP_PASSWORD
	TO = FEEDBACK_TO_EMAIL
	if not (SENDER and APP_PASS):
		result["error"] = "Email credentials not set in app.py."
		return jsonify(result), 400
	try:
		msg = EmailMessage()
		msg["Subject"] = "[Fruit Shop] Test email"
		msg["From"] = SENDER
		msg["To"] = TO
		msg.set_content("This is a test email sent from the Fruit Shop application to verify SMTP configuration.")
		with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
			smtp.login(SENDER, APP_PASS)
			smtp.send_message(msg)
		result["success"] = True
		return jsonify(result)
	except Exception as e:
		app.logger.exception("Test email failed")
		result["error"] = str(e)
		return jsonify(result), 500

if __name__ == "__main__":
	# Debug mode for development
	app.run(debug=True)
