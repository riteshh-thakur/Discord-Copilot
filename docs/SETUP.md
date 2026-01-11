# Discord Copilot - Setup Instructions

## Prerequisites

- Node.js 18+ installed
- Discord Bot Token
- Back4App account and application
- OpenRouter API key

## 1. Back4App Setup

1. Create a new Back4App app at https://www.back4app.com/
2. Navigate to your app's settings
3. Copy the following credentials:
   - Application ID
   - JavaScript Key (for admin console)
   - Master Key (for bot)
   - Server URL

4. Create the following Parse classes in your Back4App dashboard:

### AgentConfig
- systemInstructions (String)
- allowedChannelIds (Array)
- ragEnabled (Boolean)

### KnowledgeChunk
- content (String)
- embedding (Array)
- source (String)

### ConversationMemory
- summary (String)

## 2. Environment Variables

### Admin Console (.env.local)
```bash
NEXT_PUBLIC_BACK4APP_APP_ID=your_app_id
NEXT_PUBLIC_BACK4APP_JS_KEY=your_js_key
NEXT_PUBLIC_BACK4APP_SERVER_URL=https://parseapi.back4app.com
```

### Discord Bot (.env)
```bash
DISCORD_BOT_TOKEN=your_discord_bot_token
BACK4APP_APP_ID=your_app_id
BACK4APP_MASTER_KEY=your_master_key
BACK4APP_SERVER_URL=https://parseapi.back4app.com
OPENROUTER_API_KEY=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
```

## 3. Discord Bot Setup

1. Create a Discord application at https://discord.com/developers/applications
2. Create a bot user for the application
3. Enable the following bot intents:
   - Server Members Intent
   - Message Content Intent
4. Copy the bot token
5. Invite the bot to your server with the following permissions:
   - Read Messages/View Channels
   - Send Messages
   - Use External Emojis
   - Read Message History

## 4. OpenRouter Setup

1. Create an account at https://openrouter.ai/
2. Generate an API key
3. The system uses the free Meta Llama 3.3 70B Instruct model

## 5. Installation and Running

### Admin Console
```bash
cd admin
npm install
npm run dev
```

Visit http://localhost:3000 to access the admin dashboard.

### Discord Bot
```bash
cd bot
npm install
npm run build
npm start
```

Or for development:
```bash
npm run dev
```

## 6. Configuration

1. Open the admin console at http://localhost:3000
2. Set up system instructions for your bot's personality
3. Configure allowed Discord channel IDs
4. Enable/disable RAG (Retrieval Augmented Generation)
5. Upload PDF documents if using RAG

## 7. Testing

1. Add your Discord bot to a server
2. Add the channel ID to the allow list in the admin console
3. Send a message in the allowed channel or mention the bot
4. The bot should respond based on your configuration

## Troubleshooting

### Bot not responding
- Check bot token is correct
- Verify bot has proper intents enabled
- Ensure channel is in allow list
- Check bot is online in Discord

### Admin console not loading
- Verify Back4App credentials
- Check environment variables are set
- Ensure Parse classes are created

### RAG not working
- Verify OpenRouter API key
- Check PDF upload functionality
- Ensure embeddings are being generated

## Production Deployment

### Admin Console
Deploy to Vercel, Netlify, or any Node.js hosting platform.

### Discord Bot
Deploy to a cloud service like:
- Heroku
- Railway
- DigitalOcean App Platform
- AWS EC2

Ensure the bot can run continuously in production.
