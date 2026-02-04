#!/bin/bash

# Mkulima Sharp Deployment Script
# Run this script to build and deploy the application

set -e  # Exit on error

echo "🚀 Mkulima Sharp Deployment Script"
echo "=================================="
echo ""

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null
then
    echo "Firebase CLI is not installed."
    echo "Install it with: npm install -g firebase-tools"
    exit 1
fi

# Check if logged in to Firebase
if ! firebase projects:list &> /dev/null
then
    echo "Not logged in to Firebase."
    echo "Run: firebase login"
    exit 1
fi

echo " Firebase CLI detected"
echo ""

# Ask for deployment type
echo "Select deployment type:"
echo "1) Full deployment (hosting + functions)"
echo "2) Hosting only"
echo "3) Functions only"
echo "4) Firestore rules only"
read -p "Enter choice [1-4]: " choice

case $choice in
    1)
        DEPLOY_TARGET="full"
        ;;
    2)
        DEPLOY_TARGET="hosting"
        ;;
    3)
        DEPLOY_TARGET="functions"
        ;;
    4)
        DEPLOY_TARGET="firestore"
        ;;
    *)
        echo "Invalid choice. Exiting."
        exit 1
        ;;
esac

echo ""
echo "📦 Building frontend..."
npm run build

if [ $? -ne 0 ]; then
    echo "Build failed. Please fix errors and try again."
    exit 1
fi

echo " Build successful"
echo ""

# Deploy based on selection
case $DEPLOY_TARGET in
    full)
        echo "🚀 Deploying everything..."
        firebase deploy
        ;;
    hosting)
        echo "🚀 Deploying hosting only..."
        firebase deploy --only hosting
        ;;
    functions)
        echo "🚀 Deploying functions only..."
        echo "Installing function dependencies..."
        cd functions && npm install && cd ..
        firebase deploy --only functions
        ;;
    firestore)
        echo "🚀 Deploying Firestore rules..."
        firebase deploy --only firestore:rules
        ;;
esac

if [ $? -eq 0 ]; then
    echo ""
    echo " Deployment successful!"
    echo ""
    echo "🌐 Your site is live at:"
    firebase hosting:channel:list | grep "live" | awk '{print $2}'
    echo ""
    echo "📊 View your project:"
    echo "https://console.firebase.google.com"
else
    echo ""
    echo "Deployment failed. Check the errors above."
    exit 1
fi
