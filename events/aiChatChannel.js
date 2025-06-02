const { Events } = require('discord.js');
const axios = require('axios');

const AI_CHANNEL_ID = '1378800236109107240';
const HF_API_KEY = process.env.HF_API_KEY;

const userConversations = new Map();

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    if (message.author.bot || message.channel.id !== AI_CHANNEL_ID) return;

    const userId = message.author.id;
    const userMessage = message.content;

    let history = userConversations.get(userId) || [];

    history.push({ role: 'user', content: userMessage });

    const prompt = history
      .slice(-6) // keep last 6 exchanges
      .map(m => (m.role === 'user' ? `User: ${m.content}` : `AI: ${m.content}`))
      .join('\n') + '\nAI:';

    try {
      const res = await axios.post(
        'https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-alpha',
        { inputs: prompt },
        {
          headers: {
            Authorization: `Bearer ${HF_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const aiReply = res.data?.[0]?.generated_text?.split('AI:')[1]?.trim() || "🤖 Sorry, I couldn't think of a reply!";
      history.push({ role: 'assistant', content: aiReply });

    
      if (history.length > 12) history = history.slice(-12);
      userConversations.set(userId, history);

      await message.channel.send(`💬 <@${userId}> ${aiReply}`);
    } catch (err) {
      console.error('Hugging Face Error:', err.response?.data || err.message);
      await message.channel.send('⚠️ AI is feeling shy right now. Try again later!');
    }
  },
};
