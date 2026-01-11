"use strict";
/**
 * LLM Service for OpenRouter API integration
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateResponse = generateResponse;
exports.generateEmbedding = generateEmbedding;
const openai_1 = __importDefault(require("openai"));
const constants_1 = require("../shared/utils/constants");
// Initialize OpenAI client for OpenRouter
const openai = new openai_1.default({
    apiKey: process.env.OPENROUTER_API_KEY || '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',
    baseURL: constants_1.OPENROUTER_CONFIG.BASE_URL,
});
async function generateResponse(context) {
    try {
        // Construct the prompt
        const prompt = constructPrompt(context);
        // Call OpenRouter API
        const response = await openai.chat.completions.create({
            model: constants_1.OPENROUTER_CONFIG.MODEL,
            messages: [
                {
                    role: 'system',
                    content: prompt,
                },
            ],
            max_tokens: constants_1.OPENROUTER_CONFIG.MAX_TOKENS,
            temperature: constants_1.OPENROUTER_CONFIG.TEMPERATURE,
        });
        return response.choices[0]?.message?.content || 'I apologize, but I couldn\'t generate a response.';
    }
    catch (error) {
        console.error('Error generating response:', error);
        throw new Error('Failed to generate response from LLM');
    }
}
function constructPrompt(context) {
    const sections = [];
    // System Instructions
    if (context.systemInstructions) {
        sections.push(`${constants_1.PROMPT_TEMPLATES.SYSTEM_HEADER}\n${context.systemInstructions}`);
    }
    // Memory Summary
    if (context.memorySummary) {
        sections.push(`${constants_1.PROMPT_TEMPLATES.MEMORY_HEADER}\n${context.memorySummary}`);
    }
    // Knowledge Chunks
    if (context.knowledgeChunks.length > 0) {
        const knowledgeText = context.knowledgeChunks
            .map((chunk, index) => `[${index + 1}] ${chunk.content}`)
            .join('\n\n');
        sections.push(`${constants_1.PROMPT_TEMPLATES.KNOWLEDGE_HEADER}\n${knowledgeText}`);
    }
    // User Message
    sections.push(`${constants_1.PROMPT_TEMPLATES.USER_HEADER}\n${context.userMessage}`);
    // Response instruction
    sections.push(`${constants_1.PROMPT_TEMPLATES.RESPONSE_HEADER}\nProvide a helpful, concise response based on the above context.`);
    return sections.join('\n\n');
}
async function generateEmbedding(text) {
    try {
        const response = await openai.embeddings.create({
            model: constants_1.OPENROUTER_CONFIG.EMBEDDING_MODEL,
            input: text,
        });
        return response.data[0]?.embedding || [];
    }
    catch (error) {
        console.error('Error generating embedding:', error);
        throw new Error('Failed to generate embedding');
    }
}
//# sourceMappingURL=llmService.js.map