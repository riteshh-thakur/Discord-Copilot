"use strict";
/**
 * System-wide constants for Discord Copilot
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PROMPT_TEMPLATES = exports.BACK4APP_CONFIG = exports.MEMORY_CONFIG = exports.DISCORD_CONFIG = exports.RAG_CONFIG = exports.OPENROUTER_CONFIG = void 0;
// OpenRouter Configuration
exports.OPENROUTER_CONFIG = {
    BASE_URL: 'https://openrouter.ai/api/v1',
    MODEL: 'meta-llama/llama-3.3-70b-instruct:free',
    EMBEDDING_MODEL: 'openai/text-embedding-3-small',
    MAX_TOKENS: 4000,
    TEMPERATURE: 0.7,
};
// RAG Configuration
exports.RAG_CONFIG = {
    CHUNK_SIZE: 600, // Target tokens per chunk
    CHUNK_OVERLAP: 100, // Overlap between chunks
    MAX_CHUNKS_PER_QUERY: 5, // Max knowledge chunks to retrieve
    SIMILARITY_THRESHOLD: 0.7, // Minimum similarity score
};
// Discord Configuration
exports.DISCORD_CONFIG = {
    MAX_MESSAGE_LENGTH: 2000, // Discord's limit
    RATE_LIMIT_WINDOW: 60000, // 1 minute in ms
    MAX_RESPONSES_PER_WINDOW: 10, // Rate limiting
    TYPING_INDICATOR_DURATION: 2000, // Show typing for 2 seconds
};
// Memory Configuration
exports.MEMORY_CONFIG = {
    MAX_SUMMARY_LENGTH: 2000, // Max characters for memory summary
    COMPRESSION_RATIO: 0.3, // How much to compress when updating
    UPDATE_THRESHOLD: 5, // Update memory after N interactions
};
// Back4App Configuration
exports.BACK4APP_CONFIG = {
    CLASS_NAMES: {
        AGENT_CONFIG: 'AgentConfig',
        KNOWLEDGE_CHUNK: 'KnowledgeChunk',
        CONVERSATION_MEMORY: 'ConversationMemory',
    },
};
// Prompt Templates
exports.PROMPT_TEMPLATES = {
    SYSTEM_HEADER: '=== SYSTEM INSTRUCTIONS ===',
    MEMORY_HEADER: '=== CONVERSATION MEMORY ===',
    KNOWLEDGE_HEADER: '=== RELEVANT KNOWLEDGE ===',
    USER_HEADER: '=== USER MESSAGE ===',
    RESPONSE_HEADER: '=== RESPONSE ===',
};
//# sourceMappingURL=constants.js.map