# Discord Copilot - Admin Portal

A Discord bot management system with a web admin dashboard. The admin portal controls the Discord bot's behavior, knowledge base, and settings.

## Features

- **Admin Dashboard**: Next.js portal for bot management
- **Discord Bot**: AI-powered Discord bot with RAG capabilities
- **Knowledge Management**: Upload and manage knowledge documents
- **Memory System**: Conversation memory and context tracking
- **Real-time Control**: Start/stop bot, monitor status
- **Auto-start**: Bot starts automatically on admin login

## Quick Start

### 1. Deploy Admin Portal
Deploy the `admin/` folder as your web application root.

### 2. Environment Setup
Create `.env.local` in the admin folder:
```env
DISCORD_BOT_TOKEN=your_discord_bot_token
DISCORD_CHANNEL_IDS=channel_id_1,channel_id_2
BACK4APP_APP_ID=your_back4app_app_id
BACK4APP_MASTER_KEY=your_back4app_master_key
BACK4APP_SERVER_URL=https://parseapi.back4app.com
OPENROUTER_API_KEY=your_openrouter_api_key
```

### 3. Access Admin Portal
- URL: Your deployed domain
- Login: `admin` / `admin123`
- Bot auto-starts on successful login

## Project Structure

```
brief1/
├── admin/                    # Complete admin portal (deploy as root)
│   ├── src/                  # Next.js source code
│   ├── bot/                  # Discord bot (managed by admin)
│   ├── shared/               # Shared utilities and types
│   ├── package.json          # Dependencies
│   └── .env.local            # Environment variables
├── README.md                 # This file
└── .gitignore                # Git ignore rules
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
1. Copy `admin/` folder to your deployment platform
2. Set environment variables
3. Deploy as root application

### Option 2: Traditional Hosting
1. Copy `admin/` folder to web root
2. Install dependencies: `npm install`
3. Build: `npm run build`
4. Start: `npm start`

## Security

- Admin authentication required for bot control
- Environment variables contain sensitive tokens
- Bot runs with server permissions
- Process isolation for bot operations

## Support

For issues and troubleshooting, check the admin dashboard logs and bot console output.
