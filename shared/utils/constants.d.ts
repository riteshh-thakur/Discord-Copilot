/**
 * System-wide constants for Discord Copilot
 */
export declare const OPENROUTER_CONFIG: {
    readonly BASE_URL: "https://openrouter.ai/api/v1";
    readonly MODEL: "meta-llama/llama-3.3-70b-instruct:free";
    readonly EMBEDDING_MODEL: "openai/text-embedding-3-small";
    readonly MAX_TOKENS: 4000;
    readonly TEMPERATURE: 0.7;
};
export declare const RAG_CONFIG: {
    readonly CHUNK_SIZE: 600;
    readonly CHUNK_OVERLAP: 100;
    readonly MAX_CHUNKS_PER_QUERY: 5;
    readonly SIMILARITY_THRESHOLD: 0.7;
};
export declare const DISCORD_CONFIG: {
    readonly MAX_MESSAGE_LENGTH: 2000;
    readonly RATE_LIMIT_WINDOW: 60000;
    readonly MAX_RESPONSES_PER_WINDOW: 10;
    readonly TYPING_INDICATOR_DURATION: 2000;
};
export declare const MEMORY_CONFIG: {
    readonly MAX_SUMMARY_LENGTH: 2000;
    readonly COMPRESSION_RATIO: 0.3;
    readonly UPDATE_THRESHOLD: 5;
};
export declare const BACK4APP_CONFIG: {
    readonly CLASS_NAMES: {
        readonly AGENT_CONFIG: "AgentConfig";
        readonly KNOWLEDGE_CHUNK: "KnowledgeChunk";
        readonly CONVERSATION_MEMORY: "ConversationMemory";
    };
};
export declare const PROMPT_TEMPLATES: {
    readonly SYSTEM_HEADER: "=== SYSTEM INSTRUCTIONS ===";
    readonly MEMORY_HEADER: "=== CONVERSATION MEMORY ===";
    readonly KNOWLEDGE_HEADER: "=== RELEVANT KNOWLEDGE ===";
    readonly USER_HEADER: "=== USER MESSAGE ===";
    readonly RESPONSE_HEADER: "=== RESPONSE ===";
};
//# sourceMappingURL=constants.d.ts.map