require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const https = require('https');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// OpenRouter API integration
async function getAIResponse(message) {
  const data = JSON.stringify({
    model: "meta-llama/llama-3.3-70b-instruct:free",
    messages: [
      {
        role: "system",
        content: `You are a helpful Discord Copilot assistant. Your personality:
- Friendly and approachable
- Knowledgeable but humble  
- Willing to help with various topics
- Respectful and professional
- Able to admit when you don't know something

Rules:
- Always be helpful and respectful
- Never provide harmful or dangerous information
- Keep responses concise but informative
- Use appropriate formatting for readability
- Respond naturally to Discord messages`
      },
      {
        role: "user",
        content: message
      }
    ],
    max_tokens: 500,
    temperature: 0.7
  });

  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'openrouter.ai',
      path: '/api/v1/chat/completions',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://discord-copilot.local',
        'X-Title': 'Discord Copilot'
      }
    }, (res) => {
      let responseData = '';
      res.on('data', (chunk) => responseData += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          if (parsed.choices && parsed.choices[0]) {
            resolve(parsed.choices[0].message.content);
          } else {
            resolve("🤔 I'm having trouble generating a response right now. Please try again!");
          }
        } catch (error) {
          console.error('AI Response Error:', error);
          resolve("💡 I'm experiencing some technical difficulties. Please try again later!");
        }
      });
    });

    req.on('error', (error) => {
      console.error('API Request Error:', error);
      resolve("🔌 I'm having connection issues. Please try again in a moment!");
    });

    req.write(data);
    req.end();
  });
}

client.once('ready', () => {
  console.log(`✅ AI-Powered Discord Copilot Bot is online as ${client.user.tag}!`);
  console.log('🧠 Bot is ready with real AI responses!');
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  
  const messageContent = message.content.toLowerCase();
  const botMentioned = message.mentions.has(client.user);
  
  // Respond to greetings, help requests, or mentions
  if (messageContent.includes('hello') || 
      messageContent.includes('hi') || 
      messageContent.includes('hey') ||
      messageContent.includes('help') ||
      messageContent.includes('what can you do') ||
      botMentioned) {
    
    // Show typing indicator
    await message.channel.sendTyping();
    
    try {
      const aiResponse = await getAIResponse(message.content);
      
      // Discord message limit check
      if (aiResponse.length > 2000) {
        const chunks = aiResponse.match(/.{1,1999}/g) || [];
        for (const chunk of chunks) {
          await message.reply(chunk);
        }
      } else {
        await message.reply(aiResponse);
      }
    } catch (error) {
      console.error('Error generating AI response:', error);
      await message.reply("🤖 I'm having trouble thinking right now. Please try again!");
    }
  }
});

client.on('error', (error) => {
  console.error('❌ Discord client error:', error);
});

console.log('🚀 Starting AI-Powered Discord Copilot Bot...');
console.log('🔑 Using OpenRouter API with Meta Llama 3.3 70B');

client.login(process.env.DISCORD_BOT_TOKEN).catch((error) => {
  console.error('❌ Failed to login to Discord:', error.message);
  process.exit(1);
});
