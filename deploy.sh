#!/bin/bash

# Ensure the script stops on first error
set -e

echo "🔥 Starting deployment to Firebase..."

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

# Deploy to Firebase
echo "🚀 Deploying to Firebase..."
firebase deploy

echo "✅ Deployment completed successfully!"
echo "🌐 Your website is now live at: https://lotus-48d81.web.app" 