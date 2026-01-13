/**
 * Centralized environment utilities for Discord Bot
 * Ensures all bot files access environment from root .env.local
 */

import { config } from 'dotenv';
import { resolve, join } from 'path';

// Load environment variables from project root .env.local only
// The bot runs from bot/dist/bot/src/utils, so we need to go up 5 levels to reach project root
const projectRoot = resolve(__dirname, '../../../../../');
const envFile = join(projectRoot, '.env.local');

// Load environment once at module import
try {
  config({ path: envFile });
} catch (error) {
  console.error(`❌ Failed to load environment from ${envFile}:`, error);
  process.exit(1);
}

// Export environment getters with type safety
export const env = {
  // Discord Bot Configuration
  DISCORD_BOT_TOKEN: process.env.DISCORD_BOT_TOKEN,
  DISCORD_CHANNEL_IDS: process.env.DISCORD_CHANNEL_IDS?.split(',') || [],
  
  // Back4App Configuration
  BACK4APP_APP_ID: process.env.BACK4APP_APP_ID,
  BACK4APP_MASTER_KEY: process.env.BACK4APP_MASTER_KEY,
  BACK4APP_SERVER_URL: process.env.BACK4APP_SERVER_URL || 'https://parseapi.back4app.com',
  
  // OpenRouter API Configuration
  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
  
  // Environment
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Helper function to check if required env vars are present
  require: (vars: string[]) => {
    const missing = vars.filter(varName => !process.env[varName]);
    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
  },
  
  // Helper to get environment variable with default
  get: (key: string, defaultValue?: string) => {
    return process.env[key] || defaultValue;
  }
};

// Validate required environment variables at startup
env.require([
  'DISCORD_BOT_TOKEN',
  'BACK4APP_APP_ID', 
  'BACK4APP_MASTER_KEY',
  'OPENROUTER_API_KEY'
]);

export default env;
