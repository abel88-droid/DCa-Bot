module.exports = {
  name: "pingmessage",
  description: "Sends a specific ping message in the channel while preventing duplicates.",
  
  async execute(message) {
    if (!message.member.permissions.has("ManageMessages")) {
      return message.reply("❌ You don't have permission to use this command.");
    }

    const channel = message.channel;
    const targetMessage = "Scroll to the top👆<#1347213407530782754>"; // Updated message to check and send

    try {
      const messages = await channel.messages.fetch({ limit: 10 });

      const existingMessage = messages.find(m => m.content === targetMessage);

      if (existingMessage) {
        return message.reply("✅ The message already exists.");
      }

      await channel.send(targetMessage);

    } catch (error) {
      console.error("Error sending message:", error);
      return message.reply("❌ Failed to send the message.");
    }
  }
};
