# THE DISCORD COPILOT (Admin-Controlled Agent)

A production-grade system with a Web Admin Console (Architect) and Discord Bot (Executive). The Admin controls the AI agent's "brain" while users interact through Discord.

## Architecture

- **Admin Console**: Next.js dashboard for managing system instructions, knowledge, memory, and Discord settings
- **Discord Bot**: Node.js bot that responds based on admin-configured behavior
- **Backend**: Back4App (Parse Server) for data persistence
- **LLM**: OpenRouter with Meta Llama 3.3 70B Instruct

## Project Structure

```
discord-copilot/
├── admin/                    # Next.js Admin Console
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   ├── components/      # React components
│   │   ├── lib/             # Utilities and Back4App client
│   │   └── types/           # TypeScript types
│   ├── public/
│   └── package.json
├── bot/                     # Discord Bot
│   ├── src/
│   │   ├── handlers/        # Discord event handlers
│   │   ├── services/        # Business logic (RAG, memory, etc.)
│   │   ├── lib/             # Back4App client and utilities
│   │   └── types/           # TypeScript types
│   └── package.json
├── shared/                  # Shared types and utilities
│   ├── types/
│   └── utils/
├── docs/                    # Documentation
└── README.md
```

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Back4App (Parse Server)
- **Bot**: Node.js, discord.js v14, TypeScript
- **LLM**: OpenRouter API (Meta Llama 3.3 70B Instruct)
- **Embeddings**: OpenRouter embedding model

## Features

### Admin Console
- System Instructions Editor (personality, tone, rules, constraints)
- Knowledge Management (PDF upload, text extraction, chunking, embeddings)
- Memory Control (rolling conversation summary)
- Discord Allow-List management

### Discord Bot
- Responds in allow-listed channels or when mentioned
- Context assembly (system instructions + memory + knowledge + user message)
- RAG-enabled knowledge retrieval
- Memory updates after each interaction

## Quick Start

1. Clone and install dependencies
2. Set up Back4App app and configure environment variables
3. Run admin console: `cd admin && npm run dev`
4. Run Discord bot: `cd bot && npm start`

## Deployment

### Deploy Admin Console to Back4App

The admin console can be deployed to Back4App for production use. See the comprehensive deployment guide:

- **Deployment Guide**: `/docs/BACK4APP_DEPLOYMENT.md` - Complete guide to deploying the admin console to Back4App

**Quick Deployment Steps:**

1. **Prepare for deployment:**
   ```bash
   cd admin
   ./deploy.sh  # Or: npm run build
   ```

2. **Deploy via Back4App Dashboard:**
   - Create a new app in Back4App
   - Connect your Git repository
   - Set root directory to `admin`
   - Configure environment variables
   - Deploy!

3. **Required Environment Variables:**
   - `NEXT_PUBLIC_BACK4APP_APP_ID`
   - `NEXT_PUBLIC_BACK4APP_JS_KEY`
   - `NEXT_PUBLIC_BACK4APP_SERVER_URL`
   - `OPENROUTER_API_KEY`
   - `NODE_ENV=production`
   - `PORT=3000`

For detailed instructions, see `/docs/BACK4APP_DEPLOYMENT.md`.

## Documentation

- **Setup Guide**: `/docs/SETUP.md` - Initial setup and configuration
- **User Guide**: `/docs/USER_GUIDE.md` - Complete guide to using all features
- **Back4App Setup**: `/docs/BACK4APP_SETUP.md` - Back4App-specific setup and troubleshooting
- **Deployment Guide**: `/docs/BACK4APP_DEPLOYMENT.md` - Deploy admin console to Back4App
- **Troubleshooting**: `/docs/TROUBLESHOOTING.md` - Common issues and solutions
