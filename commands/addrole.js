const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("addrole")
    .setDescription("Assign a role to a user.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addUserOption(option => 
      option.setName("user")
        .setDescription("Select the user")
        .setRequired(true)
    )
    .addRoleOption(option =>
      option.setName("role")
        .setDescription("Select the role to assign")
        .setRequired(true)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser("user");
    const role = interaction.options.getRole("role");
    const member = interaction.guild.members.cache.get(user.id);

    if (member.roles.cache.has(role.id)) {
      return interaction.reply({ content: `❌ **${user.username}** already has the **${role.name}** role.`, ephemeral: true });
    }

    await member.roles.add(role);
    await interaction.reply({ content: `✅ Successfully added **${role.name}** to **${user.username}**.`, ephemeral: true });
  },
};
