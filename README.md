# Discord Copilot - Unified Project

A Discord bot management system with a web admin dashboard. This unified project allows you to run both the admin console and Discord bot with single commands from the project root.

## Features

- **Admin Dashboard**: Next.js portal for bot management
- **Discord Bot**: AI-powered Discord bot with RAG capabilities
- **Knowledge Management**: Upload and manage knowledge documents
- **Memory System**: Conversation memory and context tracking
- **Real-time Control**: Start/stop bot, monitor status
- **Auto-start**: Bot starts automatically on admin login
- **Unified Commands**: Single commands to build and run everything

## Quick Start

### 1. Setup (First Time)
```bash
# Install all dependencies
make install

# Build both admin and bot
make build:all

# Start both services
make dev:all
```

### 2. Using Scripts (Easiest)
```bash
# Build everything
./build.sh

# Start everything
./start.sh
```

### 3. Environment Setup
Create `.env.local` in the project root (see `ENV_TEMPLATE.md` for full template):
```env
# Back4App Configuration
BACK4APP_APP_ID=your_back4app_app_id
BACK4APP_MASTER_KEY=your_back4app_master_key
BACK4APP_SERVER_URL=https://parseapi.back4app.com
NEXT_PUBLIC_BACK4APP_APP_ID=your_back4app_app_id
NEXT_PUBLIC_BACK4APP_JS_KEY=your_back4app_javascript_key
NEXT_PUBLIC_BACK4APP_SERVER_URL=https://parseapi.back4app.com

# Discord Bot
DISCORD_BOT_TOKEN=your_discord_bot_token
DISCORD_CHANNEL_IDS=channel_id_1,channel_id_2

# OpenRouter API
OPENROUTER_API_KEY=your_openrouter_api_key

# Admin Authentication
NEXT_PUBLIC_ADMIN_USERNAME=admin
NEXT_PUBLIC_ADMIN_PASSWORD=your_password

# Environment
NODE_ENV=development
```

**Note**: Both admin console and bot use the same `.env.local` file from the project root.

### 4. Access Admin Portal
- URL: http://localhost:3000
- Login: `admin` / `your_password`
- Bot auto-starts on successful login

## Project Structure

```
brief1/                           # Project root
├── src/                          # Next.js admin console source
│   ├── app/                      # App Router pages
│   ├── components/               # React components
│   └── lib/                      # Utilities and services
├── bot/                          # Discord bot source
│   ├── src/                      # Bot TypeScript source
│   └── dist/                     # Compiled bot output
├── shared/                       # Shared utilities and types
│   ├── types/                    # Shared TypeScript types
│   └── utils/                    # Shared utilities (Back4App, constants)
├── package.json                  # Unified dependencies (all packages)
├── .env.local                    # Single environment file (root)
├── ENV_TEMPLATE.md               # Environment variables template
├── build.sh                      # Unified build script
├── start.sh                      # Unified start script
├── Makefile                      # Make commands
└── README.md                     # This file
```

**Key Points:**
- **Single `package.json`**: All dependencies managed at root
- **Single `.env.local`**: Both admin and bot use the same environment file
- **Unified scripts**: All build/start commands work from root
- **Shared code**: Common utilities in `shared/` folder

## Available Commands

### Single Commands from Root
```bash
# Development
npm run dev          # Start both admin and bot in dev mode
npm run dev:admin    # Start only admin console
npm run dev:bot      # Start only bot (builds first if needed)

# Production Build
npm run build        # Build both admin and bot
npm run build:admin  # Build only admin console
npm run build:bot    # Build only bot

# Production Start
npm run start        # Start both in production mode
npm run start:admin  # Start only admin console
npm run start:bot    # Start only bot

# Setup & Maintenance
npm run setup        # Full setup (install + build)
npm run install:all  # Install all dependencies
npm run clean        # Clean build artifacts
npm run lint         # Run linting
```

### Make Commands (Recommended)
```bash
make setup          # Full setup (install + build)
make dev:all        # Start both services
make build:all      # Build everything
make clean          # Clean build artifacts
make deploy         # Build for deployment
```

### Scripts
```bash
./build.sh          # Build both admin and bot
./start.sh          # Start both services
```

## Admin Features

- **Dashboard**: Real-time bot status and controls
- **System Instructions**: Configure AI behavior
- **Memory Management**: View and edit conversation memory
- **Knowledge Base**: Upload PDF/DOC files for RAG
- **Discord Settings**: Configure channels and permissions
- **Bot Control**: Start/stop/restart bot with one click
- **Logs Viewer**: Monitor bot activity and errors

## Bot Features

- **AI Responses**: Powered by Meta Llama 3.3 70B
- **RAG Integration**: Uses uploaded knowledge for context
- **Memory System**: Remembers conversation history
- **Channel Control**: Responds only in configured channels
- **Mention Support**: Responds when @mentioned
- **Rate Limiting**: Prevents spam and abuse

## Deployment

### Option 1: Vercel/Netlify
1. Copy entire project folder to your deployment platform
2. Set environment variables
3. Deploy as root application

### Option 2: Traditional Hosting
1. Copy project folder to web root
2. Install dependencies: `make install`
3. Build: `make build:all`
4. Start: `make start:all`

## Security

- Admin authentication required for bot control
- Environment variables contain sensitive tokens
- Bot runs with server permissions
- Process isolation for bot operations

## Support

For issues and troubleshooting:
1. Check `COMMANDS.md` for detailed command usage
2. Verify environment variables are set correctly
3. Check admin dashboard logs and bot console output

## Simple Usage

### For Development:
```bash
./start.sh
```

### For Production:
```bash
./build.sh
npm run start
```

### For Everything:
```bash
make setup
make dev:all
```

**Your Discord Copilot project is now unified with single-command operation!** 🚀
