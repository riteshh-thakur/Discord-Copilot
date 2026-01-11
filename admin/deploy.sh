#!/bin/bash

# Back4App Deployment Script
# This script helps prepare and deploy the admin console to Back4App

set -e

echo "🚀 Starting Back4App Deployment Process..."

# Check if we're in the admin directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the admin directory"
    exit 1
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  Warning: .env.local not found"
    echo "   Make sure to set environment variables in Back4App dashboard"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building Next.js application..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Push your code to Git repository"
    echo "2. Connect your repository to Back4App"
    echo "3. Set environment variables in Back4App dashboard"
    echo "4. Deploy via Back4App dashboard or CLI"
    echo ""
    echo "📖 See docs/BACK4APP_DEPLOYMENT.md for detailed instructions"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi
