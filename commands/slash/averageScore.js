const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');  
const { calculateAverage } = require('../../utils/sheets');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('averagescr')
        .setDescription('Get the average score of Discord²')
        .addStringOption(option =>
            option.setName('teamcode')  
                  .setDescription('Enter "dc2" to get Discord²\'s score')
                  .setRequired(true)),

    async execute(interaction) {
        const teamCode = interaction.options.getString('teamcode');  
        
        let teamName = teamCode === 'dc2' ? 'Discord²' : teamCode;
        
        const response = await calculateAverage();

        const embed = new EmbedBuilder()
            .setTitle(`Average score of ${teamName}`)
            .setDescription(response)
            .setColor('#00FF00');

        await interaction.reply({ embeds: [embed] });
    },
};
