"use strict";
/**
 * Shared Back4App utilities and client setup
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryService = exports.KnowledgeService = exports.AgentConfigService = void 0;
exports.initializeParse = initializeParse;
const Parse = require('parse');
const constants_1 = require("./constants");
// Initialize Parse SDK
function initializeParse(applicationId, javascriptKey, serverURL) {
    Parse.initialize(applicationId, javascriptKey);
    Parse.serverURL = serverURL;
}
// AgentConfig operations
class AgentConfigService {
    static async getActiveConfig() {
        const query = new Parse.Query(constants_1.BACK4APP_CONFIG.CLASS_NAMES.AGENT_CONFIG);
        query.descending('createdAt');
        query.limit(1);
        const result = await query.first();
        if (!result)
            return null;
        const json = result.toJSON();
        return {
            objectId: json.objectId,
            systemInstructions: json.systemInstructions || '',
            allowedChannelIds: json.allowedChannelIds || [],
            ragEnabled: json.ragEnabled || false,
            createdAt: json.createdAt ? new Date(json.createdAt) : undefined,
            updatedAt: json.updatedAt ? new Date(json.updatedAt) : undefined,
        };
    }
    static async saveConfig(config) {
        const AgentConfigClass = Parse.Object.extend(constants_1.BACK4APP_CONFIG.CLASS_NAMES.AGENT_CONFIG);
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
        };
    }
    static async updateConfig(objectId, updates) {
        const query = new Parse.Query(constants_1.BACK4APP_CONFIG.CLASS_NAMES.AGENT_CONFIG);
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
        };
    }
}
exports.AgentConfigService = AgentConfigService;
// KnowledgeChunk operations
class KnowledgeService {
    static async saveChunks(chunks) {
        const KnowledgeChunkClass = Parse.Object.extend(constants_1.BACK4APP_CONFIG.CLASS_NAMES.KNOWLEDGE_CHUNK);
        const parseChunks = chunks.map((chunk) => {
            const parseChunk = new KnowledgeChunkClass();
            parseChunk.set('content', chunk.content);
            parseChunk.set('embedding', chunk.embedding);
            parseChunk.set('source', chunk.source);
            return parseChunk;
        });
        const saved = await Parse.Object.saveAll(parseChunks);
        return saved.map((result) => result.toJSON());
    }
    static async searchSimilar(embedding, limit = 5) {
        // Back4App doesn't have native vector similarity search
        // We implement cosine similarity manually
        const query = new Parse.Query(constants_1.BACK4APP_CONFIG.CLASS_NAMES.KNOWLEDGE_CHUNK);
        query.limit(100); // Fetch more to calculate similarity, then limit
        const results = await query.find();
        const chunks = results.map((result) => result.toJSON());
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
    static cosineSimilarity(vecA, vecB) {
        if (vecA.length !== vecB.length)
            return 0;
        let dotProduct = 0;
        let normA = 0;
        let normB = 0;
        for (let i = 0; i < vecA.length; i++) {
            dotProduct += vecA[i] * vecB[i];
            normA += vecA[i] * vecA[i];
            normB += vecB[i] * vecB[i];
        }
        if (normA === 0 || normB === 0)
            return 0;
        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    }
    static async deleteBySource(source) {
        const query = new Parse.Query(constants_1.BACK4APP_CONFIG.CLASS_NAMES.KNOWLEDGE_CHUNK);
        query.equalTo('source', source);
        const results = await query.find();
        await Parse.Object.destroyAll(results);
    }
    static async getAllSources() {
        const query = new Parse.Query(constants_1.BACK4APP_CONFIG.CLASS_NAMES.KNOWLEDGE_CHUNK);
        query.select('source');
        const results = await query.find();
        const sources = results.map((r) => r.get('source'));
        return Array.from(new Set(sources)); // Get unique sources
    }
    static async getAllChunks() {
        const query = new Parse.Query(constants_1.BACK4APP_CONFIG.CLASS_NAMES.KNOWLEDGE_CHUNK);
        query.descending('createdAt');
        const results = await query.find();
        return results.map((result) => result.toJSON());
    }
    static async deleteChunk(objectId) {
        const query = new Parse.Query(constants_1.BACK4APP_CONFIG.CLASS_NAMES.KNOWLEDGE_CHUNK);
        const chunk = await query.get(objectId);
        await chunk.destroy();
    }
}
exports.KnowledgeService = KnowledgeService;
// ConversationMemory operations
class MemoryService {
    static async getMemory() {
        const query = new Parse.Query(constants_1.BACK4APP_CONFIG.CLASS_NAMES.CONVERSATION_MEMORY);
        query.descending('updatedAt');
        query.limit(1);
        const result = await query.first();
        if (!result)
            return null;
        const json = result.toJSON();
        return {
            objectId: json.objectId,
            summary: json.summary || '',
            createdAt: json.createdAt ? new Date(json.createdAt) : undefined,
            updatedAt: json.updatedAt ? new Date(json.updatedAt) : undefined,
        };
    }
    static async saveMemory(summary) {
        const MemoryClass = Parse.Object.extend(constants_1.BACK4APP_CONFIG.CLASS_NAMES.CONVERSATION_MEMORY);
        const memory = new MemoryClass();
        memory.set('summary', summary);
        const saved = await memory.save();
        return saved.toJSON();
    }
    static async updateMemory(objectId, summary) {
        const query = new Parse.Query(constants_1.BACK4APP_CONFIG.CLASS_NAMES.CONVERSATION_MEMORY);
        const memory = await query.get(objectId);
        memory.set('summary', summary);
        const saved = await memory.save();
        const json = saved.toJSON();
        return {
            objectId: json.objectId,
            summary: json.summary || '',
            createdAt: json.createdAt ? new Date(json.createdAt) : undefined,
            updatedAt: json.updatedAt ? new Date(json.updatedAt) : undefined,
        };
    }
    static async resetMemory() {
        // Delete all existing memories
        const query = new Parse.Query(constants_1.BACK4APP_CONFIG.CLASS_NAMES.CONVERSATION_MEMORY);
        const results = await query.find();
        await Parse.Object.destroyAll(results);
        // Create new empty memory
        return this.saveMemory('');
    }
}
exports.MemoryService = MemoryService;
//# sourceMappingURL=back4app.js.map