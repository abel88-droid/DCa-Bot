const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { calculateAverage } = require('../utils/sheets');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('averageSCR')
        .setDescription('Get the average score of a team')
        .addStringOption(option =>
            option.setName('teamName')
                  .setDescription('Name of the team')
                  .setRequired(true)),
    async execute(interaction) {
        const teamName = interaction.options.getString('teamName');
        const response = await calculateAverage(teamName);
        
        const embed = new MessageEmbed()
            .setTitle(`Average Score for ${teamName}`)
            .setDescription(response)
            .setColor('#00FF00');

        await interaction.reply({ embeds: [embed] });
    },
};
