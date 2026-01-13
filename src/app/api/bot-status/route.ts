/**
 * Bot Status API Route
 * Returns current bot running status
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Check if bot process is running by checking for process
    const { exec } = require('child_process');
    
    return new Promise((resolve) => {
      exec('ps aux | grep "node.*discord-copilot-bot" | grep -v grep', (error: any, stdout: any, stderr: any) => {
        const isRunning = stdout && stdout.trim().length > 0;
        
        resolve(NextResponse.json({ 
          running: isRunning,
          processCount: stdout ? stdout.trim().split('\n').length : 0,
          timestamp: new Date().toISOString()
        }));
      });
    });

  } catch (error: any) {
    console.error('Failed to check bot status:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message,
        running: false 
      },
      { status: 500 }
    );
  }
}
