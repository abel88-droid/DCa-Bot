const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');  // ✅ Fix for discord.js v14+
const { calculateAverage } = require('../../utils/sheets');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('averagescore')
        .setDescription('Get the average score of a team')
        .addStringOption(option =>
            option.setName('teamname')  // ✅ Keep this lowercase
                  .setDescription('Name of the team')
                  .setRequired(true)),

    async execute(interaction) {
        const teamName = interaction.options.getString('teamname');  // ✅ Fix: Use lowercase here
        const response = await calculateAverage(teamName);

        // ✅ Fix: Replace MessageEmbed with EmbedBuilder
        const embed = new EmbedBuilder()
            .setTitle(`Average Score for ${teamName}`)
            .setDescription(response)
            .setColor('#00FF00');

        await interaction.reply({ embeds: [embed] });
    },
};
