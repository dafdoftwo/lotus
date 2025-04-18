#!/bin/bash

# Ensure the script stops on first error
set -e

echo "🔥 Starting deployment to Firebase Hosting..."

# Copy the latest index.html to the public directory
echo "📄 Copying latest index.html to public directory..."
cp index.html public/

# Ensure images directory exists in public
echo "🖼️ Ensuring all media files are in place..."
mkdir -p public/images

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

# Deploy storage rules first
echo "📝 Deploying storage rules..."
firebase deploy --only storage

# Deploy to Firebase Hosting
echo "🚀 Deploying to Firebase Hosting..."
firebase deploy --only hosting

echo "✅ Deployment completed successfully!"
echo "🌐 Your website is now live at: https://lotus-48d81.web.app" 