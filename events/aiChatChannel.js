const { Events } = require('discord.js');
const axios = require('axios');

const AI_CHANNEL_ID = '1378800236109107240';
const OPENAI_API_KEY = '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' ; // Your secret key here

const userConversations = new Map();

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    if (message.author.bot || message.channel.id !== AI_CHANNEL_ID) return;

    const userId = message.author.id;
    const userMessage = message.content;

    let history = userConversations.get(userId) || [
      {
        role: 'system',
        content: 'You are a helpful, friendly AI assistant in a Discord server. Keep responses fun and concise.',
      },
    ];

    history.push({ role: 'user', content: userMessage });

    try {
      const res = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: history,
          temperature: 0.8,
        },
        {
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const aiReply = res.data.choices[0].message.content;
      history.push({ role: 'assistant', content: aiReply });

      // Keep recent memory
      if (history.length > 20) history = history.slice(-20);
      userConversations.set(userId, history);

      await message.channel.send(`💬 <@${userId}> ${aiReply}`);
    } catch (err) {
      console.error('OpenAI Error:', err.response?.data || err.message);
      await message.channel.send('⚠️ AI is taking a nap. Please try again later!');
    }
  },
};
