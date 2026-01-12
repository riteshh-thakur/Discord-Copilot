/**
 * API Route to Start Discord Bot
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    console.log('🚀 Starting Discord bot via admin dashboard...');
    
    // Start bot process
    const { spawn } = require('child_process');
    
    return new Promise((resolve) => {
      // Change to bot directory and start the bot
      const botProcess = spawn('npm', ['start'], {
        cwd: '/Users/riteshthakur/Developer/Projects/brief1/bot',
        stdio: 'pipe',
        shell: true
      });

      // Log output
      botProcess.stdout.on('data', (data: any) => {
        console.log(`Bot stdout: ${data}`);
      });

      botProcess.stderr.on('data', (data: any) => {
        console.error(`Bot stderr: ${data}`);
      });

      botProcess.on('close', (code: any) => {
        console.log(`Bot process exited with code ${code}`);
      });

      // Return success immediately after starting
      resolve(NextResponse.json({ 
        success: true, 
        message: 'Bot start command initiated',
        pid: botProcess.pid 
      }));
    });

  } catch (error: any) {
    console.error('Failed to start bot:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
