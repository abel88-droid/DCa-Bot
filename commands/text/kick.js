const { PermissionsBitField } = require("discord.js");

module.exports = {
  name: "kick",
  description: "Kicks a user from the server",
  execute(message, args) {
    if (!message.content.startsWith("-kick")) return; // Ensures it only triggers on "-kick"

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

    if (args.length < 2) {
      return message.reply("You must provide a reason for the kick. Usage: `-kick @user [reason]`");
    }

    const reason = args.slice(1).join(" ");

    member.kick(reason)
      .then(() => message.reply(`Successfully kicked **${member.user.tag}**. Reason: ${reason}`))
      .catch(error => {
        console.error(error);
        message.reply("An error occurred while trying to kick the user.");
      });
  },
};
