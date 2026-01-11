/**
 * Discord Message Handler
 */

import { Client, Message } from 'discord.js';
import { generateResponse, generateEmbedding } from '../services/llmService';
import { isAllowedChannel, checkRateLimit, cleanMessage } from '../services/botService';
import { AgentConfigService, MemoryService, KnowledgeService } from '../shared/utils/back4app';
import { BotContext, KnowledgeChunk } from '../shared/types';
import { RAG_CONFIG, MEMORY_CONFIG } from '../shared/utils/constants';

// Cache config to avoid repeated queries
let cachedConfig: { config: any; timestamp: number } | null = null;
const CONFIG_CACHE_TTL = 60000; // 1 minute

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
  
  // Check if message mentions the bot
  const botMentioned = message.mentions.has(message.client.user);
  if (botMentioned) return true;
  
  // Check if channel is in allowed list
  const config = await getActiveConfig();
  if (!config) return false; // No config = don't respond
  
  return isAllowedChannel(message.channelId, config.allowedChannelIds || []);
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
    // Check if bot should respond
    const shouldRespond = await shouldBotRespond(message);
    if (!shouldRespond) return;

    // Check rate limiting
    if (!checkRateLimit(message.channelId)) {
      await message.reply('I\'m processing too many requests right now. Please try again in a moment.');
      return;
    }

    // Show typing indicator
    if (message.channel && 'sendTyping' in message.channel) {
      await message.channel.sendTyping();
    }

    // Assemble context (includes config, memory, and knowledge)
    const context = await assembleContext(message);

    // Generate response
    const response = await generateResponse(context);

    // Send response
    if (response) {
      await message.reply(response);
      
      // Update memory asynchronously (don't block response)
      const cleanedMessage = cleanMessage(message.content);
      updateMemory(cleanedMessage, response, context.memorySummary).catch(err => {
        console.error('Failed to update memory:', err);
      });
    }

  } catch (error) {
    console.error('Error handling message:', error);
    await message.reply('Sorry, I encountered an error while processing your message. Please try again.');
  }
}
