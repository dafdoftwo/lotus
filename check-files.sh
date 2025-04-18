#!/bin/bash

# Check files before deployment

echo "🔍 Checking essential files for Firebase deployment..."

# Check if index.html exists in the root and public directory
if [ -f "index.html" ]; then
  echo "✅ index.html exists in root directory"
else
  echo "❌ index.html is missing from root directory"
  exit 1
fi

if [ -f "public/index.html" ]; then
  echo "✅ index.html exists in public directory"
else
  echo "⚠️ index.html is missing from public directory - it will be copied during deployment"
fi

# Check for images directory
if [ -d "public/images" ]; then
  echo "✅ Images directory exists"
  # Count images
  IMAGE_COUNT=$(find public/images -type f | wc -l)
  echo "📊 Found $IMAGE_COUNT image files"
else
  echo "❌ Images directory is missing!"
  exit 1
fi

# Check for videos
VIDEO_COUNT=$(find public -name "*.mp4" -o -name "*.webm" -o -name "*.avi" -o -name "*.mov" | wc -l)
if [ $VIDEO_COUNT -gt 0 ]; then
  echo "✅ Found $VIDEO_COUNT video files"
else
  echo "⚠️ No video files found - this may be normal if your site doesn't use videos"
fi

# Check for CSS files
CSS_COUNT=$(find public -name "*.css" | wc -l)
if [ $CSS_COUNT -gt 0 ]; then
  echo "✅ Found $CSS_COUNT CSS files"
else
  echo "❌ No CSS files found - this is unusual"
  exit 1
fi

# Check for JavaScript files
JS_COUNT=$(find public -name "*.js" | wc -l)
if [ $JS_COUNT -gt 0 ]; then
  echo "✅ Found $JS_COUNT JavaScript files"
else
  echo "❌ No JavaScript files found - this is unusual"
  exit 1
fi

# Check Firebase configuration files
if [ -f "firebase.json" ]; then
  echo "✅ firebase.json exists"
else
  echo "❌ firebase.json is missing"
  exit 1
fi

if [ -f ".firebaserc" ]; then
  echo "✅ .firebaserc exists"
else
  echo "❌ .firebaserc is missing"
  exit 1
fi

if [ -f "storage.rules" ]; then
  echo "✅ storage.rules exists"
else
  echo "❌ storage.rules is missing"
  exit 1
fi

echo "🎉 All essential files are present! Ready for deployment." 