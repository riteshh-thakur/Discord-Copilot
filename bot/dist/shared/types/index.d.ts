/**
 * Shared TypeScript types for Discord Copilot system
 */
export interface AgentConfig {
    objectId?: string;
    systemInstructions: string;
    allowedChannelIds: string[];
    ragEnabled: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface KnowledgeChunk {
    objectId?: string;
    content: string;
    embedding: number[];
    source: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface ConversationMemory {
    objectId?: string;
    summary: string;
    updatedAt?: Date;
    createdAt?: Date;
}
export interface DiscordMessage {
    id: string;
    channelId: string;
    authorId: string;
    content: string;
    timestamp: Date;
    mentions: string[];
}
export interface BotContext {
    systemInstructions: string;
    memorySummary: string;
    knowledgeChunks: KnowledgeChunk[];
    userMessage: string;
}
export interface OpenRouterResponse {
    choices: Array<{
        message: {
            content: string;
        };
    }>;
}
export interface EmbeddingResponse {
    data: Array<{
        embedding: number[];
    }>;
}
export interface UploadedFile {
    name: string;
    size: number;
    type: string;
    content: string;
}
export interface KnowledgeUploadResult {
    chunksCreated: number;
    source: string;
    success: boolean;
    error?: string;
}
export type ParseObject = AgentConfig | KnowledgeChunk | ConversationMemory;
export interface RateLimitInfo {
    lastResponse: number;
    responseCount: number;
}
//# sourceMappingURL=index.d.ts.map