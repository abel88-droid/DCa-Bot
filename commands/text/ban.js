module.exports = {
  name: "ban",
  async execute(message, args) {
    const { PermissionsBitField } = require("discord.js"); 
if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      return message.reply("You don't have permission to use this command.");
    }

    const target = message.mentions.members.first(); // Get mentioned user
    const targetId = target ? target.id : args[0]; // Use mention or ID
    const reason = args.slice(target ? 1 : 1).join(" "); // Correctly extract reason

    if (!targetId) {
      return message.reply("Please mention a user or provide an ID to ban.");
    }

    if (!reason) {
      return message.reply("Please provide a reason for the ban.");
    }

    // DM the user before banning (only works if they haven't blocked the bot)
    try {
      const user = await message.client.users.fetch(targetId);
      await user.send(
        `You have been banned from **${message.guild.name}**.\nReason: **${reason}**\n\nIf you think this is a mistake, please contact b7m5, dc_void_ or gorillakurt`
      );
    } catch {
      message.channel.send("Couldn't send a DM to the user. Proceeding with the ban.");
    }

    // Ban the user by ID
    try {
      await message.guild.bans.create(targetId, { reason });
      message.channel.send(`🚨 **<@${targetId}> has been banned.**\nReason: **${reason}**`);
    } catch (error) {
      console.error(error);
      message.reply("Failed to ban the user. They may not exist or already be banned.");
    }
  },
};
