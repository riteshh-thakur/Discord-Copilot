/**
 * Discord Copilot Bot - Complete Implementation
 * Single file with all features: Back4App integration, RAG, Memory, and AI responses
 */

require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const Parse = require('parse/node');
const https = require('https');

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
  // OpenRouter
  OPENROUTER_BASE_URL: 'https://openrouter.ai/api/v1',
  MODEL: 'meta-llama/llama-3.3-70b-instruct:free',
  EMBEDDING_MODEL: 'openai/text-embedding-3-small',
  MAX_TOKENS: 4000,
  TEMPERATURE: 0.7,
  
  // Discord
  MAX_MESSAGE_LENGTH: 2000,
  RATE_LIMIT_WINDOW: 60000, // 1 minute
  MAX_RESPONSES_PER_WINDOW: 10,
  
  // RAG
  MAX_CHUNKS_PER_QUERY: 5,
  
  // Memory
  MAX_SUMMARY_LENGTH: 2000,
  
  // Back4App
  CLASS_NAMES: {
    AGENT_CONFIG: 'AgentConfig',
    KNOWLEDGE_CHUNK: 'KnowledgeChunk',
    CONVERSATION_MEMORY: 'ConversationMemory',
  },
  
  // Config cache
  CONFIG_CACHE_TTL: 60000, // 1 minute
};

// ============================================================================
// BACK4APP INITIALIZATION
// ============================================================================

const applicationId = process.env.BACK4APP_APP_ID;
const masterKey = process.env.BACK4APP_MASTER_KEY;
const serverURL = process.env.BACK4APP_SERVER_URL || 'https://parseapi.back4app.com';

if (!applicationId || !masterKey) {
  console.error('❌ Missing Back4App credentials. Please check your .env file.');
  process.exit(1);
}

Parse.initialize(applicationId);
Parse.masterKey = masterKey;
Parse.serverURL = serverURL;
console.log('✅ Back4App initialized with Master Key');

// ============================================================================
// BACK4APP SERVICES
// ============================================================================

const Back4AppService = {
  // Config cache
  cachedConfig: null,
  configCacheTime: 0,
  
  async getActiveConfig() {
    const now = Date.now();
    if (this.cachedConfig && (now - this.configCacheTime) < CONFIG.CONFIG_CACHE_TTL) {
      return this.cachedConfig;
    }
    
    try {
      const query = new Parse.Query(CONFIG.CLASS_NAMES.AGENT_CONFIG);
      query.descending('createdAt');
      query.limit(1);
      // Use Master Key for authentication
      const result = await query.first({ useMasterKey: true });
      
      if (result) {
        const config = result.toJSON();
        this.cachedConfig = {
          systemInstructions: config.systemInstructions || '',
          allowedChannelIds: config.allowedChannelIds || [],
          ragEnabled: config.ragEnabled !== undefined ? config.ragEnabled : true,
          objectId: config.objectId,
        };
        this.configCacheTime = now;
        return this.cachedConfig;
      }
      return null;
    } catch (error) {
      console.error('Error fetching config:', error);
      return null;
    }
  },
  
  async getMemory() {
    try {
      const query = new Parse.Query(CONFIG.CLASS_NAMES.CONVERSATION_MEMORY);
      query.descending('updatedAt');
      query.limit(1);
      // Use Master Key for authentication
      const result = await query.first({ useMasterKey: true });
      return result ? result.toJSON() : null;
    } catch (error) {
      console.error('Error fetching memory:', error);
      return null;
    }
  },
  
  async updateMemory(objectId, summary) {
    try {
      const query = new Parse.Query(CONFIG.CLASS_NAMES.CONVERSATION_MEMORY);
      // Use Master Key for authentication
      const memory = await query.get(objectId, { useMasterKey: true });
      memory.set('summary', summary);
      await memory.save(null, { useMasterKey: true });
    } catch (error) {
      console.error('Error updating memory:', error);
      throw error;
    }
  },
  
  async saveMemory(summary) {
    try {
      const MemoryClass = Parse.Object.extend(CONFIG.CLASS_NAMES.CONVERSATION_MEMORY);
      const memory = new MemoryClass();
      memory.set('summary', summary || 'No conversation history yet');
      // Use Master Key for authentication
      const saved = await memory.save(null, { useMasterKey: true });
      return saved.toJSON();
    } catch (error) {
      console.error('Error saving memory:', error);
      throw error;
    }
  },
  
  async searchKnowledge(embedding, limit = CONFIG.MAX_CHUNKS_PER_QUERY) {
    try {
      const query = new Parse.Query(CONFIG.CLASS_NAMES.KNOWLEDGE_CHUNK);
      query.limit(100); // Fetch more to calculate similarity
      // Use Master Key for authentication
      const results = await query.find({ useMasterKey: true });
      const chunks = results.map(r => r.toJSON());
      
      // Calculate cosine similarity
      const chunksWithSimilarity = chunks
        .filter(chunk => chunk.embedding && chunk.embedding.length > 0)
        .map(chunk => ({
          chunk,
          similarity: this.cosineSimilarity(embedding, chunk.embedding),
        }))
        .filter(item => item.similarity > 0)
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, limit)
        .map(item => item.chunk);
      
      return chunksWithSimilarity;
    } catch (error) {
      console.error('Error searching knowledge:', error);
      return [];
    }
  },
  
  cosineSimilarity(vecA, vecB) {
    if (vecA.length !== vecB.length) return 0;
    
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }
    
    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  },
};

// ============================================================================
// OPENROUTER API SERVICE
// ============================================================================

const OpenRouterService = {
  async makeRequest(endpoint, data) {
    return new Promise((resolve, reject) => {
      const postData = JSON.stringify(data);
      
      const options = {
        hostname: 'openrouter.ai',
        path: endpoint,
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://discord-copilot.local',
          'X-Title': 'Discord Copilot',
          'Content-Length': Buffer.byteLength(postData),
        },
      };
      
      const req = https.request(options, (res) => {
        let responseData = '';
        res.on('data', (chunk) => responseData += chunk);
        res.on('end', () => {
          try {
            const parsed = JSON.parse(responseData);
            if (res.statusCode === 200) {
              resolve(parsed);
            } else {
              reject(new Error(`API Error: ${parsed.error?.message || 'Unknown error'}`));
            }
          } catch (error) {
            reject(new Error(`Parse Error: ${error.message}`));
          }
        });
      });
      
      req.on('error', (error) => {
        reject(error);
      });
      
      req.write(postData);
      req.end();
    });
  },
  
  async generateResponse(context) {
    try {
      // Construct prompt
      const sections = [];
      
      if (context.systemInstructions) {
        sections.push(`=== SYSTEM INSTRUCTIONS ===\n${context.systemInstructions}`);
      }
      
      if (context.memorySummary) {
        sections.push(`=== CONVERSATION MEMORY ===\n${context.memorySummary}`);
      }
      
      if (context.knowledgeChunks && context.knowledgeChunks.length > 0) {
        const knowledgeText = context.knowledgeChunks
          .map((chunk, index) => `[${index + 1}] ${chunk.content}`)
          .join('\n\n');
        sections.push(`=== RELEVANT KNOWLEDGE ===\n${knowledgeText}`);
      }
      
      sections.push(`=== USER MESSAGE ===\n${context.userMessage}`);
      sections.push(`=== RESPONSE ===\nProvide a helpful, concise response based on the above context.`);
      
      const prompt = sections.join('\n\n');
      
      const response = await this.makeRequest('/api/v1/chat/completions', {
        model: CONFIG.MODEL,
        messages: [
          {
            role: 'system',
            content: prompt,
          },
        ],
        max_tokens: CONFIG.MAX_TOKENS,
        temperature: CONFIG.TEMPERATURE,
      });
      
      return response.choices[0]?.message?.content || 'I apologize, but I couldn\'t generate a response.';
    } catch (error) {
      console.error('Error generating response:', error);
      throw error;
    }
  },
  
  async generateEmbedding(text) {
    try {
      const response = await this.makeRequest('/api/v1/embeddings', {
        model: CONFIG.EMBEDDING_MODEL,
        input: text,
      });
      
      return response.data[0]?.embedding || [];
    } catch (error) {
      console.error('Error generating embedding:', error);
      throw error;
    }
  },
};

// ============================================================================
// BOT UTILITIES
// ============================================================================

const BotUtils = {
  rateLimitMap: new Map(),
  
  isAllowedChannel(channelId, allowedChannelIds) {
    return allowedChannelIds.includes(channelId);
  },
  
  checkRateLimit(channelId) {
    const now = Date.now();
    const channelData = this.rateLimitMap.get(channelId);
    
    if (!channelData) {
      this.rateLimitMap.set(channelId, { lastResponse: now, responseCount: 1 });
      return true;
    }
    
    if (now - channelData.lastResponse > CONFIG.RATE_LIMIT_WINDOW) {
      this.rateLimitMap.set(channelId, { lastResponse: now, responseCount: 1 });
      return true;
    }
    
    if (channelData.responseCount < CONFIG.MAX_RESPONSES_PER_WINDOW) {
      channelData.responseCount++;
      return true;
    }
    
    return false;
  },
  
  cleanMessage(message) {
    return message.replace(/<@!?(\d+)>/g, '').trim();
  },
  
  splitLongMessage(message) {
    if (message.length <= CONFIG.MAX_MESSAGE_LENGTH) {
      return [message];
    }
    
    const sentences = message.split(/(?<=[.!?])\s+/);
    const chunks = [];
    let currentChunk = '';
    
    for (const sentence of sentences) {
      if (currentChunk.length + sentence.length <= CONFIG.MAX_MESSAGE_LENGTH) {
        currentChunk += sentence;
      } else {
        if (currentChunk) chunks.push(currentChunk);
        currentChunk = sentence;
      }
    }
    
    if (currentChunk) chunks.push(currentChunk);
    return chunks;
  },
};

// ============================================================================
// MESSAGE HANDLING
// ============================================================================

// Track processed messages to prevent duplicate responses
const processedMessages = new Set();
const MESSAGE_PROCESSING_TTL = 60000; // 1 minute

function markMessageProcessed(messageId) {
  processedMessages.add(messageId);
  // Clean up after TTL
  setTimeout(() => {
    processedMessages.delete(messageId);
  }, MESSAGE_PROCESSING_TTL);
}

function isMessageProcessed(messageId) {
  return processedMessages.has(messageId);
}

async function shouldBotRespond(message, config) {
  if (message.author.bot) return false;
  
  const botMentioned = message.mentions.has(message.client.user);
  if (botMentioned) return true;
  
  if (!config) return false;
  return BotUtils.isAllowedChannel(message.channelId, config.allowedChannelIds || []);
}

async function assembleContext(message, config, memory, knowledgeChunks) {
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

  return {
    systemInstructions,
    memorySummary: memory?.summary || '',
    knowledgeChunks: knowledgeChunks || [],
    userMessage: BotUtils.cleanMessage(message.content),
  };
}

async function retrieveKnowledge(userMessage, ragEnabled) {
  if (!ragEnabled) return [];
  
  try {
    const queryEmbedding = await OpenRouterService.generateEmbedding(userMessage);
    const knowledgeChunks = await Back4AppService.searchKnowledge(queryEmbedding);
    return knowledgeChunks;
  } catch (error) {
    console.error('Error retrieving knowledge:', error);
    return [];
  }
}

async function updateMemory(userMessage, botResponse, currentSummary) {
  try {
    const newInteraction = `User: ${userMessage}\nBot: ${botResponse}`;
    const combined = currentSummary 
      ? `${currentSummary}\n\n${newInteraction}`
      : newInteraction;
    
    let finalSummary = combined;
    if (combined.length > CONFIG.MAX_SUMMARY_LENGTH) {
      finalSummary = combined.slice(-CONFIG.MAX_SUMMARY_LENGTH);
    }
    
    const existingMemory = await Back4AppService.getMemory();
    if (existingMemory?.objectId) {
      await Back4AppService.updateMemory(existingMemory.objectId, finalSummary);
    } else {
      await Back4AppService.saveMemory(finalSummary);
    }
  } catch (error) {
    console.error('Error updating memory:', error);
  }
}

async function handleMessage(message, client) {
  try {
    // Prevent duplicate processing
    if (isMessageProcessed(message.id)) {
      console.log(`⚠️ Message ${message.id} already processed, skipping...`);
      return;
    }
    
    // Get config
    const config = await Back4AppService.getActiveConfig();
    
    // Check if should respond
    if (!(await shouldBotRespond(message, config))) return;
    
    // Mark message as being processed
    markMessageProcessed(message.id);
    
    // Check rate limit
    if (!BotUtils.checkRateLimit(message.channelId)) {
      await message.reply('I\'m processing too many requests right now. Please try again in a moment.');
      return;
    }
    
    // Show typing indicator
    if (message.channel && typeof message.channel.sendTyping === 'function') {
      await message.channel.sendTyping();
    }
    
    // Get memory
    const memory = await Back4AppService.getMemory();
    
    // Retrieve knowledge if RAG enabled
    const knowledgeChunks = config?.ragEnabled 
      ? await retrieveKnowledge(BotUtils.cleanMessage(message.content), true)
      : [];
    
    // Assemble context
    const context = await assembleContext(message, config, memory, knowledgeChunks);
    
    // Generate response
    const response = await OpenRouterService.generateResponse(context);
    
    // Send response (only one reply, follow-ups if message is too long)
    if (response) {
      const chunks = BotUtils.splitLongMessage(response);
      if (chunks.length > 0) {
        // Send first chunk as reply
        await message.reply(chunks[0]);
        // Send remaining chunks as regular messages (not replies) to avoid spam
        for (let i = 1; i < chunks.length; i++) {
          await message.channel.send(chunks[i]);
        }
      }
      
      // Update memory asynchronously
      updateMemory(context.userMessage, response, context.memorySummary).catch(err => {
        console.error('Failed to update memory:', err);
      });
    }
    
  } catch (error) {
    console.error('Error handling message:', error);
    await message.reply('Sorry, I encountered an error while processing your message. Please try again.');
  }
}

// ============================================================================
// DISCORD CLIENT SETUP
// ============================================================================

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once('ready', () => {
  console.log(`✅ Discord Copilot Bot is online as ${client.user.tag}!`);
  console.log(`🤖 Bot is ready with AI-powered responses!`);
  console.log(`📊 Connected to Back4App: ${serverURL}`);
  console.log(`🧠 RAG: Enabled | Memory: Active | Config: Loaded`);
});

client.on('messageCreate', async (message) => {
  await handleMessage(message, client);
});

client.on('error', (error) => {
  console.error('❌ Discord client error:', error);
});

// ============================================================================
// START BOT
// ============================================================================

const botToken = process.env.DISCORD_BOT_TOKEN;
if (!botToken) {
  console.error('❌ Missing DISCORD_BOT_TOKEN. Please check your .env file.');
  process.exit(1);
}

console.log('🚀 Starting Discord Copilot Bot...');
console.log('🔑 Using OpenRouter API with Meta Llama 3.3 70B');
console.log('📚 Features: Back4App Integration | RAG | Memory Management');

client.login(botToken).catch((error) => {
  console.error('❌ Failed to login to Discord:', error.message);
  process.exit(1);
});
