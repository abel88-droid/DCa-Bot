const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("roles")
        .setDescription("Manage user roles")
        .addSubcommand(subcommand =>
            subcommand.setName("add")
                .setDescription("Add a role to a user")
                .addUserOption(option =>
                    option.setName("user")
                        .setDescription("The user to add the role to")
                        .setRequired(true))
                .addRoleOption(option =>
                    option.setName("role")
                        .setDescription("The role to add")
                        .setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand.setName("remove")
                .setDescription("Remove a role from a user")
                .addUserOption(option =>
                    option.setName("user")
                        .setDescription("The user to remove the role from")
                        .setRequired(true))
                .addRoleOption(option =>
                    option.setName("role")
                        .setDescription("The role to remove")
                        .setRequired(true))
        ),

    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        const user = interaction.options.getUser("user");
        const role = interaction.options.getRole("role");
        const member = interaction.guild.members.cache.get(user.id);

        if (!interaction.member.permissions.has("MANAGE_ROLES")) {
            return interaction.reply({ content: "❌ You don’t have permission to manage roles!", ephemeral: true });
        }

        if (subcommand === "add") {
            await member.roles.add(role);
            return interaction.reply({ content: `✅ Successfully added ${role} to ${user}.` });
        } else if (subcommand === "remove") {
            await member.roles.remove(role);
            return interaction.reply({ content: `✅ Successfully removed ${role} from ${user}.` });
        }
    }
};
