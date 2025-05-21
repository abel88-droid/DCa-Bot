module.exports = {
  name: "ban",
  async execute(message, args) {
    if (!message.member.permissions.has("BAN_MEMBERS")) {
      return message.reply("You don't have permission to use this command.");
    }

    const targetId = args[0]; // First argument could be a mention or an ID
    const reason = args.slice(1).join(" ") || "No reason provided";

    if (!targetId) {
      return message.reply("Please provide a user to ban.");
    }

    let target = message.mentions.members.first();

    // If no mention is found, try fetching by ID
    if (!target) {
      try {
        target = await message.guild.members.fetch(targetId);
      } catch {
        return message.reply("User not found.");
      }
    }

    if (!target.bannable) {
      return message.reply("I cannot ban this user.");
    }

    // DM the user before banning them
    try {
      await target.send(
        `You have been banned from **${message.guild.name}**.\nReason: **${reason}**\n\nIf you think this is a mistake, please contact |DC|SockS#0724, dc_devilx or gorillakurt.`
      );
    } catch {
      message.channel.send("Couldn't send a DM to the user. Proceeding with the ban.");
    }

    await target.ban({ reason });
    message.channel.send(`**${target.user.tag}** has been banned. Reason: **${reason}**`);
  },
};
