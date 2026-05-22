const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');


const dataPath = path.join(__dirname, '../../data/memberCounts.json');
const messageIdPath = path.join(__dirname, '../../data/messageId.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('membercount')
    .setDescription('Displays the current member counts for all teams.'),
  async execute(interaction) {
    
    await interaction.deferReply({ ephemeral: true });

    try {
      const memberData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      const messageIdData = JSON.parse(fs.readFileSync(messageIdPath, 'utf8'));

      const channelId = messageIdData.channelId;
      let messageId = messageIdData.messageId;

      const channel = await interaction.client.channels.fetch(channelId);
      if (!channel) {
        await interaction.editReply('Error: The specified channel was not found.');
        return;
      }      
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

## Team 3- 🇦🇶 Discord 3™
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

      
      let targetMessage;
      if (messageId !== '0') {
        try {
          targetMessage = await channel.messages.fetch(messageId);
        } catch (error) {
          console.error('Error fetching message:', error);
        }
      }

      if (targetMessage) {
        await targetMessage.edit(messageContent);
        await interaction.editReply('Member count message updated successfully!');
      } else {
        const newMessage = await channel.send(messageContent);
        messageIdData.messageId = newMessage.id;
        fs.writeFileSync(messageIdPath, JSON.stringify(messageIdData, null, 2));
        await interaction.editReply('Member count message created successfully!');
      }
    } catch (error) {
      console.error('Error executing membercount command:', error);
      await interaction.editReply('There was an error processing the member counts. Please try again later.');
    }
  },
};
