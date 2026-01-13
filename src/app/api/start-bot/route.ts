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
      // Determine bot directory path (from project root)
      const botDir = process.cwd();
      const botScript = './bot/dist/bot/src/index.js';
      
      console.log(`📁 Bot directory: ${botDir}`);
      console.log(`📄 Bot script: ${botScript}`);
      
      // Start the bot from project root
      const botProcess = spawn('node', [botScript], {
        cwd: botDir,
        stdio: 'pipe',
        shell: false,
        env: { ...process.env }
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
