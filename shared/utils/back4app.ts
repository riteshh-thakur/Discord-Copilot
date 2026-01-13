/**
 * Shared Back4App utilities and client setup
 */

import * as Parse from 'parse/node';
import { AgentConfig, KnowledgeChunk, ConversationMemory } from '../types';
import { BACK4APP_CONFIG } from './constants';

// Initialize Parse SDK
/**
 * Initialize Parse SDK.
 * @param applicationId Parse application id
 * @param masterKey Master key (only set when allowMasterKey = true)
 * @param serverURL Parse server URL
 * @param allowMasterKey If true, the master key will be set in CoreManager and injected for server-side calls
 */
export function initializeParse(applicationId: string, masterKey: string, serverURL: string, allowMasterKey: boolean = false) {
  // Initialize with application ID and master key
  Parse.initialize(applicationId);
  // Ensure CoreManager has the correct server URL and application id
  try {
    const CoreManager = (Parse as any).CoreManager;
    CoreManager.set('SERVER_URL', serverURL);
    CoreManager.set('APPLICATION_ID', applicationId);
  } catch (e) {
    // Fallback to older assignment
    (Parse as any).serverURL = serverURL;
  }
  
  // Only store/set master key when explicitly allowed (prevents accidental exposure during admin builds)
  if (allowMasterKey && masterKey) {
    // Store master key globally for RESTController access
    (globalThis as any).__PARSE_MASTER_KEY__ = masterKey;
    // Also store allowMasterKey flag globally
    (globalThis as any).__ALLOW_MASTER_KEY__ = allowMasterKey;
    
    // Try to set master key directly (newer Parse versions support this)
    try {
      (Parse as any).masterKey = masterKey;
    } catch (e) {
      // Fallback to storing globally for header injection
      console.log('Master key set globally');
    }
  }
  
  // Override Parse's REST controller to inject master key header when useMasterKey is true
  const CoreManager = (Parse as any).CoreManager;
  const RESTController = CoreManager.get('RESTController');
  
  // Override request method to add master key header (only if master key was allowed)
  const originalRequest = RESTController.request;
  RESTController.request = function(method: string, url: string, data: any, options: any) {
    // Always add master key header if useMasterKey is true and master key is available
    if ((globalThis as any).__ALLOW_MASTER_KEY__ && options && options.useMasterKey) {
      options.headers = options.headers || {};
      const masterKeyValue = (globalThis as any).__PARSE_MASTER_KEY__;
      if (masterKeyValue) {
        options.headers['X-Parse-Master-Key'] = masterKeyValue;
      }
    }
    return originalRequest.call(this, method, url, data, options);
  };
  
  // Also set the master key in Parse's CoreManager for backward compatibility
  try {
    // CoreManager expects uppercase keys used by the SDK internals
    if (allowMasterKey && masterKey) {
      CoreManager.set('MASTER_KEY', masterKey);
      // Optionally recommend using master key by default when making server-side requests
      CoreManager.set('USE_MASTER_KEY', true);
    }
  } catch (e) {
    console.log('Could not set masterKey in CoreManager');
  }
}

// AgentConfig operations
export class AgentConfigService {
  static async getActiveConfig(): Promise<AgentConfig | null> {
    const query = new Parse.Query(BACK4APP_CONFIG.CLASS_NAMES.AGENT_CONFIG);
    query.descending('createdAt');
    query.limit(1);
    
    const result = await query.first({ useMasterKey: true });
    if (!result) return null;
    const json = result.toJSON();
    return {
      objectId: json.objectId,
      systemInstructions: json.systemInstructions || '',
      allowedChannelIds: json.allowedChannelIds || [],
      ragEnabled: json.ragEnabled || false,
      createdAt: json.createdAt ? new Date(json.createdAt) : undefined,
      updatedAt: json.updatedAt ? new Date(json.updatedAt) : undefined,
    } as AgentConfig;
  }

  static async saveConfig(config: Partial<AgentConfig>): Promise<AgentConfig> {
    const AgentConfigClass = Parse.Object.extend(BACK4APP_CONFIG.CLASS_NAMES.AGENT_CONFIG);
    const agentConfig = new AgentConfigClass();
    
    Object.entries(config).forEach(([key, value]) => {
      agentConfig.set(key, value);
    });
    
    const saved = await agentConfig.save(null, { useMasterKey: true });
    const json = saved.toJSON();
    return {
      objectId: json.objectId,
      systemInstructions: json.systemInstructions || '',
      allowedChannelIds: json.allowedChannelIds || [],
      ragEnabled: json.ragEnabled || false,
      createdAt: json.createdAt ? new Date(json.createdAt) : undefined,
      updatedAt: json.updatedAt ? new Date(json.updatedAt) : undefined,
    } as AgentConfig;
  }

  static async updateConfig(objectId: string, updates: Partial<AgentConfig>): Promise<AgentConfig> {
    const query = new Parse.Query(BACK4APP_CONFIG.CLASS_NAMES.AGENT_CONFIG);
    const config = await query.get(objectId, { useMasterKey: true });
    
    Object.entries(updates).forEach(([key, value]) => {
      config.set(key, value);
    });
    
    const saved = await config.save(null, { useMasterKey: true });
    const json = saved.toJSON();
    return {
      objectId: json.objectId,
      systemInstructions: json.systemInstructions || '',
      allowedChannelIds: json.allowedChannelIds || [],
      ragEnabled: json.ragEnabled || false,
      createdAt: json.createdAt ? new Date(json.createdAt) : undefined,
      updatedAt: json.updatedAt ? new Date(json.updatedAt) : undefined,
    } as AgentConfig;
  }
}

// KnowledgeChunk operations
export class KnowledgeService {
  static async saveChunks(chunks: Omit<KnowledgeChunk, 'objectId' | 'createdAt' | 'updatedAt'>[]): Promise<KnowledgeChunk[]> {
    const KnowledgeChunkClass = Parse.Object.extend(BACK4APP_CONFIG.CLASS_NAMES.KNOWLEDGE_CHUNK);
    const parseChunks = chunks.map((chunk: Omit<KnowledgeChunk, 'objectId' | 'createdAt' | 'updatedAt'>) => {
      const parseChunk = new KnowledgeChunkClass();
      parseChunk.set('content', chunk.content);
      parseChunk.set('embedding', chunk.embedding);
      parseChunk.set('source', chunk.source);
      return parseChunk;
    });
    
    const saved = await Parse.Object.saveAll(parseChunks, { useMasterKey: true });
    return saved.map((result: any) => result.toJSON() as KnowledgeChunk);
  }

  static async searchSimilar(embedding: number[], limit: number = 5): Promise<KnowledgeChunk[]> {
    // Back4App doesn't have native vector similarity search
    // We implement cosine similarity manually
    const query = new Parse.Query(BACK4APP_CONFIG.CLASS_NAMES.KNOWLEDGE_CHUNK);
    query.limit(100); // Fetch more to calculate similarity, then limit
    
    const results = await query.find({ useMasterKey: true });
    const chunks = results.map((result: any) => result.toJSON() as KnowledgeChunk);
    
    // Calculate cosine similarity for each chunk
    const chunksWithSimilarity = chunks
      .filter(chunk => chunk.embedding && chunk.embedding.length > 0)
      .map(chunk => ({
        chunk,
        similarity: this.cosineSimilarity(embedding, chunk.embedding),
      }))
      .filter(item => item.similarity > 0) // Filter out negative similarities
      .sort((a, b) => b.similarity - a.similarity) // Sort by similarity descending
      .slice(0, limit) // Take top N
      .map(item => item.chunk);
    
    return chunksWithSimilarity;
  }

  // Calculate cosine similarity between two vectors
  private static cosineSimilarity(vecA: number[], vecB: number[]): number {
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
  }

  static async deleteBySource(source: string): Promise<void> {
    const query = new Parse.Query(BACK4APP_CONFIG.CLASS_NAMES.KNOWLEDGE_CHUNK);
    query.equalTo('source', source);
    const results = await query.find({ useMasterKey: true });
    await Parse.Object.destroyAll(results, { useMasterKey: true });
  }

  static async getAllSources(): Promise<string[]> {
    const query = new Parse.Query(BACK4APP_CONFIG.CLASS_NAMES.KNOWLEDGE_CHUNK);
    query.select('source');
    
    const results = await query.find({ useMasterKey: true });
    const sources = results.map((r: any) => r.get('source') as string);
    return Array.from(new Set(sources)); // Get unique sources
  }

  static async getAllChunks(): Promise<KnowledgeChunk[]> {
    const query = new Parse.Query(BACK4APP_CONFIG.CLASS_NAMES.KNOWLEDGE_CHUNK);
    query.descending('createdAt');
    
    const results = await query.find({ useMasterKey: true });
    return results.map((result: any) => result.toJSON() as KnowledgeChunk);
  }

  static async deleteChunk(objectId: string): Promise<void> {
    const query = new Parse.Query(BACK4APP_CONFIG.CLASS_NAMES.KNOWLEDGE_CHUNK);
    const chunk = await query.get(objectId, { useMasterKey: true });
    await chunk.destroy({ useMasterKey: true });
  }
}

// ConversationMemory operations
export class MemoryService {
  static async getMemory(): Promise<ConversationMemory | null> {
    const query = new Parse.Query(BACK4APP_CONFIG.CLASS_NAMES.CONVERSATION_MEMORY);
    query.descending('updatedAt');
    query.limit(1);
    
    const result = await query.first({ useMasterKey: true });
    if (!result) return null;
    const json = result.toJSON();
    return {
      objectId: json.objectId,
      summary: json.summary || '',
      createdAt: json.createdAt ? new Date(json.createdAt) : undefined,
      updatedAt: json.updatedAt ? new Date(json.updatedAt) : undefined,
    } as ConversationMemory;
  }

  static async saveMemory(summary: string): Promise<ConversationMemory> {
    const MemoryClass = Parse.Object.extend(BACK4APP_CONFIG.CLASS_NAMES.CONVERSATION_MEMORY);
    const memory = new MemoryClass();
    // If summary is empty and field is required, use a placeholder
    const summaryValue = summary.trim() || 'No conversation history yet';
    memory.set('summary', summaryValue);
    
    const saved = await memory.save(null, { useMasterKey: true });
    return saved.toJSON() as ConversationMemory;
  }

  static async updateMemory(objectId: string, summary: string): Promise<ConversationMemory> {
    const query = new Parse.Query(BACK4APP_CONFIG.CLASS_NAMES.CONVERSATION_MEMORY);
    const memory = await query.get(objectId, { useMasterKey: true });
    memory.set('summary', summary);
    
    const saved = await memory.save(null, { useMasterKey: true });
    const json = saved.toJSON();
    return {
      objectId: json.objectId,
      summary: json.summary || '',
      createdAt: json.createdAt ? new Date(json.createdAt) : undefined,
      updatedAt: json.updatedAt ? new Date(json.updatedAt) : undefined,
    } as ConversationMemory;
  }

  static async resetMemory(): Promise<ConversationMemory> {
    // Delete all existing memories
    const query = new Parse.Query(BACK4APP_CONFIG.CLASS_NAMES.CONVERSATION_MEMORY);
    const results = await query.find({ useMasterKey: true });
    await Parse.Object.destroyAll(results, { useMasterKey: true });
    
    // Create new empty memory
    return this.saveMemory('');
  }
}
