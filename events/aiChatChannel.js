const { Events } = require('discord.js');
const axios = require('axios');

const AI_CHANNEL_ID = '1378800236109107240'; 
const OPENAI_API_KEY = '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'; // 🟡 Replace this

const userConversations = new Map(); // 🧠 Memory

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    if (message.author.bot || message.channel.id !== AI_CHANNEL_ID) return;

    const userId = message.author.id;
    const userMessage = message.content;

    let history = userConversations.get(userId) || [
      {
        role: 'system',
        content: 'You are a helpful, friendly AI assistant in a Discord server. Keep your responses fun and concise.',
      },
    ];

    history.push({ role: 'user', content: userMessage });

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: history,
          temperature: 0.8,
        },
        {
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const aiReply = response.data.choices[0].message.content;
      history.push({ role: 'assistant', content: aiReply });

      // 🧠 Limit to last 20 messages
      if (history.length > 20) history = history.slice(-20);
      userConversations.set(userId, history);

      await message.channel.send(`💬 <@${userId}> ${aiReply}`);
    } catch (err) {
      console.error(err.response?.data || err.message);
      message.channel.send('⚠️ AI is taking a nap. Try again later!');
    }
  },
};
