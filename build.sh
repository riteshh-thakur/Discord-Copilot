#!/bin/bash

# Discord Copilot - Unified Build Script
# Builds both admin console and Discord bot from project root

echo "🚀 Building Discord Copilot System..."

# Check if we're in the project root
if [ ! -f "package.json" ] || [ ! -d "bot" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Check for environment file
if [ ! -f ".env.local" ] && [ ! -f ".env" ]; then
    echo "⚠️  Warning: No .env.local or .env file found"
    echo "   Create one from .env.example template"
fi

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf .next bot/dist

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build admin console
echo "🏗️ Building admin console..."
npm run build:admin

# Build bot
echo "🤖 Building bot..."
npm run build:bot

echo "✅ Build complete!"
echo ""
echo "📋 Build Results:"
echo "  - Admin Console: Built in .next/"
echo "  - Discord Bot: Built in bot/dist/"
echo ""
echo "🚀 To start the system:"
echo "  - Both services: npm run dev"
echo "  - Admin only: npm run dev:admin"
echo "  - Bot only: npm run dev:bot"
echo "  - Production: npm run start"
echo "  - Or simply: ./start.sh"
