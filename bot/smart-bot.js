require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

console.log('🚀 Starting Smart Discord Copilot Bot...');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once('ready', () => {
  console.log(`✅ Smart Discord Copilot Bot is online as ${client.user.tag}!`);
  console.log('🤖 Bot is ready with intelligent responses!');
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  
  const messageContent = message.content.toLowerCase();
  const botMentioned = message.mentions.has(client.user);
  
  // Smart response system
  let response = '';
  
  if (messageContent.includes('hello') || messageContent.includes('hi') || messageContent.includes('hey') || botMentioned) {
    response = "👋 Hello! I'm your Discord Copilot assistant! I can help you with:\n• Configuration management\n• Knowledge base queries\n• System information\n• General assistance\n\nJust ask me anything!";
  }
  else if (messageContent.includes('how do i create') || messageContent.includes('discord bot')) {
    response = "🔧 **Creating a Discord Bot - Step by Step:**\n\n1. **Go to Discord Developer Portal**\n   - Visit: https://discord.com/developers/applications\n   - Click 'New Application'\n\n2. **Create Bot User**\n   - Go to 'Bot' tab\n   - Click 'Add Bot'\n   - Enable 'Message Content Intent'\n\n3. **Get Bot Token**\n   - Copy bot token\n   - Keep it secret!\n\n4. **Invite Bot to Server**\n   - Go to 'OAuth2' → 'URL Generator'\n   - Select 'bot' permissions\n   - Copy URL and invite to your server\n\n5. **Code the Bot**\n   ```javascript\n   const { Client } = require('discord.js');\n   const client = new Client({ intents: ['GuildMessages', 'MessageContent'] });\n   client.login('YOUR_TOKEN');\n   ```\n\nNeed more specific help with any step?";
  }
  else if (messageContent.includes('help') || messageContent.includes('what can you do')) {
    response = "🔧 **Here's what I can do:**\n• **Configuration**: Help you set up bot settings\n• **Knowledge**: Answer questions using my knowledge base\n• **Memory**: Remember our conversations\n• **Admin**: Manage system settings\n• **Technical**: Help with Discord bot creation\n\nJust ask me anything!";
  }
  
  if (response) {
    await message.reply(response);
  }
});

client.on('error', (error) => {
  console.error('❌ Discord client error:', error);
});

client.login(process.env.DISCORD_BOT_TOKEN).catch((error) => {
  console.error('❌ Failed to login to Discord:', error.message);
  process.exit(1);
});
