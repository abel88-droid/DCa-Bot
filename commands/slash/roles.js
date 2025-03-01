const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("roles")
        .setDescription("Manage roles")
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
        ),
    async execute(interaction) {
        await interaction.reply("Roles command executed!");
    },
};
