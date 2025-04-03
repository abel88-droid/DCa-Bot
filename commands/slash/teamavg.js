const { SlashCommandBuilder } = require('discord.js');
const { getAverageScore } = require('../sheets'); 

module.exports = {
    data: new SlashCommandBuilder()
        .setName('teamavg')
        .setDescription('Get the average score of a team from Google Sheets')
        .addStringOption(option =>
            option.setName('teamname')
                .setDescription('The name of the team')
                .setRequired(true)),

    async execute(interaction) {
        await interaction.deferReply();
        const teamName = interaction.options.getString('teamname');

        const avgScore = await getAverageScore(teamName);

        if (avgScore !== null) {
            await interaction.editReply(`The average score for **${teamName}** is **${avgScore}**.`);
        } else {
            await interaction.editReply(`No data found for team **${teamName}**.`);
        }
    }
};
