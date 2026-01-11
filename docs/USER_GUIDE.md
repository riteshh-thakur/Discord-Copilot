# Discord Copilot - Complete User Guide

## Table of Contents
1. [Initial Setup](#initial-setup)
2. [Starting the Application](#starting-the-application)
3. [Admin Console Features](#admin-console-features)
4. [Discord Bot Usage](#discord-bot-usage)
5. [Best Practices](#best-practices)

---

## Initial Setup

### Prerequisites
- Node.js 18+ installed
- Discord Bot Token
- Back4App account with app created
- OpenRouter API key

### Step 1: Environment Configuration

#### Admin Console Setup
1. Navigate to `admin/` directory
2. Create `.env.local` file (if not exists)
3. Add your Back4App credentials:
```bash
NEXT_PUBLIC_BACK4APP_APP_ID=your_app_id
NEXT_PUBLIC_BACK4APP_JS_KEY=your_javascript_key
NEXT_PUBLIC_BACK4APP_SERVER_URL=https://parseapi.back4app.com
```

#### Bot Setup
1. Navigate to `bot/` directory
2. Create `.env` file (if not exists)
3. Add your credentials:
```bash
DISCORD_BOT_TOKEN=your_discord_bot_token
BACK4APP_APP_ID=your_app_id
BACK4APP_MASTER_KEY=your_master_key
BACK4APP_SERVER_URL=https://parseapi.back4app.com
OPENROUTER_API_KEY=your_openrouter_api_key
```

### Step 2: Install Dependencies

```bash
# Install admin console dependencies
cd admin
npm install

# Install bot dependencies
cd ../bot
npm install
```

### Step 3: Create Back4App Parse Classes

1. Go to your Back4App Dashboard
2. Navigate to **Database** → **Browser**
3. Create these three classes:

**AgentConfig:**
- `systemInstructions` (String)
- `allowedChannelIds` (Array)
- `ragEnabled` (Boolean)

**ConversationMemory:**
- `summary` (String) - Mark as required if you want

**KnowledgeChunk:**
- `content` (String)
- `embedding` (Array)
- `source` (String)

4. For each class, go to **Security** tab and set:
   - **Public Read**: `true`
   - **Public Write**: `true`

---

## Starting the Application

### Start Admin Console

```bash
cd admin
npm run dev
```

The admin console will be available at: **http://localhost:3000**

### Start Discord Bot

**Recommended: Complete Bot (All Features)**
```bash
cd bot
npm start
# or
node discord-copilot-bot.js
```

This single file includes:
- ✅ Full Back4App integration
- ✅ RAG (Retrieval-Augmented Generation)
- ✅ Memory management
- ✅ All prompt types support
- ✅ No build required

**Alternative: Development Mode (TypeScript)**
```bash
cd bot
npm run dev
```

You should see:
```
✅ Back4App initialized
🚀 Starting Discord Copilot Bot...
✅ Discord Copilot Bot is online as YourBot#1234!
🤖 Bot is ready with AI-powered responses!
```

---

## Admin Console Features

### 1. System Instructions Editor

**Purpose:** Define your bot's personality, tone, rules, and behavioral constraints.

**How to Use:**
1. Open the admin console at http://localhost:3000
2. Find the **System Instructions** card
3. Click **"Edit Instructions"** (or **"Create Instructions"** if none exist)
4. Enter your instructions in the text area. Example:
   ```
   You are a helpful AI assistant for Discord. Your personality should be:
   - Friendly and approachable
   - Knowledgeable but humble
   - Willing to help with various topics
   - Respectful and professional
   - Able to admit when you don't know something

   Rules:
   - Always be helpful and respectful
   - Never provide harmful or dangerous information
   - Keep responses concise but informative
   - Use appropriate formatting for readability
   ```
5. Click **"Save Instructions"**
6. You'll see a success notification: ✅ Instructions saved successfully!

**Tips:**
- Be specific about tone and style
- Include examples of desired behavior
- Set clear boundaries and rules
- Update as needed based on bot performance

---

### 2. Conversation Memory Management

**Purpose:** View and manage the bot's conversation history summary for context.

**How to Use:**

#### View Memory
1. Find the **Conversation Memory** card
2. Click **"View/Edit Memory"** to see full memory content
3. The memory shows a rolling summary of conversations

#### Edit Memory
1. Click **"View/Edit Memory"**
2. Click **"Edit"** button
3. Modify the memory summary
4. Click **"Save"**

#### Initialize Memory (First Time)
1. If you see "No memory data found"
2. Click **"Initialize Memory"**
3. Memory will be created with placeholder text
4. Bot will populate it automatically as conversations happen

#### Reset Memory
1. Click **"Reset Memory"** button
2. Confirm the action
3. All conversation history will be cleared
4. New memory will be created

**Tips:**
- Memory is automatically updated by the bot after each interaction
- Don't manually edit unless necessary
- Reset only when you want a fresh start

---

### 3. Discord Settings Configuration

**Purpose:** Configure which Discord channels the bot responds in and enable/disable RAG.

**How to Use:**

#### Configure Allowed Channels
1. Find the **Discord Settings** card
2. Click **"Edit Settings"** (or **"Create Configuration"** if none exists)
3. Enter channel IDs in the input field, separated by commas:
   ```
   123456789012345678, 987654321098765432
   ```
4. **How to get Channel IDs:**
   - Enable Developer Mode in Discord (User Settings → Advanced → Developer Mode)
   - Right-click on a channel → Copy ID
   - Paste the ID into the field

#### Enable/Disable RAG
1. In the settings form, check/uncheck **"Enable RAG (Retrieval-Augmented Generation)"**
2. RAG allows the bot to search your knowledge base for relevant information
3. When enabled, bot will retrieve relevant knowledge chunks before responding

#### Save Settings
1. Click **"Save"** button
2. Settings are immediately applied to the bot

**Tips:**
- Add channel IDs where you want the bot to respond
- Bot will also respond when mentioned (@bot) regardless of channel
- Enable RAG if you have knowledge documents uploaded

---

### 4. Knowledge Base Management

**Purpose:** Upload PDFs and manage knowledge chunks for RAG (Retrieval-Augmented Generation).

**How to Use:**

#### Upload PDF Document
1. Find the **Knowledge Base** card
2. Click **"Manage Knowledge"**
3. In the modal, you'll see a drag-and-drop area
4. **Option A:** Drag and drop a PDF file
5. **Option B:** Click the area to select a PDF file
6. The system will:
   - Parse the PDF text
   - Split it into chunks
   - Generate embeddings for each chunk
   - Save to Back4App
7. You'll see: ✅ PDF uploaded and X chunks added!

#### Add Knowledge Manually
1. Click **"Manage Knowledge"**
2. Click **"Add Knowledge"** button
3. Fill in:
   - **Source:** e.g., "Documentation", "FAQ", "Manual"
   - **Content:** The knowledge text
4. Click **"Add"**
5. Embedding will be generated automatically

#### Search Knowledge
1. In Knowledge Manager, use the search box
2. Type keywords to search
3. Click **"Search"** or press Enter
4. Results will show matching chunks

#### Delete Knowledge
- **Delete single chunk:** Click **"Delete"** on a specific chunk
- **Delete by source:** Click **"×"** next to a source name to delete all chunks from that source

#### View Statistics
- Total Chunks: Number of knowledge chunks
- Sources: Number of unique sources
- Total Characters: Total content size

**Tips:**
- Upload well-structured PDFs for best results
- Use descriptive source names
- Keep chunks focused and relevant
- Delete outdated information regularly

---

### 5. Bot Status Monitoring

**Purpose:** Monitor the Discord bot's connection status.

**How to Use:**
1. Check the **Bot Status** card
2. Green dot = Bot is online
3. Red dot = Bot is offline or having issues
4. Click **"View Logs"** to see detailed activity (placeholder for now)

**Connection Status Indicator:**
- Top right of the page shows Back4App connection status
- Green = Connected
- Red = Disconnected (check credentials)

---

### 6. Quick Actions

**Purpose:** Common administrative tasks.

**Available Actions:**

#### Test Bot Response
1. Click **"Test Bot Response"**
2. Notification will appear
3. Go to Discord and message the bot to test

#### Export Configuration
1. Click **"Export Configuration"**
2. Downloads a JSON file with:
   - System instructions
   - Allowed channel IDs
   - RAG settings
   - Current memory
3. Use for backup or migration

#### View Documentation
1. Click **"View Documentation"**
2. Opens documentation in new tab

---

## Discord Bot Usage

### Basic Usage

#### Getting Bot to Respond

**Method 1: Mention the Bot**
- Type `@YourBotName` followed by your message
- Bot will respond regardless of channel

**Method 2: Message in Allowed Channel**
- Send a message in a channel that's in the allow list
- Bot will automatically respond

**Example:**
```
User: @DiscordCopilot What is the weather like?
Bot: [AI-generated response based on system instructions]
```

### How the Bot Works

1. **Message Detection:**
   - Bot checks if message mentions it OR is in allowed channel
   - Ignores its own messages and other bots

2. **Context Assembly:**
   - Fetches system instructions from Back4App
   - Retrieves conversation memory
   - If RAG enabled: Searches knowledge base for relevant chunks
   - Combines with user message

3. **Response Generation:**
   - Sends context to OpenRouter API (Meta Llama 3.3 70B)
   - Generates AI response
   - Sends response to Discord

4. **Memory Update:**
   - After responding, updates conversation memory
   - Stores summary for future context

### Rate Limiting

- Bot has rate limiting: **10 responses per minute per channel**
- If limit exceeded, bot will say: "I'm processing too many requests right now. Please try again in a moment."

### Best Practices for Bot Interaction

1. **Clear Questions:** Ask specific, clear questions
2. **Be Patient:** Bot may take a few seconds to respond (AI processing)
3. **Check Channel:** Make sure you're in an allowed channel or mention the bot
4. **Use Mentions:** When in doubt, mention the bot to ensure it responds

---

## Best Practices

### Admin Console

1. **Regular Updates:**
   - Update system instructions based on bot performance
   - Review and clean up knowledge base periodically
   - Check memory to understand conversation patterns

2. **Knowledge Management:**
   - Upload relevant, accurate documents
   - Use descriptive source names
   - Keep knowledge base organized
   - Remove outdated information

3. **Configuration:**
   - Start with a few allowed channels
   - Enable RAG only if you have knowledge documents
   - Test bot responses before adding more channels

### Discord Bot

1. **Channel Management:**
   - Add channels gradually
   - Monitor bot activity
   - Remove channels if bot is too active

2. **System Instructions:**
   - Be specific about bot's role
   - Include examples of good responses
   - Set clear boundaries

3. **Memory:**
   - Let bot manage memory automatically
   - Only reset when starting fresh
   - Review memory occasionally to understand context

### Troubleshooting

#### Bot Not Responding
1. Check bot is online in Discord
2. Verify channel is in allow list
3. Check bot token is correct
4. Verify bot has proper Discord permissions

#### Admin Console Errors
1. Check Back4App connection status (top right)
2. Verify environment variables are set
3. Check browser console for detailed errors
4. Ensure Parse classes exist and have correct permissions

#### RAG Not Working
1. Verify RAG is enabled in settings
2. Check knowledge base has content
3. Verify OpenRouter API key is correct
4. Check embeddings are being generated

---

## Quick Reference

### Admin Console URLs
- Main Dashboard: http://localhost:3000
- API Routes:
  - Embeddings: http://localhost:3000/api/embeddings
  - PDF Parse: http://localhost:3000/api/parse-pdf

### Important Files
- Admin Config: `admin/.env.local`
- Bot Config: `bot/.env`
- Bot Entry: `bot/src/index.ts`
- Admin Dashboard: `admin/src/app/page.tsx`

### Key Commands
```bash
# Admin Console
cd admin && npm run dev

# Bot (Development)
cd bot && npm run dev

# Bot (Production)
cd bot && npm run build && npm start

# Bot (JavaScript - Alternative)
cd bot && node ai-bot.js
```

---

## Support

For issues or questions:
1. Check `docs/TROUBLESHOOTING.md` for common issues
2. Check `docs/BACK4APP_SETUP.md` for Back4App specific help
3. Review browser console for detailed error messages
4. Check bot console output for Discord-related issues

---

## Next Steps

1. ✅ Set up environment variables
2. ✅ Create Back4App Parse classes
3. ✅ Start admin console
4. ✅ Start Discord bot
5. ✅ Configure system instructions
6. ✅ Add Discord channel IDs
7. ✅ Upload knowledge documents (optional)
8. ✅ Test bot in Discord
9. ✅ Monitor and adjust as needed

Enjoy using Discord Copilot! 🚀
