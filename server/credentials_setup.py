#!/usr/bin/env python3
"""
Google Drive Credentials Setup Script
====================================

This script helps you set up Google Drive API credentials for the Face Swap application.
Follow these steps to get your credentials:

1. Go to the Google Cloud Console (https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Drive API
4. Create credentials (OAuth 2.0 Client IDs) for a desktop application
5. Download the credentials JSON file and save it as 'credentials.json' in the server directory

This script will help you test the authentication flow.
"""

import os
import json
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

SCOPES = ['https://www.googleapis.com/auth/drive.file']
CREDENTIALS_FILE = 'credentials.json'
TOKEN_FILE = 'token.json'

def setup_credentials():
    """Set up Google Drive credentials."""
    print("Google Drive Credentials Setup")
    print("=" * 40)
    
    # Check if credentials file exists
    if not os.path.exists(CREDENTIALS_FILE):
        print(f"❌ Error: {CREDENTIALS_FILE} not found!")
        print("\nPlease follow these steps:")
        print("1. Go to https://console.cloud.google.com/")
        print("2. Create a project or select existing one")
        print("3. Enable Google Drive API")
        print("4. Create OAuth 2.0 credentials for desktop application")
        print("5. Download the JSON file and save it as 'credentials.json'")
        return False
    
    print(f"✅ Found {CREDENTIALS_FILE}")
    
    # Try to load existing token
    creds = None
    if os.path.exists(TOKEN_FILE):
        try:
            creds = Credentials.from_authorized_user_file(TOKEN_FILE, SCOPES)
            print(f"✅ Found existing {TOKEN_FILE}")
        except Exception as e:
            print(f"⚠️  Existing token file is invalid: {e}")
    
    # If there are no (valid) credentials available, let the user log in
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            print("🔄 Refreshing expired token...")
            try:
                creds.refresh(Request())
                print("✅ Token refreshed successfully")
            except Exception as e:
                print(f"❌ Failed to refresh token: {e}")
                creds = None
        
        if not creds:
            print("🔐 Starting authentication flow...")
            try:
                flow = InstalledAppFlow.from_client_secrets_file(
                    CREDENTIALS_FILE, SCOPES)
                creds = flow.run_local_server(port=0)
                print("✅ Authentication successful!")
            except Exception as e:
                print(f"❌ Authentication failed: {e}")
                return False
        
        # Save the credentials for the next run
        try:
            with open(TOKEN_FILE, 'w') as token:
                token.write(creds.to_json())
            print(f"✅ Saved credentials to {TOKEN_FILE}")
        except Exception as e:
            print(f"❌ Failed to save credentials: {e}")
            return False
    
    # Test the credentials
    print("🧪 Testing Google Drive access...")
    try:
        service = build('drive', 'v3', credentials=creds)
        
        # Test by listing files (limited to 1 for speed)
        results = service.files().list(pageSize=1, fields="files(id, name)").execute()
        print("✅ Google Drive access confirmed!")
        
        return True
        
    except Exception as e:
        print(f"❌ Failed to access Google Drive: {e}")
        return False

def create_sample_credentials():
    """Create a sample credentials.json file template."""
    sample_creds = {
        "installed": {
            "client_id": "YOUR_CLIENT_ID.apps.googleusercontent.com",
            "project_id": "your-project-id",
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
            "client_secret": "YOUR_CLIENT_SECRET",
            "redirect_uris": ["http://localhost"]
        }
    }
    
    try:
        with open('credentials_template.json', 'w') as f:
            json.dump(sample_creds, f, indent=2)
        print("✅ Created credentials_template.json")
        print("   Replace the placeholder values with your actual credentials")
        print("   Then rename it to credentials.json")
    except Exception as e:
        print(f"❌ Failed to create template: {e}")

def main():
    """Main function."""
    print("Google Drive Integration Setup for Face Swap App")
    print("=" * 50)
    
    if not os.path.exists(CREDENTIALS_FILE):
        print(f"\n{CREDENTIALS_FILE} not found. Creating template...")
        create_sample_credentials()
        print("\nPlease set up your Google Drive credentials and try again.")
        return
    
    success = setup_credentials()
    
    if success:
        print("\n🎉 Setup completed successfully!")
        print("Your Face Swap app is now ready to upload images to Google Drive.")
    else:
        print("\n❌ Setup failed. Please check the errors above and try again.")

if __name__ == '__main__':
    main() 