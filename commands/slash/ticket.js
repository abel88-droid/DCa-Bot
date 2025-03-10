const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("tickets")
        .setDescription("Manage the recruitment system")
        .addSubcommand(subcommand =>
            subcommand
                .setName("setup")
                .setDescription("Set up the recruitment ticket system")
                .addStringOption(option =>
                    option.setName("header_of_main_embed")
                        .setDescription("The text that will be displayed in the header of the main embed.")
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option.setName("body_of_main_embed")
                        .setDescription("The text that will be displayed in the body of the main embed.")
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option.setName("header_of_ticket_embed")
                        .setDescription("The text that will be displayed in the header of the ticket embed.")
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option.setName("body_of_ticket_embed")
                        .setDescription("The text that will be displayed in the body of the ticket embed.")
                        .setRequired(true)
                )
        ),
};
