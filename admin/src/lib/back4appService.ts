/**
 * Back4App Service for Admin Console (Client-side)
 * Uses Parse SDK initialized in the browser
 */

'use client';

import Parse from 'parse';
import { AgentConfig, ConversationMemory, KnowledgeChunk } from '../../shared/types';
import { BACK4APP_CONFIG } from './constants';

// Initialize Parse on client side
let parseInitialized = false;

export function initParseClient() {
  if (parseInitialized) return;
  
  const applicationId = process.env.NEXT_PUBLIC_BACK4APP_APP_ID;
  const javascriptKey = process.env.NEXT_PUBLIC_BACK4APP_JS_KEY;
  const serverURL = process.env.NEXT_PUBLIC_BACK4APP_SERVER_URL || 'https://parseapi.back4app.com';

  if (!applicationId || !javascriptKey) {
    console.error('❌ Missing Back4App credentials. Please check your .env.local file.');
    console.error('Required variables:');
    console.error('  - NEXT_PUBLIC_BACK4APP_APP_ID');
    console.error('  - NEXT_PUBLIC_BACK4APP_JS_KEY');
    console.error('  - NEXT_PUBLIC_BACK4APP_SERVER_URL (optional)');
    throw new Error('Back4App credentials not configured');
  }

  try {
    Parse.initialize(applicationId, javascriptKey);
    Parse.serverURL = serverURL;
    parseInitialized = true;
    console.log('✅ Back4App initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize Back4App:', error);
    throw error;
  }
}

// Test Back4App connection
export async function testBack4AppConnection(): Promise<{ connected: boolean; error?: string; message?: string }> {
  try {
    initParseClient();
    console.log('🔍 Testing Back4App connection...');
    // Try a simple query to test connection
    // Note: If classes don't exist yet, we'll get a 403, but that's okay for initial setup
    const query = new Parse.Query(BACK4APP_CONFIG.CLASS_NAMES.AGENT_CONFIG);
    query.limit(1);
    const result = await query.first(); // This succeeds even if no results
    console.log('✅ Back4App connection test successful');
    return { connected: true };
  } catch (error: any) {
    console.error('❌ Back4App connection test failed:', error);
    console.error('Error code:', error?.code);
    console.error('Error message:', error?.message);
    
    // 403 Unauthorized usually means:
    // 1. Wrong JavaScript Key
    // 2. Parse classes don't exist yet (need to create them in Back4App dashboard)
    // 3. Permissions not set correctly
    
    if (error?.code === 101 || error?.message?.includes('unauthorized') || error?.message?.includes('403')) {
      return { 
        connected: false, 
        error: 'unauthorized',
        message: '403 Unauthorized - Please check: 1) JavaScript Key is correct, 2) Parse classes exist in Back4App dashboard, 3) Classes have Public Read enabled'
      };
    }
    
    // Check if it's a credentials error
    if (error?.message?.includes('credentials') || error?.message?.includes('Missing')) {
      return {
        connected: false,
        error: 'credentials',
        message: 'Missing credentials - Please check your .env.local file'
      };
    }
    
    return { 
      connected: false, 
      error: 'unknown',
      message: error?.message || 'Unknown connection error'
    };
  }
}

// AgentConfig Service
export const agentConfigService = {
  async getActiveConfig(): Promise<AgentConfig | null> {
    initParseClient();
    const query = new Parse.Query(BACK4APP_CONFIG.CLASS_NAMES.AGENT_CONFIG);
    query.descending('createdAt');
    query.limit(1);
    
    const result = await query.first();
    if (!result) return null;
    const json = result.toJSON();
    return {
      objectId: json.objectId,
      systemInstructions: json.systemInstructions || '',
      allowedChannelIds: json.allowedChannelIds || [],
      ragEnabled: json.ragEnabled ?? true,
      createdAt: json.createdAt ? new Date(json.createdAt) : undefined,
      updatedAt: json.updatedAt ? new Date(json.updatedAt) : undefined,
    } as AgentConfig;
  },

  async saveConfig(config: Partial<AgentConfig>): Promise<AgentConfig> {
    initParseClient();
    const AgentConfigClass = Parse.Object.extend(BACK4APP_CONFIG.CLASS_NAMES.AGENT_CONFIG);
    const agentConfig = new AgentConfigClass();
    
    Object.entries(config).forEach(([key, value]) => {
      agentConfig.set(key, value);
    });
    
    const saved = await agentConfig.save();
    const json = saved.toJSON();
    return {
      objectId: json.objectId,
      systemInstructions: json.systemInstructions || '',
      allowedChannelIds: json.allowedChannelIds || [],
      ragEnabled: json.ragEnabled ?? true,
      createdAt: json.createdAt ? new Date(json.createdAt) : undefined,
      updatedAt: json.updatedAt ? new Date(json.updatedAt) : undefined,
    } as AgentConfig;
  },

  async updateConfig(objectId: string, updates: Partial<AgentConfig>): Promise<AgentConfig> {
    initParseClient();
    const query = new Parse.Query(BACK4APP_CONFIG.CLASS_NAMES.AGENT_CONFIG);
    const config = await query.get(objectId);
    
    Object.entries(updates).forEach(([key, value]) => {
      config.set(key, value);
    });
    
    const saved = await config.save();
    const json = saved.toJSON();
    return {
      objectId: json.objectId,
      systemInstructions: json.systemInstructions || '',
      allowedChannelIds: json.allowedChannelIds || [],
      ragEnabled: json.ragEnabled ?? true,
      createdAt: json.createdAt ? new Date(json.createdAt) : undefined,
      updatedAt: json.updatedAt ? new Date(json.updatedAt) : undefined,
    } as AgentConfig;
  },
};

// Memory Service
export const memoryService = {
  async getMemory(): Promise<ConversationMemory | null> {
    try {
      initParseClient();
      const query = new Parse.Query(BACK4APP_CONFIG.CLASS_NAMES.CONVERSATION_MEMORY);
      query.descending('updatedAt');
      query.limit(1);
      
      const result = await query.first();
      if (!result) return null;
      const json = result.toJSON();
      return {
        objectId: json.objectId,
        summary: json.summary || '',
        createdAt: json.createdAt ? new Date(json.createdAt) : undefined,
        updatedAt: json.updatedAt ? new Date(json.updatedAt) : undefined,
      } as ConversationMemory;
    } catch (error: any) {
      // If class doesn't exist (403), return null - we'll create it
      if (error?.code === 101 || error?.message?.includes('unauthorized') || error?.message?.includes('403')) {
        console.warn('⚠️ ConversationMemory class may not exist yet. It will be created when you save memory.');
        return null;
      }
      throw error;
    }
  },

  async saveMemory(summary: string): Promise<ConversationMemory> {
    try {
      initParseClient();
      console.log('💾 Attempting to save memory to ConversationMemory class...');
      const MemoryClass = Parse.Object.extend(BACK4APP_CONFIG.CLASS_NAMES.CONVERSATION_MEMORY);
      const memory = new MemoryClass();
      
      // If summary is empty and field is required, use a placeholder
      // Back4App may have the field marked as required
      const summaryValue = summary.trim() || 'No conversation history yet';
      memory.set('summary', summaryValue);
      
      console.log('📤 Saving memory object with summary:', summaryValue.substring(0, 50) + '...');
      const saved = await memory.save();
      console.log('✅ Memory saved successfully:', saved.id);
      
      const json = saved.toJSON();
      return {
        objectId: json.objectId,
        summary: json.summary || '',
        createdAt: json.createdAt ? new Date(json.createdAt) : undefined,
        updatedAt: json.updatedAt ? new Date(json.updatedAt) : undefined,
      } as ConversationMemory;
    } catch (error: any) {
      console.error('❌ Error saving memory:', error);
      console.error('Error code:', error?.code);
      console.error('Error message:', error?.message);
      
      // Provide more detailed error information
      if (error?.code === 101 || error?.message?.includes('unauthorized') || error?.message?.includes('403')) {
        throw new Error('403 Unauthorized - Please check: 1) JavaScript Key is correct, 2) ConversationMemory class has Public Write enabled, 3) Your Back4App app is active');
      }
      if (error?.code === 119) {
        throw new Error('Permission denied - The ConversationMemory class exists but write permissions are not enabled. Please enable Public Write in Back4App dashboard.');
      }
      if (error?.code === 142 || error?.message?.includes('required')) {
        throw new Error('Required field error - The summary field is marked as required in Back4App. Please make it optional in the class schema, or the app will use a placeholder value.');
      }
      throw new Error(`Failed to save memory: ${error?.message || error?.code || 'Unknown error'}`);
    }
  },

  async updateMemory(objectId: string, summary: string): Promise<ConversationMemory> {
    try {
      initParseClient();
      const query = new Parse.Query(BACK4APP_CONFIG.CLASS_NAMES.CONVERSATION_MEMORY);
      const memory = await query.get(objectId);
      memory.set('summary', summary);
      
      const saved = await memory.save();
      const json = saved.toJSON();
      return {
        objectId: json.objectId,
        summary: json.summary || '',
        createdAt: json.createdAt ? new Date(json.createdAt) : undefined,
        updatedAt: json.updatedAt ? new Date(json.updatedAt) : undefined,
      } as ConversationMemory;
    } catch (error: any) {
      console.error('Error updating memory:', error);
      if (error?.code === 101 || error?.message?.includes('unauthorized') || error?.message?.includes('403')) {
        throw new Error('403 Unauthorized - Please check your JavaScript Key and class permissions.');
      }
      throw new Error(`Failed to update memory: ${error?.message || 'Unknown error'}`);
    }
  },

  async resetMemory(): Promise<ConversationMemory> {
    try {
      initParseClient();
      // Delete all existing memories
      const query = new Parse.Query(BACK4APP_CONFIG.CLASS_NAMES.CONVERSATION_MEMORY);
      const results = await query.find();
      if (results.length > 0) {
        await Parse.Object.destroyAll(results);
      }
      
      // Create new empty memory
      return await this.saveMemory('');
    } catch (error: any) {
      console.error('Error resetting memory:', error);
      // If delete fails but class exists, try to create new one anyway
      if (error?.code === 101 || error?.message?.includes('unauthorized') || error?.message?.includes('403')) {
        // Try to create new memory even if delete failed
        return await this.saveMemory('');
      }
      throw error;
    }
  },
};

// Knowledge Service
export const knowledgeService = {
  async saveChunks(chunks: Omit<KnowledgeChunk, 'objectId' | 'createdAt' | 'updatedAt'>[]): Promise<KnowledgeChunk[]> {
    initParseClient();
    const KnowledgeChunkClass = Parse.Object.extend(BACK4APP_CONFIG.CLASS_NAMES.KNOWLEDGE_CHUNK);
    const parseChunks = chunks.map((chunk) => {
      const parseChunk = new KnowledgeChunkClass();
      parseChunk.set('content', chunk.content);
      parseChunk.set('embedding', chunk.embedding);
      parseChunk.set('source', chunk.source);
      return parseChunk;
    });
    
    const saved = await Parse.Object.saveAll(parseChunks);
    return saved.map((result: any) => {
      const json = result.toJSON();
      return {
        objectId: json.objectId,
        content: json.content || '',
        source: json.source || '',
        embedding: json.embedding || [],
        createdAt: json.createdAt ? new Date(json.createdAt) : undefined,
        updatedAt: json.updatedAt ? new Date(json.updatedAt) : undefined,
      } as KnowledgeChunk;
    });
  },

  async getAllChunks(): Promise<KnowledgeChunk[]> {
    initParseClient();
    const query = new Parse.Query(BACK4APP_CONFIG.CLASS_NAMES.KNOWLEDGE_CHUNK);
    query.descending('createdAt');
    
    const results = await query.find();
    return results.map((result: any) => {
      const json = result.toJSON();
      return {
        objectId: json.objectId,
        content: json.content || '',
        source: json.source || '',
        embedding: json.embedding || [],
        createdAt: json.createdAt ? new Date(json.createdAt) : undefined,
        updatedAt: json.updatedAt ? new Date(json.updatedAt) : undefined,
      } as KnowledgeChunk;
    });
  },

  async getAllSources(): Promise<string[]> {
    initParseClient();
    const query = new Parse.Query(BACK4APP_CONFIG.CLASS_NAMES.KNOWLEDGE_CHUNK);
    query.select('source');
    
    const results = await query.find();
    const sources = results.map((r: any) => r.get('source') as string);
    return Array.from(new Set(sources));
  },

  async deleteBySource(source: string): Promise<void> {
    initParseClient();
    const query = new Parse.Query(BACK4APP_CONFIG.CLASS_NAMES.KNOWLEDGE_CHUNK);
    query.equalTo('source', source);
    const results = await query.find();
    await Parse.Object.destroyAll(results);
  },

  async deleteChunk(objectId: string): Promise<void> {
    initParseClient();
    const query = new Parse.Query(BACK4APP_CONFIG.CLASS_NAMES.KNOWLEDGE_CHUNK);
    const chunk = await query.get(objectId);
    await chunk.destroy();
  },
};
