/**
 * Discord Bot Entry Point
 * Main initialization and event handling
 */

import 'dotenv/config';
import { Client, GatewayIntentBits } from 'discord.js';
import { handleMessage } from './handlers/messageHandler';
import { initializeParse } from '../../../shared/utils/back4app';

// Initialize Back4App Parse SDK
const applicationId = process.env.BACK4APP_APP_ID;
const masterKey = process.env.BACK4APP_MASTER_KEY;
const serverURL = process.env.BACK4APP_SERVER_URL || 'https://parseapi.back4app.com';

if (!applicationId || !masterKey) {
  console.error('❌ Missing Back4App credentials. Please check your .env file.');
  process.exit(1);
}

// Initialize Parse with Master Key for bot
initializeParse(applicationId, masterKey, serverURL);
console.log('✅ Back4App initialized');

// Initialize Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Bot ready event
client.once('ready', () => {
  console.log(`✅ Discord Copilot Bot is online as ${client.user?.tag}!`);
  console.log(`🤖 Bot is ready with AI-powered responses!`);
  console.log(`📊 Connected to Back4App: ${serverURL}`);
});

// Message handler
client.on('messageCreate', async (message) => {
  await handleMessage(message, client);
});

// Error handling
client.on('error', (error) => {
  console.error('❌ Discord client error:', error);
});

// Login
const botToken = process.env.DISCORD_BOT_TOKEN;
if (!botToken) {
  console.error('❌ Missing DISCORD_BOT_TOKEN. Please check your .env file.');
  process.exit(1);
}

console.log('🚀 Starting Discord Copilot Bot...');
client.login(botToken).catch((error) => {
  console.error('❌ Failed to login to Discord:', error.message);
  process.exit(1);
});
