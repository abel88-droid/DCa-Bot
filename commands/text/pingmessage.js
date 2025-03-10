module.exports = {
  name: "pingmessage",
  description: "Sends a specific ping message in the channel while preventing duplicates.",
  
  async execute(message) {
    if (!message.member.permissions.has("ManageMessages")) {
      return message.reply("❌ You don't have permission to use this command.");
    }

    const channel = message.channel;
    const firstLine = "If you have it you will be on ping list and vice versa."; // First line to check
    const fullMessage = `${firstLine}\nScroll to the top👆<#840008978162>`;

    try {
      
      const messages = await channel.messages.fetch({ limit: 10 });

      
      const existingMessage = messages.find(m => m.content.startsWith(firstLine));

      if (existingMessage) {
        return message.reply("✅ The message already exists.");
      }

      
      await channel.send(fullMessage);

    } catch (error) {
      console.error("Error sending message:", error);
      return message.reply("❌ Failed to send the message.");
    }
  }
};
