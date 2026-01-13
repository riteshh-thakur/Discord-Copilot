#!/bin/bash

# Discord Copilot - Unified Start Script
# Starts both admin console and Discord bot from project root

echo "🚀 Starting Discord Copilot System..."

# Check if we're in the project root
if [ ! -f "package.json" ] || [ ! -d "bot" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Check for environment file
if [ ! -f ".env.local" ] && [ ! -f ".env" ]; then
    echo "⚠️  Warning: No .env.local or .env file found"
    echo "   Create one from .env.example template"
    echo "   Continuing anyway..."
fi

# Check if builds exist
if [ ! -d ".next" ]; then
    echo "🏗️ Admin console not built. Building now..."
    npm run build:admin
fi

if [ ! -d "bot/dist" ]; then
    echo "🤖 Bot not built. Building now..."
    npm run build:bot
fi

# Start both services
echo "🌟 Starting admin console and bot..."
echo "  - Admin Console: http://localhost:3000"
echo "  - Discord Bot: Starting in background"
echo ""
echo "Press Ctrl+C to stop both services"

# Use concurrently to run both services
npm run dev
