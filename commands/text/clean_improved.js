module.exports = {
  name: "clean",
  description: "Deletes a specified number of messages.",
  async execute(message, args) {
    if (!message.member.permissions.has("ManageMessages")) {
      return message.reply("You do not have permission to use this command.");
    }

    const amount = parseInt(args[0]);
    const noPin = args.includes("-nopin");

    if (isNaN(amount) || amount < 1 || amount > 100) {
      return message.reply("Please provide a number between 1 and 100.");
    }

    try {
      // Fetch more messages to account for filtering
      let messages = await message.channel.messages.fetch({ 
        limit: Math.min(amount + 50, 100) // Fetch extra to account for filtering
      });

      // Remove the command message
      messages = messages.filter(msg => msg.id !== message.id);

      // Filter out pinned messages if -nopin flag is used
      if (noPin) {
        messages = messages.filter(msg => !msg.pinned);
      }

      // Take only the requested amount
      const messagesToDelete = messages.first(amount);

      if (messagesToDelete.size === 0) {
        return message.reply("No messages found to delete.");
      }

      await message.channel.bulkDelete(messagesToDelete, true);

      const confirmMsg = await message.channel.send(
        `✅ Deleted **${messagesToDelete.size}** message${messagesToDelete.size !== 1 ? 's' : ''}.`
      );
      
      setTimeout(() => confirmMsg.delete().catch(() => {}), 3000);

    } catch (error) {
      console.error('Clean command error:', error);
      
      if (error.code === 50034) {
        return message.reply("Cannot delete messages older than 14 days.");
      }
      if (error.code === 50013) {
        return message.reply("I don't have permission to delete messages in this channel.");
      }
      
      message.reply("An error occurred while trying to delete messages.");
    }
  },
};
