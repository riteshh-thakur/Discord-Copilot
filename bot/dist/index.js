"use strict";
/**
 * Discord Bot Entry Point
 * Main initialization and event handling
 */
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const discord_js_1 = require("discord.js");
const messageHandler_1 = require("./handlers/messageHandler");
const back4app_1 = require("../shared/utils/back4app");
// Initialize Back4App Parse SDK
const applicationId = process.env.BACK4APP_APP_ID;
const masterKey = process.env.BACK4APP_MASTER_KEY;
const serverURL = process.env.BACK4APP_SERVER_URL || 'https://parseapi.back4app.com';
if (!applicationId || !masterKey) {
    console.error('❌ Missing Back4App credentials. Please check your .env file.');
    process.exit(1);
}
// Initialize Parse with Master Key for bot
(0, back4app_1.initializeParse)(applicationId, masterKey, serverURL);
console.log('✅ Back4App initialized');
// Initialize Discord client
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.MessageContent,
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
    await (0, messageHandler_1.handleMessage)(message, client);
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
//# sourceMappingURL=index.js.map