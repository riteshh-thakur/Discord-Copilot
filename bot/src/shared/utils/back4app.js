"use strict";
/**
 * Shared Back4App utilities and client setup
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryService = exports.KnowledgeService = exports.AgentConfigService = void 0;
exports.initializeParse = initializeParse;
const parse_1 = __importDefault(require("parse"));
const constants_1 = require("./constants");
// Initialize Parse SDK
function initializeParse(applicationId, javascriptKey, serverURL) {
    parse_1.default.initialize(applicationId, javascriptKey);
    parse_1.default.serverURL = serverURL;
}
// AgentConfig operations
class AgentConfigService {
    static async getActiveConfig() {
        const query = new parse_1.default.Query(constants_1.BACK4APP_CONFIG.CLASS_NAMES.AGENT_CONFIG);
        query.descending('createdAt');
        query.limit(1);
        const result = await query.first();
        return result?.toJSON() || null;
    }
    static async saveConfig(config) {
        const AgentConfigClass = parse_1.default.Object.extend(constants_1.BACK4APP_CONFIG.CLASS_NAMES.AGENT_CONFIG);
        const agentConfig = new AgentConfigClass();
        Object.entries(config).forEach(([key, value]) => {
            agentConfig.set(key, value);
        });
        const saved = await agentConfig.save();
        return saved.toJSON();
    }
    static async updateConfig(objectId, updates) {
        const query = new parse_1.default.Query(constants_1.BACK4APP_CONFIG.CLASS_NAMES.AGENT_CONFIG);
        const config = await query.get(objectId);
        Object.entries(updates).forEach(([key, value]) => {
            config.set(key, value);
        });
        const saved = await config.save();
        return saved.toJSON();
    }
}
exports.AgentConfigService = AgentConfigService;
// KnowledgeChunk operations
class KnowledgeService {
    static async saveChunks(chunks) {
        const KnowledgeChunkClass = parse_1.default.Object.extend(constants_1.BACK4APP_CONFIG.CLASS_NAMES.KNOWLEDGE_CHUNK);
        const parseChunks = chunks.map((chunk) => {
            const parseChunk = new KnowledgeChunkClass();
            parseChunk.set('content', chunk.content);
            parseChunk.set('embedding', chunk.embedding);
            parseChunk.set('source', chunk.source);
            return parseChunk;
        });
        const saved = await parse_1.default.Object.saveAll(parseChunks);
        return saved.map((result) => result.toJSON());
    }
    static async searchSimilar(embedding, limit = 5) {
        // Note: Back4App doesn't have native vector similarity search
        // This is a simplified implementation - in production, you'd use
        // a vector database or implement cosine similarity manually
        const query = new parse_1.default.Query(constants_1.BACK4APP_CONFIG.CLASS_NAMES.KNOWLEDGE_CHUNK);
        query.limit(limit);
        query.descending('createdAt');
        const results = await query.find();
        return results.map((result) => result.toJSON());
    }
    static async deleteBySource(source) {
        const query = new parse_1.default.Query(constants_1.BACK4APP_CONFIG.CLASS_NAMES.KNOWLEDGE_CHUNK);
        query.equalTo('source', source);
        const results = await query.find();
        await parse_1.default.Object.destroyAll(results);
    }
    static async getAllSources() {
        const query = new parse_1.default.Query(constants_1.BACK4APP_CONFIG.CLASS_NAMES.KNOWLEDGE_CHUNK);
        query.select('source');
        query.distinct('source');
        const results = await query.find();
        return Array.from(results.map((r) => r.get('source')));
    }
}
exports.KnowledgeService = KnowledgeService;
// ConversationMemory operations
class MemoryService {
    static async getMemory() {
        const query = new parse_1.default.Query(constants_1.BACK4APP_CONFIG.CLASS_NAMES.CONVERSATION_MEMORY);
        query.descending('updatedAt');
        query.limit(1);
        const result = await query.first();
        return result?.toJSON() || null;
    }
    static async saveMemory(summary) {
        const MemoryClass = parse_1.default.Object.extend(constants_1.BACK4APP_CONFIG.CLASS_NAMES.CONVERSATION_MEMORY);
        const memory = new MemoryClass();
        memory.set('summary', summary);
        const saved = await memory.save();
        return saved.toJSON();
    }
    static async updateMemory(objectId, summary) {
        const query = new parse_1.default.Query(constants_1.BACK4APP_CONFIG.CLASS_NAMES.CONVERSATION_MEMORY);
        const memory = await query.get(objectId);
        memory.set('summary', summary);
        const saved = await memory.save();
        return saved.toJSON();
    }
    static async resetMemory() {
        // Delete all existing memories
        const query = new parse_1.default.Query(constants_1.BACK4APP_CONFIG.CLASS_NAMES.CONVERSATION_MEMORY);
        const results = await query.find();
        await parse_1.default.Object.destroyAll(results);
        // Create new empty memory
        return this.saveMemory('');
    }
}
exports.MemoryService = MemoryService;
//# sourceMappingURL=back4app.js.map