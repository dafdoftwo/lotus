#!/bin/bash

# Ensure the script stops on first error
set -e

echo "🔥 Starting deployment to Firebase Hosting..."

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "Firebase CLI is not installed. Installing now..."
    npm install -g firebase-tools
fi

# Login to Firebase (if not already logged in)
echo "🔐 Checking Firebase login status..."
firebase login --no-localhost

# Select project
echo "📦 Using project: lotus-48d81"
firebase use lotus-48d81

# Deploy to Firebase Hosting only
echo "🚀 Deploying to Firebase Hosting..."
firebase deploy --only hosting

echo "✅ Deployment completed successfully!"
echo "🌐 Your website is now live at: https://lotus-48d81.web.app" 