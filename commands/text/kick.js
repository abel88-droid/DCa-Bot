const { PermissionsBitField, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "kick",
  description: "Kicks a user from the server",
  prefix: "-",
  async execute(message, args) {
    if (!message.content.startsWith(this.prefix)) return;

    if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
      return message.reply("You do not have permission to use this command.");
    }

    let member = message.mentions.members.first();
    if (!member) {
      
      const userId = args[0];
      try {
        member = await message.guild.members.fetch(userId);
      } catch (error) {
        return message.reply("Please mention a valid member or provide a valid user ID to kick.");
      }
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
      .setColor(0xFF0000)
      .setTitle(`You have been ${action}`)
      .setDescription(`You have been **${action}** from **${message.guild.name}**.`)
      .addFields(
        { name: "Reason", value: reason },
        { name: "Need Help?", value: "If you think this is a mistake, please contact:\n- gorillakurt\n- dc\\_void\\_ \n- b7m5" } 
      )
      .setTimestamp();

    // Sending DM
    member.send({ embeds: [dmEmbed] })
      .then(() => {
        
        member.kick(reason)
          .then(() => {
            message.reply(`Successfully kicked **${member.user.tag}**. Reason: ${reason}`);
          })
          .catch(error => {
            console.error(error);
            message.reply("An error occurred while trying to kick the user.");
          });
      })
      .catch(() => {
        // If DM fails lol
        message.reply(`⚠️ Could not send a DM to **${member.user.tag}**, but they will still be kicked.`);

        member.kick(reason)
          .then(() => {
            message.reply(`Successfully kicked **${member.user.tag}**. Reason: ${reason}`);
          })
          .catch(error => {
            console.error(error);
            message.reply("An error occurred while trying to kick the user.");
          });
      });
  },
};
