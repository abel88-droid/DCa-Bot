const {
  SlashCommandBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  EmbedBuilder,
  AttachmentBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');
const path = require('path');

// Mastery data for sports car
const sportsCarMastery = [
  {
    title: 'REV SURGE',
    description: '📈 *Increased acceleration*',
    image: 'rev_surge.jpg',
  },
  {
    title: 'OVERDRIVE',
    description: '🚀 *Increased top speed*',
    image: 'overdrive.jpg',
  },
  {
    title: 'MEGA TANK',
    description: '⛽ *Expands fuel tank size*',
    image: 'mega_tank.jpg',
  },
  {
    title: 'EXTRA PART',
    description: '🛠️ *Unlocks 4th mastery slot*',
    image: 'extra_part.jpg',
  },
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('garage')
    .setDescription('Open your garage and view car masteries'),

  async execute(interaction) {
    const carSelect = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('select_car')
        .setPlaceholder('Choose a vehicle')
        .addOptions([
          {
            label: 'Sports Car',
            value: 'sports_car',
            emoji: '🏎️',
          },
        ])
    );

    await interaction.reply({
      content: '**Welcome to Mastery Garage!** Choose a vehicle to view its mastery:',
      components: [carSelect],
      ephemeral: true,
    });
  },

  // This export helps access mastery data from interaction handler
  masteries: {
    sports_car: sportsCarMastery,
  },
};

