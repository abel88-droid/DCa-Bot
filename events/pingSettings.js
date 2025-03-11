const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");

const channelId = "1345936577410502716"; 
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

      // Check if any message starts with the first line
      const existingMessage = messages.find(m => m.content.startsWith(firstLine) || m.embeds.length > 0);

      if (existingMessage) {
        console.log("Message already exists. Skipping.");
        return; 
      }

      // Create an embed message
      const embed = new EmbedBuilder()
        .setTitle("Ping Settings")
        .setDescription(fullMessage)
        .setColor(0x3498db) // Blue color
        .setImage("https://cdn.discordapp.com/attachments/1341563215611433035/1349012518915539004/20230504_180004-1.jpg?ex=67d18d4f&is=67d03bcf&hm=37688a5b7897d910b2e63227b006459c68b4e74c9bd7d48b5c50f81451766c73&") // Replace with actual image URL
        .setFooter({ text: "Scroll to the top ☝" });

      await channel.send({ embeds: [embed] });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }
};
