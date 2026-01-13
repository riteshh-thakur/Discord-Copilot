/**
 * API Route to Test Discord Bot
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message } = body;
    
    console.log('🧪 Testing bot with message:', message);
    
    // For now, we'll simulate a bot test response
    // In a real implementation, this would send a test message to Discord
    
    return NextResponse.json({ 
      success: true, 
      message: 'Bot test completed successfully',
      testMessage: message,
      response: 'Test message received! Bot is responding correctly.',
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Failed to test bot:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
