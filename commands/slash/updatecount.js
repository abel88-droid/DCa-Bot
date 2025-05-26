const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Path to the member counts JSON file
const dataPath = path.join(__dirname, '../../data/memberCounts.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('updatecount')
    .setDescription('Updates member counts or recruitment status for a team.')
    .addStringOption(option =>
      option
        .setName('team')
        .setDescription('The team to update (e.g., Discord, Discord², etc.)')
        .setRequired(true)
        .addChoices(
          { name: 'Discord', value: 'Discord' },
          { name: 'Discord²', value: 'Discord²' },
          { name: 'Discord 3™️', value: 'Discord 3™️' },
          { name: 'Baja DC', value: 'Baja DC' },
          { name: 'Formula DCx', value: 'Formula DCx' },
          { name: 'Rally DCy', value: 'Rally DCy' }
        )
    )
    .addStringOption(option =>
      option
        .setName('field')
        .setDescription('The field to update (players or recruitment)')
        .setRequired(true)
        .addChoices(
          { name: 'Number of Players', value: 'players' },
          { name: 'Recruitment Status', value: 'recruitment' }
        )
    )
    .addStringOption(option =>
      option
        .setName('value')
        .setDescription('The new value (number for players, "Open" or "Closed" for recruitment)')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator), // Restrict to admins
  async execute(interaction) {
    // Defer the reply since file operations might take a moment
    await interaction.deferReply({ ephemeral: true });

    try {
      // Get the options
      const team = interaction.options.getString('team');
      const field = interaction.options.getString('field');
      const value = interaction.options.getString('value');

      // Read the current data
      const memberData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

      // Validate the team
      if (!memberData[team]) {
        await interaction.editReply(`Invalid team: ${team}. Please choose a valid team.`);
        return;
      }

      // Validate and update the field
      if (field === 'players') {
        const numValue = parseInt(value);
        if (isNaN(numValue) || numValue < 0) {
          await interaction.editReply('Please provide a valid number for players (e.g., 45).');
          return;
        }
        memberData[team].players = numValue;
      } else if (field === 'recruitment') {
        const normalizedValue = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
        if (!['Open', 'Closed'].includes(normalizedValue)) {
          await interaction.editReply('Recruitment status must be "Open" or "Closed".');
          return;
        }
        memberData[team].recruitment = normalizedValue;
      }

      // Write the updated data back to the file
      fs.writeFileSync(dataPath, JSON.stringify(memberData, null, 2));

      // Reply with confirmation
      await interaction.editReply(`Updated ${team} ${field} to ${value} successfully! Use /membercount to see the updated list.`);
    } catch (error) {
      console.error('Error executing updatecount command:', error);
      await interaction.editReply('There was an error updating the member counts. Please try again later.');
    }
  },
};
