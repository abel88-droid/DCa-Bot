const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Path to the member counts JSON file
const dataPath = path.join(__dirname, '../../data/memberCounts.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('membercount')
    .setDescription('Displays the current member counts for all teams.'),
  async execute(interaction) {
    // Defer the reply since fetching data might take a moment
    await interaction.deferReply();

    try {
      // Read the member counts from the JSON file
      const memberData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

      // Format the message using the real team names
      const message = `
# Member Count
## Team 1- 🇦🇶 Discord 
(Division-CC)
Number of Players- ${memberData['Discord'].players}
Recruitment Status- ${memberData['Discord'].recruitment}

## Team 2- 🇦🇶 Discord²
(Division-CC)
Number of Players- ${memberData['Discord²'].players}
Recruitment Status- ${memberData['Discord²'].recruitment}

## Team 3- 🇮🇳 Discord 3™️
(Division-I)
Number of Players- ${memberData['Discord 3™️'].players}
Recruitment Status- ${memberData['Discord 3™️'].recruitment}

## Team 4- 🇦🇶 Baja DC
(Division-II)
Number of Players- ${memberData['Baja DC'].players}
Recruitment Status- ${memberData['Baja DC'].recruitment}

## Team 5- 🇦🇶 Formula DCx
(Division-VI)
Number of Players- ${memberData['Formula DCx'].players}
Recruitment Status- ${memberData['Formula DCx'].recruitment}

## Team 6- 🇦🇶 Rally DCy
(Division-IV)
Number of Players- ${memberData['Rally DCy'].players}
Recruitment Status- ${memberData['Rally DCy'].recruitment}
      `;

      // Send the message
      await interaction.editReply(message);
    } catch (error) {
      console.error('Error executing membercount command:', error);
      await interaction.editReply('There was an error fetching the member counts. Please try again later.');
    }
  },
};
