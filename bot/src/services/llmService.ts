/**
 * LLM Service for OpenRouter API integration
 */

import OpenAI from 'openai';
import { BotContext, OpenRouterResponse } from '@shared/types';
import { OPENROUTER_CONFIG, PROMPT_TEMPLATES } from '@shared/utils/constants';
import env from '../utils/env';

// Initialize OpenAI client for OpenRouter using centralized environment
const openai = new OpenAI({
  apiKey: env.OPENROUTER_API_KEY || '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',
  baseURL: OPENROUTER_CONFIG.BASE_URL,
});

export async function generateResponse(context: BotContext): Promise<string> {
  try {
    // Construct the prompt
    const prompt = constructPrompt(context);

    // Call OpenRouter API
    const response = await openai.chat.completions.create({
      model: OPENROUTER_CONFIG.MODEL,
      messages: [
        {
          role: 'system',
          content: prompt,
        },
      ],
      max_tokens: OPENROUTER_CONFIG.MAX_TOKENS,
      temperature: OPENROUTER_CONFIG.TEMPERATURE,
    });

    return response.choices[0]?.message?.content || 'I apologize, but I couldn\'t generate a response.';
  } catch (error) {
    console.error('Error generating response:', error);
    throw new Error('Failed to generate response from LLM');
  }
}

function constructPrompt(context: BotContext): string {
  const sections = [];

  // System Instructions
  if (context.systemInstructions) {
    sections.push(`${PROMPT_TEMPLATES.SYSTEM_HEADER}\n${context.systemInstructions}`);
  }

  // Memory Summary
  if (context.memorySummary) {
    sections.push(`${PROMPT_TEMPLATES.MEMORY_HEADER}\n${context.memorySummary}`);
  }

  // Knowledge Chunks
  if (context.knowledgeChunks.length > 0) {
    const knowledgeText = context.knowledgeChunks
      .map((chunk: any, index: number) => `[${index + 1}] ${chunk.content}`)
      .join('\n\n');
    sections.push(`${PROMPT_TEMPLATES.KNOWLEDGE_HEADER}\n${knowledgeText}`);
  }

  // User Message
  sections.push(`${PROMPT_TEMPLATES.USER_HEADER}\n${context.userMessage}`);

  // Response instruction
  sections.push(`${PROMPT_TEMPLATES.RESPONSE_HEADER}\nProvide a helpful, concise response based on the above context.`);

  return sections.join('\n\n');
}

export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: OPENROUTER_CONFIG.EMBEDDING_MODEL,
      input: text,
    });

    return response.data[0]?.embedding || [];
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw new Error('Failed to generate embedding');
  }
}
