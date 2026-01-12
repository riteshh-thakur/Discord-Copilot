/**
 * Shared Back4App utilities and client setup
 */

import * as Parse from 'parse';
import { AgentConfig, KnowledgeChunk, ConversationMemory } from '../types';
import { BACK4APP_CONFIG } from './constants';

// Initialize Parse SDK
export function initializeParse(applicationId: string, javascriptKey: string, serverURL: string) {
  Parse.initialize(applicationId, javascriptKey);
  (Parse as any).serverURL = serverURL;
}

// AgentConfig operations
export class AgentConfigService {
  static async getActiveConfig(): Promise<AgentConfig | null> {
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
    
    const saved = await agentConfig.save();
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
    
    const saved = await Parse.Object.saveAll(parseChunks);
    return saved.map((result: any) => result.toJSON() as KnowledgeChunk);
  }

  static async searchSimilar(embedding: number[], limit: number = 5): Promise<KnowledgeChunk[]> {
    // Back4App doesn't have native vector similarity search
    // We implement cosine similarity manually
    const query = new Parse.Query(BACK4APP_CONFIG.CLASS_NAMES.KNOWLEDGE_CHUNK);
    query.limit(100); // Fetch more to calculate similarity, then limit
    
    const results = await query.find();
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
    const results = await query.find();
    await Parse.Object.destroyAll(results);
  }

  static async getAllSources(): Promise<string[]> {
    const query = new Parse.Query(BACK4APP_CONFIG.CLASS_NAMES.KNOWLEDGE_CHUNK);
    query.select('source');
    
    const results = await query.find();
    const sources = results.map((r: any) => r.get('source') as string);
    return Array.from(new Set(sources)); // Get unique sources
  }

  static async getAllChunks(): Promise<KnowledgeChunk[]> {
    const query = new Parse.Query(BACK4APP_CONFIG.CLASS_NAMES.KNOWLEDGE_CHUNK);
    query.descending('createdAt');
    
    const results = await query.find();
    return results.map((result: any) => result.toJSON() as KnowledgeChunk);
  }

  static async deleteChunk(objectId: string): Promise<void> {
    const query = new Parse.Query(BACK4APP_CONFIG.CLASS_NAMES.KNOWLEDGE_CHUNK);
    const chunk = await query.get(objectId);
    await chunk.destroy();
  }
}

// ConversationMemory operations
export class MemoryService {
  static async getMemory(): Promise<ConversationMemory | null> {
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
  }

  static async saveMemory(summary: string): Promise<ConversationMemory> {
    const MemoryClass = Parse.Object.extend(BACK4APP_CONFIG.CLASS_NAMES.CONVERSATION_MEMORY);
    const memory = new MemoryClass();
    memory.set('summary', summary);
    
    const saved = await memory.save();
    return saved.toJSON() as ConversationMemory;
  }

  static async updateMemory(objectId: string, summary: string): Promise<ConversationMemory> {
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
  }

  static async resetMemory(): Promise<ConversationMemory> {
    // Delete all existing memories
    const query = new Parse.Query(BACK4APP_CONFIG.CLASS_NAMES.CONVERSATION_MEMORY);
    const results = await query.find();
    await Parse.Object.destroyAll(results);
    
    // Create new empty memory
    return this.saveMemory('');
  }
}
