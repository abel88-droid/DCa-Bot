const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('teameventsummaryF')
    .setDescription('Summary of Team Event after Match')
    .addStringOption(option =>
      option
        .setName('won_streak')
        .setDescription('Enter the won streak (e.g., "5 wins")')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('lost_streak')
        .setDescription('Enter the lost streak (e.g., "2 losses")')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('topper1')
        .setDescription('Enter the first match topper name')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('topper2')
        .setDescription('Enter the second match topper name')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('topper3')
        .setDescription('Enter the third match topper name')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('total_points_match')
        .setDescription('Enter the total points of the match')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('total_points')
        .setDescription('Enter the total points overall')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('total_points_gained')
        .setDescription('Enter the total points gained')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('aura_count')
        .setDescription('Enter the aura count')
        .setRequired(true)
    )
    .addRoleOption(option =>
      option
        .setName('ping_role')
        .setDescription('Select the role to ping outside the embed')
        .setRequired(false)
    )
    .addAttachmentOption(option =>
      option
        .setName('screenshot')
        .setDescription('Upload a screenshot for the event summary')
        .setRequired(false)
    ),

  async execute(interaction) {
    // Retrieve the input options from the interaction
    const wonStreak = interaction.options.getString('won_streak');
    const lostStreak = interaction.options.getString('lost_streak');
    const topper1 = interaction.options.getString('topper1');
    const topper2 = interaction.options.getString('topper2');
    const topper3 = interaction.options.getString('topper3');
    const totalPointsMatch = interaction.options.getString('total_points_match');
    const totalPoints = interaction.options.getString('total_points');
    const totalPointsGained = interaction.options.getString('total_points_gained');
    const auraCount = interaction.options.getString('aura_count');
    const pingRole = interaction.options.getRole('ping_role');
    const screenshot = interaction.options.getAttachment('screenshot');

    // Create an embed with the summary details
    const summaryEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle('Summary of Team Event after Match')
      .addFields(
        { name: 'Won Streak', value: wonStreak, inline: false },
        { name: 'Lost Streak', value: lostStreak, inline: false },
        {
          name: 'Match Toppers',
          value: `1. ${topper1}\n2. ${topper2}\n3. ${topper3}`,
          inline: false,
        },
        { name: 'Total Points of Match', value: totalPointsMatch, inline: true },
        { name: 'Total Points', value: totalPoints, inline: true },
        { name: 'Total Points Gained', value: totalPointsGained, inline: true },
        { name: 'Aura Count', value: auraCount, inline: true }
      )
      .setTimestamp();

    // If a screenshot was uploaded, include it as an image in the embed
    if (screenshot) {
      summaryEmbed.setImage(screenshot.url);
    }

    // Prepare content string containing the ping; it will appear outside the embed.
    let content = '';
    if (pingRole) {
      content = `<@&${pingRole.id}>`;
    }

    // Reply by pinging the role (if provided) and showing the embed summary
    await interaction.reply({ content, embeds: [summaryEmbed] });
  },
};
