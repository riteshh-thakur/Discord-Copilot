/**
 * Bot Service for utility functions
 */

import { DISCORD_CONFIG } from '../../../shared/utils/constants';

// Rate limiting map: channelId -> { lastResponse: timestamp, responseCount: number }
const rateLimitMap = new Map<string, { lastResponse: number; responseCount: number }>();

export function isAllowedChannel(channelId: string, allowedChannelIds: string[]): boolean {
  return allowedChannelIds.includes(channelId);
}

export function checkRateLimit(channelId: string): boolean {
  const now = Date.now();
  const channelData = rateLimitMap.get(channelId);

  if (!channelData) {
    rateLimitMap.set(channelId, { lastResponse: now, responseCount: 1 });
    return true;
  }

  // Reset count if window has passed
  if (now - channelData.lastResponse > DISCORD_CONFIG.RATE_LIMIT_WINDOW) {
    rateLimitMap.set(channelId, { lastResponse: now, responseCount: 1 });
    return true;
  }

  // Check if under rate limit
  if (channelData.responseCount < DISCORD_CONFIG.MAX_RESPONSES_PER_WINDOW) {
    channelData.responseCount++;
    return true;
  }

  return false;
}

export function cleanMessage(message: string): string {
  // Remove Discord mentions (except bot mentions)
  return message.replace(/<@!?(\d+)>/g, '').trim();
}

export function extractMentions(message: string): string[] {
  const mentions = message.match(/<@!?(\d+)>/g) || [];
  return mentions.map(mention => mention.replace(/[<>@!]/g, ''));
}

export function formatBotResponse(response: string): string {
  // Clean up response for Discord
  return response
    .replace(/\n{3,}/g, '\n\n') // Remove excessive newlines
    .trim();
}

export function splitLongMessage(message: string): string[] {
  if (message.length <= DISCORD_CONFIG.MAX_MESSAGE_LENGTH) {
    return [message];
  }

  // Split on sentence boundaries when possible
  const sentences = message.split(/(?<=[.!?])\s+/);
  const chunks: string[] = [];
  let currentChunk = '';

  for (const sentence of sentences) {
    if (currentChunk.length + sentence.length <= DISCORD_CONFIG.MAX_MESSAGE_LENGTH) {
      currentChunk += sentence;
    } else {
      if (currentChunk) {
        chunks.push(currentChunk);
      }
      currentChunk = sentence;
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk);
  }

  return chunks;
}
