/**
 * Discord Message Handler
 */

import { Client, Message } from 'discord.js';
import { generateResponse, generateEmbedding } from '../services/llmService';
import { isAllowedChannel, checkRateLimit, cleanMessage } from '../services/botService';
import { AgentConfigService, MemoryService, KnowledgeService } from '@shared/utils/back4app';
import { BotContext, KnowledgeChunk } from '@shared/types';
import { RAG_CONFIG, MEMORY_CONFIG } from '@shared/utils/constants';
import env from '../utils/env';

// Cache config to avoid repeated queries
let cachedConfig: { config: any; timestamp: number } | null = null;
const CONFIG_CACHE_TTL = 60000; // 1 minute

// Track processed messages to prevent duplicates
const processedMessages = new Map<string, number>(); // message ID -> timestamp
// Track messages we've already replied to (to avoid multiple replies)
const repliedMessages = new Set<string>();

async function getActiveConfig() {
  const now = Date.now();
  if (cachedConfig && (now - cachedConfig.timestamp) < CONFIG_CACHE_TTL) {
    return cachedConfig.config;
  }
  
  const config = await AgentConfigService.getActiveConfig();
  cachedConfig = { config, timestamp: now };
  return config;
}

async function shouldBotRespond(message: Message): Promise<boolean> {
  // Don't respond to own messages
  if (message.author.bot) return false;
  
  // Check if message mentions bot
  const botMentioned = message.mentions.has(message.client.user);
  if (botMentioned) return true;
  
  // Check if channel is in allowed list
  const config = await getActiveConfig();
  console.log(`📋 Config found: ${!!config}`);
  console.log(`📋 Allowed channels: ${JSON.stringify(config?.allowedChannelIds || [])}`);
  
  if (!config) return false; // No config = don't respond
  
  const isAllowed = isAllowedChannel(message.channelId, config.allowedChannelIds || []);
  console.log(`📋 Channel ${message.channelId} allowed: ${isAllowed}`);
  
  return isAllowed;
}

async function retrieveKnowledge(userMessage: string, ragEnabled: boolean): Promise<KnowledgeChunk[]> {
  if (!ragEnabled) return [];
  
  try {
    // Generate embedding for user message
    const queryEmbedding = await generateEmbedding(userMessage);
    
    // Search for similar knowledge chunks
    const knowledgeChunks = await KnowledgeService.searchSimilar(queryEmbedding, RAG_CONFIG.MAX_CHUNKS_PER_QUERY);
    
    return knowledgeChunks;
  } catch (error) {
    console.error('Error retrieving knowledge:', error);
    return [];
  }
}

async function assembleContext(message: Message): Promise<BotContext> {
  const config = await getActiveConfig();
  const memory = await MemoryService.getMemory();
  
  // Get system instructions from config or use default
  const systemInstructions = config?.systemInstructions || `You are a helpful AI assistant for Discord. Your personality should be:
- Friendly and approachable
- Knowledgeable but humble
- Willing to help with various topics
- Respectful and professional
- Able to admit when you don't know something

Rules:
- Always be helpful and respectful
- Never provide harmful or dangerous information
- Keep responses concise but informative
- Use appropriate formatting for readability`;

  // Get memory summary
  const memorySummary = memory?.summary || '';

  // Retrieve knowledge if RAG is enabled
  const cleanedMessage = cleanMessage(message.content);
  const knowledgeChunks = config?.ragEnabled 
    ? await retrieveKnowledge(cleanedMessage, true)
    : [];

  return {
    systemInstructions,
    memorySummary,
    knowledgeChunks,
    userMessage: cleanedMessage,
  };
}

async function updateMemory(userMessage: string, botResponse: string, currentSummary: string): Promise<void> {
  try {
    const newInteraction = `User: ${userMessage}\nBot: ${botResponse}`;
    
    // Combine with existing summary
    const combined = currentSummary 
      ? `${currentSummary}\n\n${newInteraction}`
      : newInteraction;
    
    // Compress if too long
    let finalSummary = combined;
    if (combined.length > MEMORY_CONFIG.MAX_SUMMARY_LENGTH) {
      // Simple compression: keep last N characters
      finalSummary = combined.slice(-MEMORY_CONFIG.MAX_SUMMARY_LENGTH);
    }
    
    // Get existing memory or create new
    const existingMemory = await MemoryService.getMemory();
    if (existingMemory?.objectId) {
      await MemoryService.updateMemory(existingMemory.objectId, finalSummary);
    } else {
      await MemoryService.saveMemory(finalSummary);
    }
  } catch (error) {
    console.error('Error updating memory:', error);
    // Don't fail the request if memory update fails
  }
}

export async function handleMessage(message: Message, client: Client) {
  try {
    // DEBUG: Log message details
    console.log(`📨 Message received: ${message.content}`);
    console.log(`📍 Channel ID: ${message.channelId} (type: ${typeof message.channelId})`);
    console.log(`👤 Author: ${message.author.username} (bot: ${message.author.bot})`);
    console.log('🔍 Checking if bot should respond...');
    const shouldRespond = await shouldBotRespond(message);
    console.log(`🤖 Should respond: ${shouldRespond}`);
    
    if (!shouldRespond) {
      console.log(`❌ Not responding - shouldRespond is false`);
      return;
    }

    // Check for duplicate messages (prevent processing same message twice)
    const messageKey = `${message.channelId}-${message.id}`;
    const now = Date.now();
    if (processedMessages.has(messageKey) && (now - processedMessages.get(messageKey)!) < 5000) {
      console.log(`❌ Not responding - duplicate message detected`);
      return;
    }
    processedMessages.set(messageKey, now);

    // Check rate limiting
    console.log('🔍 Checking rate limit...');
    if (!checkRateLimit(message.channelId)) {
      console.log('❌ Rate limit exceeded, sending rate limit message');
      await sendReplyOnce(message, 'I\'m processing too many requests right now. Please try again in a moment.');
      return;
    }

    // Show typing indicator
    console.log('⌨️ Sending typing indicator...');
    if (message.channel && 'sendTyping' in message.channel) {
      await message.channel.sendTyping();
    }

    // Assemble context (includes config, memory, and knowledge)
    console.log('🔧 Assembling context...');
    const context = await assembleContext(message);
    console.log('✅ Context assembled successfully');

    // Generate response
    console.log('🤖 Generating response...');
    const response = await generateResponse(context);
    console.log('✅ Response generated successfully:', response?.substring(0, 50) + '...');

    // Send response
    if (response) {
      console.log('📤 Sending response...');
      await sendReplyOnce(message, response);
      console.log('✅ Response sent successfully');

      // Update memory asynchronously (don't block response)
      const cleanedMessage = cleanMessage(message.content);
      updateMemory(cleanedMessage, response, context.memorySummary).catch(err => {
        console.error('Failed to update memory:', err);
      });
    } else {
      console.log('⚠️ No response generated');
    }

  } catch (error) {
    console.error('=== ERROR DETAILS ===');
    console.error('Error type:', typeof error);
    console.error('Error name:', error?.name);
    console.error('Error message:', error?.message);
    console.error('Error stack:', error?.stack);
    console.error('Full error object:', error);
    console.error('=== END ERROR DETAILS ===');
    // Only reply if this isn't a bot message to avoid loops
    if (!message.author.bot) {
      await sendReplyOnce(message, 'Sorry, I encountered an error while processing your message. Please try again.');
    }
  }
}

// Helper to ensure we only reply once per message
async function sendReplyOnce(message: Message, content: string) {
  try {
    console.log('🔍 sendReplyOnce called for message:', message.id, 'content:', content.substring(0, 50));
    const key = `${message.channelId}-${message.id}`;
    if (repliedMessages.has(key)) {
      // Already replied to this message in this process
      console.log('Not sending response - already replied in this process', key);
      return;
    }

    // Before replying, check recent channel messages to see if *any* bot
    // (possibly from another process) already replied to this message.
    try {
      console.log('🔍 Fetching recent messages to check for duplicates...');
      if (message.channel && 'messages' in message.channel) {
        const recent = await message.channel.messages.fetch({ limit: 30 });
        console.log('✅ Fetched', recent.size, 'recent messages');
        const botReply = recent.find(m => {
          try {
            // 1) A reply referencing the original message
            if (m.reference && (m.reference.messageId === message.id) && m.author && m.author.bot) return true;
            // 2) A bot message with identical content (covers non-reply posts)
            if (m.author && m.author.bot && m.content && content && m.content.trim() === content.trim()) return true;
            return false;
          } catch (e) {
            return false;
          }
        });
        if (botReply) {
          // Another bot (or another instance) already replied to this message
          console.log('Not sending response - another instance already replied during generation', key, botReply.id);
          return;
        }
      }
    } catch (err) {
      // If fetching recent messages fails, continue and try to reply once
      console.warn('Could not fetch recent messages to dedupe reply:', err);
    }

    // Mark replied locally with TTL to avoid memory growth
    repliedMessages.add(key);
    setTimeout(() => repliedMessages.delete(key), 60 * 1000);
    await message.reply(content);
  } catch (err) {
    console.error('Failed to send reply:', err);
  }
}
