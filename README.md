# Discord Copilot

A comprehensive Discord bot system with admin console for AI-powered conversations and knowledge management.

## 🚀 Features

- **AI-Powered Discord Bot**: Intelligent responses using OpenRouter API
- **Admin Console**: Modern web interface for bot management
- **Memory System**: Persistent conversation memory with Back4App
- **Knowledge Base**: Upload and manage PDF documents
- **Real-time Control**: Start/stop bot, update configuration
- **Responsive Design**: Works on all devices

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Node.js, Discord.js, Parse SDK
- **Database**: Back4App (Parse Platform)
- **AI**: OpenRouter API (multiple LLM providers)
- **Deployment**: Vercel

## 📦 Project Structure

```
discord-copilot/
├── src/                    # Next.js app (admin console)
│   ├── app/               # App Router pages and API routes
│   ├── components/        # React components
│   └── lib/              # Utilities and services
├── bot/                   # Discord bot source
│   ├── src/              # Bot TypeScript code
│   └── dist/             # Compiled JavaScript
├── shared/               # Shared utilities
└── public/              # Static assets
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/riteshh-thakur/Discord-Copilot.git
   cd Discord-Copilot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Fill in your API keys and credentials
   ```

4. **Build and run**
   ```bash
   npm run build
   npm run dev
   ```

### Environment Variables

Create `.env.local` with:

```env
# Back4App Configuration
BACK4APP_APP_ID=your_app_id
BACK4APP_MASTER_KEY=your_master_key
BACK4APP_JS_KEY=your_js_key
BACK4APP_SERVER_URL=https://parseapi.back4app.com

# Discord Bot
DISCORD_BOT_TOKEN=your_bot_token

# OpenRouter API
OPENROUTER_API_KEY=your_openrouter_key

# Public variables (for frontend)
NEXT_PUBLIC_BACK4APP_APP_ID=your_app_id
NEXT_PUBLIC_BACK4APP_JS_KEY=your_js_key
NEXT_PUBLIC_BACK4APP_SERVER_URL=https://parseapi.back4app.com
```

## 🌐 Deployment

### Vercel Deployment

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

3. **Set Environment Variables in Vercel Dashboard**
   - Go to your project settings
   - Add all environment variables from `.env.local`
   - Use the variable names as specified in `vercel.json`

### Manual Setup

1. **Deploy Admin Console** to Vercel
2. **Set up Back4App** classes and permissions
3. **Create Discord Application** and bot token
4. **Configure environment variables**

## 📖 Usage

### Admin Console

1. Access the deployed admin console
2. Configure bot settings and instructions
3. Upload knowledge base documents
4. Manage conversation memory
5. Start/stop the bot

### Discord Bot

1. Invite the bot to your Discord server
2. Mention the bot (@bot) to get responses
3. Bot will use configured knowledge and memory
4. Admin can monitor and control via console

## 🔧 Configuration

### Bot Settings

- **System Instructions**: Define bot personality and behavior
- **Allowed Channels**: Specify which channels the bot can respond in
- **Rate Limiting**: Control response frequency
- **Memory Management**: Configure conversation memory settings

### Knowledge Base

- Upload PDF documents for bot to reference
- Automatic embedding generation
- Search and retrieval capabilities

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues**: Report bugs via GitHub Issues
- **Documentation**: Check this README and code comments
- **Community**: Join our Discord server

## 🔗 Links

- **Live Demo**: [Deployed on Vercel]
- **GitHub Repository**: [Discord-Copilot](https://github.com/riteshh-thakur/Discord-Copilot)
- **Back4App**: [Parse Platform](https://www.back4app.com/)
- **Discord Developers**: [Developer Portal](https://discord.com/developers/applications)

---

Built with ❤️ using Next.js, Discord.js, and Back4App
