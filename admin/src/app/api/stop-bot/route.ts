/**
 * API Route to Stop Discord Bot
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    console.log('🛑 Stopping Discord bot via admin dashboard...');
    
    // Kill bot process
    const { exec } = require('child_process');
    
    return new Promise((resolve) => {
      // Kill processes matching the bot pattern
      exec('pkill -f "node.*discord-copilot-bot" || pkill -f "npm.*start" || true', (error: any, stdout: any, stderr: any) => {
        console.log('Bot process killed:', stdout || stderr || 'No processes to kill');
        
        resolve(NextResponse.json({ 
          success: true, 
          message: 'Bot stopped successfully',
          output: stdout || stderr || 'No processes to kill'
        }));
      });
    });

  } catch (error: any) {
    console.error('Failed to stop bot:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
