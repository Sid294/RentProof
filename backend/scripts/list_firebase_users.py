#!/usr/bin/env python3
"""List all Firebase Authentication users"""
import sys
import os

# Add parent directory to path so we can import firebase_admin
sys.path.insert(0, '/Users/lakshminarayanans/rentroof/rentroof')

try:
    import firebase_admin
    from firebase_admin import credentials, auth
    
    # Try to initialize Firebase
    if not firebase_admin.get_app():
        # You'll need to set the GOOGLE_APPLICATION_CREDENTIALS environment variable
        # or provide the path to your service account key
        print("Firebase not initialized. Looking for credentials...")
        
    # List all users
    print("Fetching Firebase users...")
    users = auth.list_users().iterate_all()
    
    user_list = list(users)
    print(f"\nTotal users in Firebase: {len(user_list)}")
    print("="*60)
    
    for user in user_list:
        print(f"UID: {user.uid}")
        print(f"Email: {user.email}")
        print(f"Display Name: {user.display_name}")
        print(f"Created: {user.user_metadata.creation_timestamp}")
        print(f"Last Sign In: {user.user_metadata.last_sign_in_timestamp}")
        print("-"*60)
        
except ImportError:
    print("firebase-admin not installed. Installing...")
    os.system("pip install firebase-admin")
    print("\nPlease run this script again.")
except Exception as e:
    print(f"Error: {str(e)}")
    print("\nTo use this script, you need to:")
    print("1. Set GOOGLE_APPLICATION_CREDENTIALS environment variable")
    print("2. Or provide the path to your Firebase service account key")
    print("\nOr check the Firebase Console at: https://console.firebase.google.com")
