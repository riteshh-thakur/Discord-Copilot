/**
 * API Route for generating embeddings
 * Server-side only to protect API key
 */

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { OPENROUTER_CONFIG } from '../../../../shared/utils/constants';

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: OPENROUTER_CONFIG.BASE_URL,
});

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    const response = await openai.embeddings.create({
      model: OPENROUTER_CONFIG.EMBEDDING_MODEL,
      input: text,
    });

    const embedding = response.data[0]?.embedding || [];

    return NextResponse.json({ embedding });
  } catch (error: any) {
    console.error('Error generating embedding:', error);
    return NextResponse.json(
      { error: 'Failed to generate embedding', details: error.message },
      { status: 500 }
    );
  }
}
