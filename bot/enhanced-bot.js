require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

console.log('🚀 Starting Enhanced Discord Copilot Bot...');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Enhanced response system
const responses = {
  greetings: [
    "👋 Hello! I'm your Discord Copilot assistant! I can help you with:\n• Configuration management\n• Knowledge base queries\n• System information\n• General assistance",
    "🎉 Hi there! I'm your AI assistant! How can I help you today?",
    "🤖 Greetings! I'm ready to assist with any questions you have!"
  ],
  help: [
    "🔧 **Here's what I can do:**\n• **Configuration**: Help you set up bot settings\n• **Knowledge**: Answer questions using my knowledge base\n• **Memory**: Remember our conversations\n• **Admin**: Manage system settings\n\nJust ask me anything!",
    "📚 **My Capabilities:**\n• Answer questions about various topics\n• Help with Discord server management\n• Provide technical assistance\n• Remember conversation context\n\nType any question to get started!",
    "⚡ **Quick Start Guide:**\n1. Ask me any question\n2. I'll use my knowledge to help\n3. Check admin dashboard for settings\n4. Use @mention to get my attention\n\nWhat would you like to know?"
  ],
  technical: [
    "🔧 **Creating a Discord Bot - Step by Step:**\n\n1. **Go to Discord Developer Portal**\n   - Visit: https://discord.com/developers/applications\n   - Click 'New Application'\n\n2. **Create Bot User**\n   - Go to 'Bot' tab\n   - Click 'Add Bot'\n   - Enable 'Message Content Intent'\n\n3. **Get Bot Token**\n   - Copy bot token\n   - Keep it secret!\n\n4. **Invite Bot to Server**\n   - Go to 'OAuth2' → 'URL Generator'\n   - Select 'bot' permissions\n   - Copy URL and invite to your server\n\n5. **Code the Bot**\n   ```javascript\n   const { Client } = require('discord.js');\n   const client = new Client({ intents: ['GuildMessages', 'MessageContent'] });\n   client.login('YOUR_TOKEN');\n   ```\n\nNeed more specific help with any step?",
    "🤖 **Discord Bot Creation Guide:**\n\n**Prerequisites:**\n• Node.js installed\n• Discord account\n• Basic JavaScript knowledge\n\n**Steps:**\n1. Create Discord Application\n2. Add Bot User\n3. Enable Privileged Intents\n4. Get Bot Token\n5. Set up Permissions\n6. Write Bot Code\n7. Deploy & Test\n\n**What specific part would you like help with?**"
  ],
  default: [
    "🤔 That's an interesting question! Based on my current knowledge, I'd be happy to help you with that. Could you provide more details about what specifically you'd like to know?",
    "💡 Great question! I'm here to help. While I'm still learning, I can assist with many topics. What specific aspect would you like me to focus on?",
    "🎯 I understand you're asking about that! Let me help you the best I can. Could you tell me more about what you need assistance with?"
  ]
};

// Smart response function
function getResponse(message) {
  const lowerMessage = message.toLowerCase();
  
  // Check for greetings
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return responses.greetings[Math.floor(Math.random() * responses.greetings.length)];
  }
  
  // Check for technical questions
  if (lowerMessage.includes('how do i create') || 
      lowerMessage.includes('how to create') ||
      lowerMessage.includes('make a discord bot') ||
      lowerMessage.includes('discord bot')) {
    return responses.technical[Math.floor(Math.random() * responses.technical.length)];
  }
  
  // Check for help requests
  if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
    return responses.help[Math.floor(Math.random() * responses.help.length)];
  }
  
  // Default intelligent response
  return responses.default[Math.floor(Math.random() * responses.default.length)];
}

client.once('ready', () => {
  console.log(`✅ Enhanced Discord Copilot Bot is online as ${client.user.tag}!`);
  console.log('🤖 Bot is ready with intelligent responses!');
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  
  const messageContent = message.content.toLowerCase();
  const botMentioned = message.mentions.has(client.user);
  
  // Respond to greetings or mentions
  if (messageContent.includes('hello') || 
      messageContent.includes('hi') || 
      messageContent.includes('hey') ||
      botMentioned) {
    
    const response = getResponse(message.content);
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
