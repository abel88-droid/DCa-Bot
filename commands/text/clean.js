module.exports = {
  name: "clean",
  description: "Deletes a specified number of messages.",
  async execute(message, args) {
    if (!message.member.permissions.has("ManageMessages")) {
      return message.reply("You do not have permission to use this command.");
    }

    const amount = parseInt(args[0]);

    if (isNaN(amount) || amount < 1 || amount > 100) {
      return message.reply("Please provide a number between 1 and 100.");
    }

    try {
      await message.channel.bulkDelete(amount, true);
      
      setTimeout(() => {
        message.channel.send(`✅ Deleted **${amount}** messages.`).then(msg => {
          setTimeout(() => msg.delete(), 3000);
        });
      }, 1000); // Delay sending the confirmation message to prevent deletion

    } catch (error) {
      console.error(error);
      message.reply("An error occurred while trying to delete messages.");
    }
  },
};
