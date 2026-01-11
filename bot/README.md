# Discord Copilot Bot

## Quick Start

### Using the Complete Bot (Recommended)

```bash
# Start the bot
npm start
# or
node discord-copilot-bot.js
```

This single file (`discord-copilot-bot.js`) includes:
- ✅ Full Back4App integration
- ✅ RAG (Retrieval-Augmented Generation)
- ✅ Memory management
- ✅ Rate limiting
- ✅ All prompt types support
- ✅ Knowledge retrieval
- ✅ Config caching

### Environment Variables Required

Create a `.env` file in the `bot/` directory:

```bash
DISCORD_BOT_TOKEN=your_discord_bot_token
BACK4APP_APP_ID=your_app_id
BACK4APP_MASTER_KEY=your_master_key
BACK4APP_SERVER_URL=https://parseapi.back4app.com
OPENROUTER_API_KEY=your_openrouter_api_key
```

## Features

### All Prompt Types Supported
- **Mentions**: Bot responds when mentioned (@bot)
- **Allowed Channels**: Bot responds in configured channels
- **Context-Aware**: Uses system instructions, memory, and knowledge
- **RAG-Enabled**: Retrieves relevant knowledge chunks
- **Memory-Enhanced**: Maintains conversation context

### How It Works

1. **Message Detection**: Checks if bot should respond (mention or allowed channel)
2. **Rate Limiting**: Prevents spam (10 responses/minute per channel)
3. **Context Assembly**: 
   - Fetches system instructions from Back4App
   - Retrieves conversation memory
   - Searches knowledge base (if RAG enabled)
4. **AI Response**: Generates response using OpenRouter API
5. **Memory Update**: Updates conversation memory after responding

## Alternative Bot Files

- `ai-bot.js` - Basic AI bot (no Back4App integration)
- `smart-bot.js` - Rule-based bot
- `discord-copilot-bot.js` - **Complete bot with all features** ⭐

## Troubleshooting

### Bot Not Responding
- Check bot token is correct
- Verify channel is in allow list (configure in admin console)
- Ensure bot has proper Discord permissions
- Check bot is online in Discord

### Back4App Errors
- Verify credentials in `.env` file
- Check Parse classes exist in Back4App
- Ensure classes have Public Read/Write permissions

### TypeScript Build Issues
- Use `discord-copilot-bot.js` instead (no build needed)
- Or run `npm run dev` which uses the JavaScript file
