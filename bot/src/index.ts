/**
 * Discord Bot Entry Point
 * Main initialization and event handling
 */

import { config } from 'dotenv';
import { resolve, join } from 'path';
import { writeFileSync, readFileSync, existsSync, unlinkSync } from 'fs';
import { randomUUID } from 'crypto';
import { Client, GatewayIntentBits } from 'discord.js';
import { handleMessage } from './handlers/messageHandler';
import { initializeParse } from '@shared/utils/back4app';

// Load environment variables from project root .env.local only
// The bot runs from bot/dist/bot/src, so we need to go up 4 levels to reach project root
const projectRoot = resolve(__dirname, '../../../../');
const envFile = join(projectRoot, '.env.local');

// Simple PID lockfile to prevent multiple bot instances from running simultaneously.
const lockFile = join(projectRoot, '.bot.lock');
const instanceId = randomUUID();
if (existsSync(lockFile)) {
  try {
    const raw = readFileSync(lockFile, 'utf8');
    let parsed: any = null;
    try {
      parsed = JSON.parse(raw);
    } catch (_) {
      // old-format plain pid
      parsed = { pid: parseInt(raw, 10) };
    }
    const pid = parseInt(parsed?.pid, 10);
    if (!Number.isNaN(pid)) {
      try {
        // Check if process is alive
        process.kill(pid, 0);
        console.error(`❌ Another bot process is already running (pid=${pid}, instance=${parsed?.instanceId || 'unknown'}). Exiting.`);
        // Exit with non-zero to signal failure to start duplicate process
        process.exit(1);
      } catch (e) {
        // Process not running, proceed and overwrite lock
        console.log(`⚠ Stale lockfile found for pid=${pid}, continuing and overwriting lockfile.`);
      }
    }
  } catch (e) {
    console.warn('⚠ Could not read lockfile, proceeding to create a new one.');
  }
}
try {
  const lockPayload = { pid: process.pid, instanceId };
  writeFileSync(lockFile, JSON.stringify(lockPayload), { encoding: 'utf8' });
  console.log(`🔒 Created lockfile ${lockFile} (pid=${process.pid}, instance=${instanceId})`);
  // Ensure lockfile is removed on exit
  const removeLock = () => { try { unlinkSync(lockFile); } catch (e) {} };
  process.on('exit', removeLock);
  process.on('SIGINT', () => { removeLock(); process.exit(0); });
  process.on('SIGTERM', () => { removeLock(); process.exit(0); });
} catch (e) {
  console.warn('⚠ Could not create lockfile, continuing without lock protection.', e);
}
// Log instance id for tracing
console.log(`Instance ID: ${instanceId} PID: ${process.pid}`);

console.log(`📁 Loading environment from: ${envFile}`);

try {
  config({ path: envFile });
  console.log(`✅ Environment loaded successfully`);
} catch (error) {
  console.error(`❌ Failed to load environment from ${envFile}:`, error);
  process.exit(1);
}

// Initialize Back4App Parse SDK
const applicationId = process.env.BACK4APP_APP_ID;
const masterKey = process.env.BACK4APP_MASTER_KEY;
const serverURL = process.env.BACK4APP_SERVER_URL || 'https://parseapi.back4app.com';

if (!applicationId || !masterKey) {
  console.error('❌ Missing Back4App credentials. Please check your .env file.');
  process.exit(1);
}

// Initialize Parse with Master Key for bot
// Pass allowMasterKey = true so the master key is only set by the bot process
initializeParse(applicationId, masterKey, serverURL, true);
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
