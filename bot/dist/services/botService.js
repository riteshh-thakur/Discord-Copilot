"use strict";
/**
 * Bot Service for utility functions
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAllowedChannel = isAllowedChannel;
exports.checkRateLimit = checkRateLimit;
exports.cleanMessage = cleanMessage;
exports.extractMentions = extractMentions;
exports.formatBotResponse = formatBotResponse;
exports.splitLongMessage = splitLongMessage;
const constants_1 = require("../shared/utils/constants");
// Rate limiting map: channelId -> { lastResponse: timestamp, responseCount: number }
const rateLimitMap = new Map();
function isAllowedChannel(channelId, allowedChannelIds) {
    return allowedChannelIds.includes(channelId);
}
function checkRateLimit(channelId) {
    const now = Date.now();
    const channelData = rateLimitMap.get(channelId);
    if (!channelData) {
        rateLimitMap.set(channelId, { lastResponse: now, responseCount: 1 });
        return true;
    }
    // Reset count if window has passed
    if (now - channelData.lastResponse > constants_1.DISCORD_CONFIG.RATE_LIMIT_WINDOW) {
        rateLimitMap.set(channelId, { lastResponse: now, responseCount: 1 });
        return true;
    }
    // Check if under rate limit
    if (channelData.responseCount < constants_1.DISCORD_CONFIG.MAX_RESPONSES_PER_WINDOW) {
        channelData.responseCount++;
        return true;
    }
    return false;
}
function cleanMessage(message) {
    // Remove Discord mentions (except bot mentions)
    return message.replace(/<@!?(\d+)>/g, '').trim();
}
function extractMentions(message) {
    const mentions = message.match(/<@!?(\d+)>/g) || [];
    return mentions.map(mention => mention.replace(/[<>@!]/g, ''));
}
function formatBotResponse(response) {
    // Clean up response for Discord
    return response
        .replace(/\n{3,}/g, '\n\n') // Remove excessive newlines
        .trim();
}
function splitLongMessage(message) {
    if (message.length <= constants_1.DISCORD_CONFIG.MAX_MESSAGE_LENGTH) {
        return [message];
    }
    // Split on sentence boundaries when possible
    const sentences = message.split(/(?<=[.!?])\s+/);
    const chunks = [];
    let currentChunk = '';
    for (const sentence of sentences) {
        if (currentChunk.length + sentence.length <= constants_1.DISCORD_CONFIG.MAX_MESSAGE_LENGTH) {
            currentChunk += sentence;
        }
        else {
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
//# sourceMappingURL=botService.js.map