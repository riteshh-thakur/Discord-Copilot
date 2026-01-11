require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once('ready', () => {
  console.log(`✅ Discord Copilot Bot is online as ${client.user.tag}!`);
  console.log('🤖 Bot is ready to respond to messages!');
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  
  if (message.content.includes('hello') || message.mentions.has(client.user)) {
    await message.reply('👋 Hello! I\'m your Discord Copilot assistant. I\'m working with mock data and ready to help!');
  }
});

client.on('error', (error) => {
  console.error('❌ Discord client error:', error);
});

console.log('🚀 Starting Discord Copilot Bot...');
client.login(process.env.DISCORD_BOT_TOKEN).catch((error) => {
  console.error('❌ Failed to login to Discord:', error.message);
  process.exit(1);
});
