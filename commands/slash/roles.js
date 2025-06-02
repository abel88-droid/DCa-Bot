const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("roles")
        .setDescription("Manage roles")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
        .addSubcommand(subcommand =>
            subcommand
                .setName("add")
                .setDescription("Add a role to a user")
                .addUserOption(option =>
                    option.setName("user")
                        .setDescription("User to assign the role")
                        .setRequired(true))
                .addRoleOption(option =>
                    option.setName("role")
                        .setDescription("Role to assign")
                        .setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("remove")
                .setDescription("Remove a role from a user")
                .addUserOption(option =>
                    option.setName("user")
                        .setDescription("User to remove the role from")
                        .setRequired(true))
                .addRoleOption(option =>
                    option.setName("role")
                        .setDescription("Role to remove")
                        .setRequired(true))
        ),

    async execute(interaction) {
        
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
            return interaction.reply({ content: "❌ You don't have permission to use this command.", ephemeral: true });
        }

        
        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageRoles)) {
            return interaction.reply({ content: "❌ I need the 'Manage Roles' permission to perform this action.", ephemeral: true });
        }

        const subcommand = interaction.options.getSubcommand();
        const user = interaction.options.getUser("user");
        const role = interaction.options.getRole("role");
        const member = await interaction.guild.members.fetch(user.id);

        if (!member) {
            return interaction.reply({ content: "User not found.", ephemeral: true });
        }

        if (subcommand === "add") {
            if (member.roles.cache.has(role.id)) {
                return interaction.reply({ content: `${user} already has the ${role} role.`, ephemeral: true });
            }

            await member.roles.add(role);
            return interaction.reply({ content: `✅ Added ${role} to ${user}.`, ephemeral: true });
        }

        if (subcommand === "remove") {
            if (!member.roles.cache.has(role.id)) {
                return interaction.reply({ content: `${user} does not have the ${role} role.`, ephemeral: true });
            }

            await member.roles.remove(role);
            return interaction.reply({ content: `✅ Removed ${role} from ${user}.`, ephemeral: true });
        }
    },
};
