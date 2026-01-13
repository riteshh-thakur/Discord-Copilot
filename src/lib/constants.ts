/**
 * System-wide constants for Discord Copilot Admin Console
 */

// OpenRouter Configuration
export const OPENROUTER_CONFIG = {
  BASE_URL: 'https://openrouter.ai/api/v1',
  MODEL: 'meta-llama/llama-3.3-70b-instruct:free',
  EMBEDDING_MODEL: 'openai/text-embedding-3-small',
  MAX_TOKENS: 4000,
  TEMPERATURE: 0.7,
} as const;

// RAG Configuration
export const RAG_CONFIG = {
  CHUNK_SIZE: 600, // Target tokens per chunk
  CHUNK_OVERLAP: 100, // Overlap between chunks
  MAX_CHUNKS_PER_QUERY: 5, // Max knowledge chunks to retrieve
  SIMILARITY_THRESHOLD: 0.7, // Minimum similarity score
} as const;

// Discord Configuration
export const DISCORD_CONFIG = {
  MAX_MESSAGE_LENGTH: 2000, // Discord's limit
  RATE_LIMIT_WINDOW: 60000, // 1 minute in ms
  MAX_RESPONSES_PER_WINDOW: 10, // Rate limiting
  TYPING_INDICATOR_DURATION: 2000, // Show typing for 2 seconds
} as const;

// Memory Configuration
export const MEMORY_CONFIG = {
  MAX_SUMMARY_LENGTH: 2000, // Max characters for memory summary
  COMPRESSION_RATIO: 0.3, // How much to compress when updating
  UPDATE_THRESHOLD: 5, // Update memory after N interactions
} as const;

// Back4App Configuration
export const BACK4APP_CONFIG = {
  CLASS_NAMES: {
    AGENT_CONFIG: 'AgentConfig',
    KNOWLEDGE_CHUNK: 'KnowledgeChunk',
    CONVERSATION_MEMORY: 'ConversationMemory',
  },
} as const;

// Prompt Templates
export const PROMPT_TEMPLATES = {
  SYSTEM_HEADER: '=== SYSTEM INSTRUCTIONS ===',
  MEMORY_HEADER: '=== CONVERSATION MEMORY ===',
  KNOWLEDGE_HEADER: '=== RELEVANT KNOWLEDGE ===',
  USER_HEADER: '=== USER MESSAGE ===',
  RESPONSE_HEADER: '=== RESPONSE ===',
} as const;
