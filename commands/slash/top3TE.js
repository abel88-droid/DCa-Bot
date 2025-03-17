const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('topwinners')
    .setDescription('Announce the top 3 winners of the team event')
    .addUserOption(option => option.setName('first').setDescription('First place winner').setRequired(true))
    .addUserOption(option => option.setName('second').setDescription('Second place winner').setRequired(true))
    .addUserOption(option => option.setName('third').setDescription('Third place winner').setRequired(true))
    .addAttachmentOption(option => option.setName('screenshot').setDescription('Attach the event screenshot').setRequired(true)),

  async execute(interaction) {
    const first = interaction.options.getUser('first');
    const second = interaction.options.getUser('second');
    const third = interaction.options.getUser('third');
    const screenshot = interaction.options.getAttachment('screenshot');

    const embed = new EmbedBuilder()
      .setColor(0xFFD700)
      .setTitle('🏆 Top 3 Winners - Team Event 🏆')
      .setDescription(`
Here are the top 3 scorers:

🥇 **First Position:** ${first}
🥈 **Second Position:** ${second}
🥉 **Third Position:** ${third}

Congratulations to all three podium winners! 🎉🎊

**Great win everyone! Good job!**  
And **thanks to the rest of the team** for your contribution.  

**See You Next Match**  
**Good Luck! 🍀**
      `)
      .setImage(screenshot.url);

    await interaction.reply({ embeds: [embed] });
  }
};
