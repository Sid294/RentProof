#!/usr/bin/env python3
"""Quick test to verify email sending works"""
import sys
sys.path.insert(0, '/Users/lakshminarayanans/rentroof/rentroof')

from backend.send_email import send_welcome_email
import time

print("Testing email sending...")
print("=" * 60)

# Test with a test email
test_email = "test@example.com"
test_name = "Test User"

print(f"Sending test email to: {test_email}")
print(f"User name: {test_name}")
print("-" * 60)

send_welcome_email(test_email, test_name)

print("-" * 60)
print("Check the logs above for any errors.")
print("If no errors appeared, the email may be in transit.")
