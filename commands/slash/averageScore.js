const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');  
const { calculateAverage } = require('../../utils/sheets');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('averagescore')
        .setDescription('Get the average score from the spreadsheet'), // ✅ No team name needed

    async execute(interaction) {
        const response = await calculateAverage(); // ✅ Call without team name

        const embed = new EmbedBuilder()
            .setTitle(`Average Score`)
            .setDescription(response)
            .setColor('#00FF00');

        await interaction.reply({ embeds: [embed] });
    },
};
