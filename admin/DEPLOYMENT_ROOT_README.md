# Discord Copilot - Admin Portal Root Deployment

## 🚀 Deployment Structure

This admin portal can be deployed as the root folder while still managing the Discord bot.

## 📁 Structure When Deployed

```
admin/ (deployed as ROOT)
├── src/                    # Next.js admin portal
├── bot/                    # Discord bot code
├── shared/                 # Shared utilities and types
├── package.json           # Admin portal dependencies
├── bot/package.json       # Bot dependencies
└── .env.local             # Environment variables
```

## 🔧 Environment Setup

### Required Environment Variables (.env.local)

```env
# Discord Bot Configuration
DISCORD_BOT_TOKEN=your_discord_bot_token
DISCORD_CHANNEL_IDS=channel_id_1,channel_id_2

# Back4App Configuration
BACK4APP_APP_ID=your_back4app_app_id
BACK4APP_MASTER_KEY=your_back4app_master_key
BACK4APP_SERVER_URL=https://parseapi.back4app.com

# OpenRouter API (for LLM)
OPENROUTER_API_KEY=your_openrouter_api_key

# Next.js Configuration
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=your_deployed_url
```

## 🚀 Deployment Steps

### 1. Deploy Admin Portal as Root
- Deploy the entire `admin` folder as your web application root
- The admin portal will be accessible at the main domain

### 2. Bot Management
- The Discord bot is managed through the admin dashboard
- Bot processes run on the server where admin is deployed
- Start/stop controls work through the admin interface

### 3. File Structure After Deployment
```
/var/www/your-app/
├── src/app/              # Admin portal pages
├── bot/src/              # Discord bot source
├── shared/               # Shared code
└── node_modules/         # Dependencies
```

## 🤖 Bot Management Features

- **Auto-start**: Bot starts automatically when admin logs in
- **Auto-stop**: Bot stops when admin logs out
- **Status monitoring**: Real-time bot status tracking
- **Process management**: Full bot lifecycle control

## 🔒 Security Notes

- Environment variables contain sensitive tokens
- Bot runs with server permissions
- Admin authentication required for bot control
- Process isolation for bot operations

## 📊 Monitoring

- Bot status updates every 5 seconds
- Process monitoring through admin dashboard
- Error logging and debugging available
- Real-time connection status

## 🌐 API Endpoints

When deployed as root, these endpoints will be available:

- `POST /api/start-bot` - Start Discord bot
- `POST /api/stop-bot` - Stop Discord bot  
- `GET /api/bot-status` - Check bot status
- `POST /api/test-bot` - Test bot functionality

## 🎯 Benefits of Root Deployment

1. **Single URL**: Admin portal at main domain
2. **Integrated Management**: Bot controlled through admin interface
3. **Simplified Deployment**: One deployment for both admin and bot
4. **Centralized Control**: Everything managed from one dashboard
