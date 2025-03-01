const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("role")
    .setDescription("Manage user roles.")
    .addSubcommand(subcommand =>
      subcommand
        .setName("add")
        .setDescription("Add a role to a user.")
        .addUserOption(option =>
          option.setName("user").setDescription("Select a user").setRequired(true)
        )
        .addRoleOption(option =>
          option.setName("role").setDescription("Select a role").setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName("remove")
        .setDescription("Remove a role from a user.")
        .addUserOption(option =>
          option.setName("user").setDescription("Select a user").setRequired(true)
        )
        .addRoleOption(option =>
          option.setName("role").setDescription("Select a role").setRequired(true)
        )
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const user = interaction.options.getUser("user");
    const role = interaction.options.getRole("role");
    const member = await interaction.guild.members.fetch(user.id);

    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
      return interaction.reply({ content: "❌ You don't have permission to manage roles!", ephemeral: true });
    }

    if (subcommand === "add") {
      await member.roles.add(role);
      await interaction.reply({ content: `✅ Added ${role} to ${user}.`, ephemeral: true });
    } else if (subcommand === "remove") {
      await member.roles.remove(role);
      await interaction.reply({ content: `✅ Removed ${role} from ${user}.`, ephemeral: true });
    }
  },
};
