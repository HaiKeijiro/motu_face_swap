# Google Drive Integration Setup Guide

This guide will help you set up Google Drive integration for the Face Swap application. With this integration, generated face-swapped images will be automatically uploaded to Google Drive and users can access them via QR codes.

## Features

- **Automatic Upload**: Face-swapped images are automatically uploaded to Google Drive
- **Public Gallery**: Creates a public "Face Swap Gallery" folder in Google Drive
- **QR Code Generation**: Generates QR codes for easy access to the gallery
- **Fallback Support**: The app works without Google Drive if not configured

## Prerequisites

- A Google account
- Google Cloud Console access
- Python 3.7+ with required dependencies

## Step 1: Create Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Note down your project ID

## Step 2: Enable Google Drive API

1. In the Google Cloud Console, go to **APIs & Services** > **Library**
2. Search for "Google Drive API"
3. Click on "Google Drive API" and click **Enable**

## Step 3: Create OAuth 2.0 Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth client ID**
3. If prompted, configure the OAuth consent screen:
   - Choose **External** user type
   - Fill in the required fields:
     - App name: "Face Swap Gallery"
     - User support email: Your email
     - Developer contact information: Your email
   - Add scopes: `../auth/drive.file`
   - Add test users (your email) if needed
4. For Application type, select **Desktop application**
5. Give it a name like "Face Swap Desktop Client"
6. Click **Create**

## Step 4: Download Credentials

1. After creating the OAuth client, click the download button (⬇️)
2. Save the downloaded JSON file as `credentials.json` in the `server/` directory
3. The file should look like this:

```json
{
  "installed": {
    "client_id": "your-client-id.apps.googleusercontent.com",
    "project_id": "your-project-id",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_secret": "your-client-secret",
    "redirect_uris": ["http://localhost"]
  }
}
```

## Step 5: Install Dependencies

Make sure you have the required Python packages installed:

```bash
cd server
pip install -r requirements.txt
```

## Step 6: Test the Setup

Run the credentials setup script to test your configuration:

```bash
cd server
python credentials_setup.py
```

This script will:
- Check if `credentials.json` exists
- Guide you through the OAuth authentication flow
- Test Google Drive access
- Create a `token.json` file for future use

## Step 7: First-Time Authentication

1. When you first run the server or the setup script, a web browser will open
2. Sign in with your Google account
3. Grant permissions to the Face Swap application
4. The authentication token will be saved automatically

## Step 8: Start the Server

```bash
cd server
python app.py
```

The server will now have Google Drive integration enabled!

## How It Works

### For Users
1. User creates a face-swapped image
2. The image is automatically uploaded to Google Drive
3. A QR code is generated that links to the public gallery
4. Users can scan the QR code to access their image online

### For Developers
- Images are uploaded to a "Face Swap Gallery" folder in Google Drive
- Each image gets a unique filename with timestamp
- The folder and all images are made publicly viewable
- QR codes link to the gallery folder, not individual images

## Configuration Files

### `credentials.json`
Contains OAuth 2.0 client credentials from Google Cloud Console.

### `token.json`
Contains the authentication token (created automatically after first login).

### `config.ini`
The main application configuration file. Google Drive settings are not stored here as they use separate credential files.

## Troubleshooting

### Common Issues

1. **"Google Drive integration disabled" message**
   - Check if `credentials.json` exists in the server directory
   - Run `python credentials_setup.py` to test the setup

2. **Authentication errors**
   - Delete `token.json` and re-run the authentication process
   - Check that the OAuth consent screen is properly configured

3. **Permission errors**
   - Ensure the Google Drive API is enabled in Google Cloud Console
   - Check that the OAuth client has the correct scopes

4. **QR code not showing**
   - Check server logs for Google Drive upload errors
   - Verify that the face swap completed successfully

### Logs and Debugging

Check the server logs for detailed error messages:
- Google Drive operations are logged with INFO level
- Errors are logged with ERROR level
- The log file is `faceswap_server.log`

### Disabling Google Drive Integration

If you want to run the application without Google Drive:
1. Remove or rename `credentials.json`
2. The application will automatically fall back to local-only mode
3. QR code functionality will show "not available" message

## Security Considerations

- Keep `credentials.json` secure and never commit it to version control
- The `token.json` file contains sensitive authentication data
- Images uploaded to Google Drive are made publicly viewable
- Consider setting up folder permissions and access controls as needed

## Support

If you encounter issues:
1. Check the server logs (`faceswap_server.log`)
2. Run the credentials setup script for detailed error messages
3. Verify your Google Cloud Console configuration
4. Ensure all dependencies are properly installed

## File Structure

```
server/
├── app.py                 # Main server application
├── credentials.json       # Google OAuth credentials (you create this)
├── token.json            # Authentication token (auto-generated)
├── credentials_setup.py   # Setup and testing script
├── config.ini            # Main application config
└── requirements.txt       # Python dependencies
```

This integration enhances the Face Swap application by providing cloud storage and easy sharing capabilities through QR codes, making it perfect for events, photo booths, and social sharing! 