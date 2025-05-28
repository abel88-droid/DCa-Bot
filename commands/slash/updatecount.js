const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Paths to data files
const dataPath = path.join(__dirname, '../../data/memberCounts.json');
const messageIdPath = path.join(__dirname, '../../data/messageId.json');

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
      const messageIdData = JSON.parse(fs.readFileSync(messageIdPath, 'utf8'));

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

      // Update the member count message
      const channelId = messageIdData.channelId;
      let messageId = messageIdData.messageId;

      const channel = await interaction.client.channels.fetch(channelId);
      if (!channel) {
        await interaction.editReply('Error: The specified channel was not found.');
        return;
      }

      // Format the updated member count message
      const messageContent = `
# Member Count
## Team 1- 🇦🇶 Discord 
(Division-CC)
Number of Players- ${memberData['Discord'].players}
Recruitment Status- ${memberData['Discord'].recruitment}

## Team 2- 🇦🇶 Discord²
(Division-CC)
Number of Players- ${memberData['Discord²'].players}
Recruitment Status- ${memberData['Discord²'].recruitment}

## Team 3- 🇦🇶 Discord 3™️
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

      // Try to fetch the existing message
      let targetMessage;
      if (messageId !== '0') {
        try {
          targetMessage = await channel.messages.fetch(messageId);
        } catch (error) {
          console.error('Error fetching message:', error);
        }
      }

      if (targetMessage) {
        // If the message exists, edit it
        await targetMessage.edit(messageContent);
      } else {
        // If the message doesn't exist, send a new one and store its ID
        const newMessage = await channel.send(messageContent);
        messageIdData.messageId = newMessage.id;
        fs.writeFileSync(messageIdPath, JSON.stringify(messageIdData, null, 2));
      }

      // Reply with confirmation
      await interaction.editReply(`Updated ${team} ${field} to ${value} successfully! The member count message has been updated.`);
    } catch (error) {
      console.error('Error executing updatecount command:', error);
      await interaction.editReply('There was an error updating the member counts. Please try again later.');
    }
  },
};
