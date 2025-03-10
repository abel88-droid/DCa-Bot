const { Client, GatewayIntentBits } = require("discord.js");

const channelId = "1239880291523366942"; 
const firstLine = "It's not necessary to join every time it's reset."; 
const fullMessage = 
  `${firstLine}\nIf you are in doubt about what you will get pinged for, check your roles. You should have some of these:`;

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    const channel = client.channels.cache.get(channelId);
    if (!channel) return console.log("Channel not found!");

    try {
      // Fetch last 10 messages in the channel
      const messages = await channel.messages.fetch({ limit: 10 });

      // Check if any message starts with the first line of our message
      const existingMessage = messages.find(m => m.content.startsWith(firstLine));

      if (existingMessage) {
        console.log("Message already exists. Skipping.");
        return; 
      }

      
      await channel.send({
        content: fullMessage,
        files: ["https://discord.com/channels/839529596370419773/839907517663936612/1103713190803677305"], 
      });

    } catch (error) {
      console.error("Error sending message:", error);
    }
  }
};
