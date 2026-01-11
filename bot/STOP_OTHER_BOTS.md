# Important: Stop Other Bot Instances

## Problem
If you see multiple responses to a single message, you likely have multiple bot instances running.

## Solution

### Check Running Bots
```bash
ps aux | grep -E "node.*bot"
```

### Stop All Bot Instances
```bash
# Stop all bot processes
pkill -f "ai-bot.js"
pkill -f "smart-bot.js"
pkill -f "test-bot.js"
pkill -f "discord-copilot-bot.js"
```

### Start Only One Bot
```bash
cd bot
node discord-copilot-bot.js
```

## Recommended Setup

**Only run ONE bot instance:**
- ✅ `discord-copilot-bot.js` - Complete bot with all features
- ❌ Don't run `ai-bot.js` at the same time
- ❌ Don't run `smart-bot.js` at the same time
- ❌ Don't run `test-bot.js` at the same time

## Verification

After stopping other bots, you should see only ONE response per message.
