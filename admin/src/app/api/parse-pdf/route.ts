/**
 * API Route for parsing PDF files
 * Server-side only
 */

import { NextRequest, NextResponse } from 'next/server';
import pdf from 'pdf-parse';
import { RAG_CONFIG } from '../../../../shared/utils/constants';

// Simple text chunking function
function chunkText(text: string, chunkSize: number = RAG_CONFIG.CHUNK_SIZE, overlap: number = RAG_CONFIG.CHUNK_OVERLAP): string[] {
  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    chunks.push(text.slice(start, end).trim());
    start = end - overlap;
  }

  return chunks.filter(chunk => chunk.length > 0);
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const data = await pdf(buffer);
    const text = data.text;

    // Chunk the text
    const chunks = chunkText(text);

    return NextResponse.json({
      text,
      chunks,
      source: file.name,
    });
  } catch (error: any) {
    console.error('Error parsing PDF:', error);
    return NextResponse.json(
      { error: 'Failed to parse PDF', details: error.message },
      { status: 500 }
    );
  }
}
