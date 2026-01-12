/**
 * API Route to Stop Discord Bot
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    console.log('🛑 Stopping Discord bot via admin dashboard...');
    
    // Find and kill the bot process
    const { exec } = require('child_process');
    
    return new Promise((resolve) => {
      // Kill node processes running for bot - more reliable approach
      exec('ps aux | grep "node.*bot" | grep -v grep | awk \'{print $2}\' | xargs kill -9 2>/dev/null || echo "No bot processes found"', (error: any, stdout: any, stderr: any) => {
        if (error) {
          console.error('Failed to kill bot process:', error);
          resolve(NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
          ));
        } else {
          console.log('Bot process killed:', stdout || 'No processes to kill');
          resolve(NextResponse.json({ 
            success: true, 
            message: 'Bot stopped successfully',
            output: stdout || 'No processes found' 
          }));
        }
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
