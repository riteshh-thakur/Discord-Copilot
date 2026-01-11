# Quick Start Guide - Discord Copilot

## 🚀 Getting Started in 5 Minutes

### 1. Start Admin Console
```bash
cd admin
npm run dev
```
Visit: **http://localhost:3000**

### 2. Start Discord Bot
```bash
cd bot
npm start
# or
node discord-copilot-bot.js
```

### 3. Configure Bot (First Time)

#### Step 1: Set System Instructions
1. Open http://localhost:3000
2. Click **"Edit Instructions"** in System Instructions card
3. Enter your bot's personality and rules
4. Click **"Save Instructions"**

#### Step 2: Add Discord Channels
1. In Discord, enable Developer Mode (Settings → Advanced)
2. Right-click a channel → Copy ID
3. In admin console, click **"Edit Settings"** in Discord Settings card
4. Paste channel ID(s), separated by commas
5. Click **"Save"**

#### Step 3: Initialize Memory (Optional)
1. Click **"Initialize Memory"** in Conversation Memory card
2. Bot will populate this automatically

### 4. Test the Bot
1. Go to your Discord server
2. Send a message in an allowed channel OR mention the bot
3. Bot should respond!

---

## 📋 Feature Checklist

### ✅ System Instructions
- [ ] Edit bot personality
- [ ] Set rules and constraints
- [ ] Save instructions

### ✅ Discord Settings
- [ ] Add allowed channel IDs
- [ ] Enable/disable RAG
- [ ] Save settings

### ✅ Memory Management
- [ ] Initialize memory
- [ ] View conversation history
- [ ] Edit memory (if needed)
- [ ] Reset memory (if needed)

### ✅ Knowledge Base
- [ ] Upload PDF documents
- [ ] Add knowledge manually
- [ ] Search knowledge
- [ ] Delete outdated chunks

### ✅ Bot Testing
- [ ] Test in allowed channel
- [ ] Test with mention
- [ ] Verify RAG is working (if enabled)
- [ ] Check memory updates

---

## 🎯 Common Tasks

### Add a New Channel
1. Copy channel ID in Discord
2. Admin Console → Discord Settings → Edit
3. Add ID to the list (comma-separated)
4. Save

### Upload Knowledge Document
1. Admin Console → Knowledge Base → Manage Knowledge
2. Drag & drop PDF or click to select
3. Wait for processing
4. Done! Bot can now use this knowledge

### Change Bot Personality
1. Admin Console → System Instructions → Edit
2. Modify instructions
3. Save
4. Changes apply immediately

### Reset Everything
1. Memory → Reset Memory
2. Knowledge → Delete all chunks
3. Settings → Remove all channels (optional)

---

## 🔧 Troubleshooting

| Issue | Solution |
|-------|----------|
| Bot not responding | Check channel is in allow list or mention bot |
| 403 Error | Check Back4App permissions (Public Read/Write) |
| Memory fails | Ensure `summary` field exists in ConversationMemory class |
| RAG not working | Enable RAG in settings and upload knowledge documents |

---

## 📚 Full Documentation

- **Complete User Guide**: `/docs/USER_GUIDE.md`
- **Setup Instructions**: `/docs/SETUP.md`
- **Back4App Help**: `/docs/BACK4APP_SETUP.md`
- **Troubleshooting**: `/docs/TROUBLESHOOTING.md`

---

## 💡 Pro Tips

1. **Start Simple**: Begin with basic instructions, add complexity later
2. **Test Incrementally**: Add one channel at a time
3. **Monitor Memory**: Check memory to understand bot's context
4. **Update Knowledge**: Keep knowledge base current and relevant
5. **Iterate**: Adjust instructions based on bot performance

---

**Ready to go!** Start with the admin console, configure your bot, and test in Discord! 🎉
