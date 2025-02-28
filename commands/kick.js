const { PermissionsBitField } = require("discord.js");

module.exports = {
  name: "kick",
  description: "Kicks a user from the server",
  execute(message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
      return message.reply("You do not have permission to use this command.");
    }

    const member = message.mentions.members.first();
    if (!member) {
      return message.reply("Please mention a valid member to kick.");
    }

    if (!member.kickable) {
      return message.reply("I cannot kick this user. They might have a higher role or I lack permissions.");
    }

    const reason = args.slice(1).join(" ") || "No reason provided";

    member.kick(reason)
      .then(() => message.reply(`✅ Successfully kicked **${member.user.tag}**. Reason: ${reason}`))
      .catch(error => {
        console.error(error);
        message.reply("An error occurred while trying to kick the user.");
      });
  },
};
