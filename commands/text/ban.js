module.exports = {
  name: "ban",
  async execute(message, args) {
    if (!message.member.permissions.has("BAN_MEMBERS")) {
      return message.reply("You don't have permission to use this command.");
    }

    const targetId = args[0]; // First argument should be a user ID
    const reason = args.slice(1).join(" ");

    if (!targetId) {
      return message.reply("Please provide a user ID to ban.");
    }

    if (!reason) {
      return message.reply("Please provide a reason for the ban.");
    }

    // DM the user before banning (only works if they haven't blocked the bot)
    try {
      const user = await message.client.users.fetch(targetId);
      await user.send(
        `You have been banned from **${message.guild.name}**.\nReason: **${reason}**\n\nIf you think this is a mistake, please contact |DC|SockS#0724, dc_devilx or gorillakurt.`
      );
    } catch {
      message.channel.send("Couldn't send a DM to the user. Proceeding with the ban.");
    }

    // Ban the user by ID
    try {
      await message.guild.bans.create(targetId, { reason });
      message.channel.send(`**User with ID ${targetId}** has been banned. Reason: **${reason}**`);
    } catch (error) {
      console.error(error);
      message.reply("Failed to ban the user. They may not exist or already be banned.");
    }
  },
};
