const { PermissionsBitField, EmbedBuilder } = require("discord.js");

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

    if (args.length < 2) {
      return message.reply("Please provide a reason for the kick.");
    }

    const reason = args.slice(1).join(" ");
    const action = "Kicked";

    // DM Embed
    const dmEmbed = new EmbedBuilder()
      .setColor("0xFF0000")
      .setTitle(`You have been ${action}`)
      .setDescription(`You have been **${action}** from **${message.guild.name}**.`)
      .addFields({ name: "Reason", value: reason })
      .setFooter({ text: "If you think this is a mistake, please contact |DC|SockS#0724, dc_devil. or Gorilla Kurt#2758." })
      .setTimestamp();

    member.send({ embeds: [dmEmbed] }).catch(() => {
      console.log(`Could not send DM to ${member.user.tag}`);
    });

    // Kick the user
    member.kick(reason)
      .then(() => {
        message.reply(`Successfully kicked **${member.user.tag}**. Reason: ${reason}`);
      })
      .catch(error => {
        console.error(error);
        message.reply("An error occurred while trying to kick the user.");
      });
  },
};
