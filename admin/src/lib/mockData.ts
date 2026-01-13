/**
 * Mock data for development without Back4App connection
 */

import { AgentConfig, ConversationMemory, KnowledgeChunk } from '../../../shared/types/index';

// Mock data for development
export const mockConfig: AgentConfig = {
  objectId: 'mock-config-1',
  systemInstructions: `You are a helpful AI assistant for Discord. Your personality should be:
- Friendly and approachable
- Knowledgeable but humble
- Willing to help with various topics
- Respectful and professional
- Able to admit when you don't know something

Rules:
- Always be helpful and respectful
- Never provide harmful or dangerous information
- Keep responses concise but informative
- Use appropriate formatting for readability`,
  allowedChannelIds: ['123456789012345678', '987654321098765432'],
  ragEnabled: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockMemory: ConversationMemory = {
  objectId: 'mock-memory-1',
  summary: 'Recent conversation: User asked about the bot capabilities, bot explained its features including system instructions, knowledge management, and Discord integration. User then requested help with configuration settings.',
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Mock AgentConfig Service
export const mockAgentConfigService = {
  getActiveConfig: async (): Promise<AgentConfig | null> => {
    return mockConfig;
  },
  saveConfig: async (config: Partial<AgentConfig>): Promise<AgentConfig> => {
    return { ...mockConfig, ...config } as AgentConfig;
  },
  updateConfig: async (objectId: string, updates: Partial<AgentConfig>): Promise<AgentConfig> => {
    return { ...mockConfig, objectId, ...updates } as AgentConfig;
  },
};

// Mock Memory Service
export const mockMemoryService = {
  getMemory: async (): Promise<ConversationMemory | null> => {
    return mockMemory;
  },
  saveMemory: async (summary: string): Promise<ConversationMemory> => {
    return { ...mockMemory, summary, objectId: 'mock-memory-' + Date.now() } as ConversationMemory;
  },
  updateMemory: async (objectId: string, summary: string): Promise<ConversationMemory> => {
    return { ...mockMemory, objectId, summary, updatedAt: new Date() } as ConversationMemory;
  },
  resetMemory: async (): Promise<ConversationMemory> => {
    return { ...mockMemory, summary: '', updatedAt: new Date() } as ConversationMemory;
  },
};

// Mock Knowledge Service
export const mockKnowledgeService = {
  saveChunk: async (chunk: Partial<KnowledgeChunk>): Promise<KnowledgeChunk> => {
    return { 
      objectId: 'mock-chunk-' + Date.now(),
      content: chunk.content || '',
      source: chunk.source || 'Unknown',
      embedding: chunk.embedding || [],
      createdAt: new Date(),
      updatedAt: new Date()
    } as KnowledgeChunk;
  },
  searchChunks: async (query: string, limit: number = 5): Promise<KnowledgeChunk[]> => {
    // Mock search results
    return [];
  },
  deleteChunks: async (source: string): Promise<void> => {
    console.log('Mock delete chunks from source:', source);
  },
  getAllSources: async (): Promise<string[]> => {
    return ['System Documentation', 'Technical Specs', 'Rate Limiting Policy'];
  },
};