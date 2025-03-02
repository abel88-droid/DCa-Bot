const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban a user from the server")
    .addUserOption(option => 
      option.setName("user")
        .setDescription("User to ban")
        .setRequired(true))
    .addStringOption(option => 
      option.setName("reason")
        .setDescription("Reason for the ban")
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers), // Restrict to those with ban permissions

  async execute(interaction) {
    const target = interaction.options.getMember("user");
    const reason = interaction.options.getString("reason") || "No reason provided";

    if (!target) {
      return interaction.reply({ content: "User not found.", ephemeral: true });
    }

    if (!target.bannable) {
      return interaction.reply({ content: "I cannot ban this user.", ephemeral: true });
    }

    await target.ban({ reason });

    return interaction.reply({ content: `✅ **${target.user.tag}** has been banned. Reason: **${reason}**`, ephemeral: false });
  },
};
