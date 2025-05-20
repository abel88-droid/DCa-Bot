const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('top3te')
    .setDescription('Announce the top 3 winners of the team event')
    .addRoleOption(option =>
      option.setName('pingrole')
        .setDescription('Select the role to ping')
        .setRequired(true)
    )
    .addUserOption(option =>
      option.setName('first')
        .setDescription('First place winner')
        .setRequired(true)
    )
    .addUserOption(option =>
      option.setName('second')
        .setDescription('Second place winner')
        .setRequired(true)
    )
    .addUserOption(option =>
      option.setName('third')
        .setDescription('Third place winner')
        .setRequired(true)
    )
    .addAttachmentOption(option =>
      option.setName('screenshot')
        .setDescription('Attach the event screenshot')
        .setRequired(true)
    ),

  async execute(interaction) {
    const pingRole = interaction.options.getRole('pingrole');
    const firstUser = interaction.options.getUser('first');
    const secondUser = interaction.options.getUser('second');
    const thirdUser = interaction.options.getUser('third');
    const screenshot = interaction.options.getAttachment('screenshot');

    const first = firstUser ? firstUser.toString() : '`User not found`';
    const second = secondUser ? secondUser.toString() : '`User not found`';
    const third = thirdUser ? thirdUser.toString() : '`User not found`';

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

    await interaction.reply({
      content: `${pingRole}`, // Pings the selected role
      embeds: [embed],
      allowedMentions: { roles: [pingRole.id] } // Makes sure the role ping is actually sent
    });
  }
};
