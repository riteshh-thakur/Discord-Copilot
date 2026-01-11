/**
 * Shared Back4App utilities and client setup
 */
import { AgentConfig, KnowledgeChunk, ConversationMemory } from '../types';
export declare function initializeParse(applicationId: string, javascriptKey: string, serverURL: string): void;
export declare class AgentConfigService {
    static getActiveConfig(): Promise<AgentConfig | null>;
    static saveConfig(config: Partial<AgentConfig>): Promise<AgentConfig>;
    static updateConfig(objectId: string, updates: Partial<AgentConfig>): Promise<AgentConfig>;
}
export declare class KnowledgeService {
    static saveChunks(chunks: Omit<KnowledgeChunk, 'objectId' | 'createdAt' | 'updatedAt'>[]): Promise<KnowledgeChunk[]>;
    static searchSimilar(embedding: number[], limit?: number): Promise<KnowledgeChunk[]>;
    static deleteBySource(source: string): Promise<void>;
    static getAllSources(): Promise<string[]>;
}
export declare class MemoryService {
    static getMemory(): Promise<ConversationMemory | null>;
    static saveMemory(summary: string): Promise<ConversationMemory>;
    static updateMemory(objectId: string, summary: string): Promise<ConversationMemory>;
    static resetMemory(): Promise<ConversationMemory>;
}
//# sourceMappingURL=back4app.d.ts.map