const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('top3te')
    .setDescription('Announce the top 3 winners of the team event')
    .addRoleOption(option =>
      option.setName('pingrole').setDescription('Ping role to tag').setRequired(true)
    )
    .addStringOption(option =>
      option.setName('first').setDescription('First place winner (mention or name)').setRequired(true)
    )
    .addStringOption(option =>
      option.setName('second').setDescription('Second place winner (mention or name)').setRequired(true)
    )
    .addStringOption(option =>
      option.setName('third').setDescription('Third place winner (mention or name)').setRequired(true)
    )
    .addAttachmentOption(option =>
      option.setName('screenshot').setDescription('Attach the event screenshot').setRequired(true)
    ),

  async execute(interaction) {
    const pingRole = interaction.options.getRole('pingrole');
    const screenshot = interaction.options.getAttachment('screenshot');

    // Helper function to resolve user mention or fallback
    async function resolveUser(input) {
      const mentionMatch = input.match(/^<@!?(\d+)>$/);
      if (mentionMatch) {
        const userId = mentionMatch[1];
        try {
          const member = await interaction.guild.members.fetch(userId);
          return `<@${member.user.id}>`; // valid mention
        } catch (err) {
          return input; // invalid ID or not in server
        }
      }
      return input; // plain name
    }

    // Resolve all positions
    const firstRaw = interaction.options.getString('first');
    const secondRaw = interaction.options.getString('second');
    const thirdRaw = interaction.options.getString('third');

    const first = await resolveUser(firstRaw);
    const second = await resolveUser(secondRaw);
    const third = await resolveUser(thirdRaw);

    const embed = new EmbedBuilder()
      .setColor(0xFFD700)
      .setTitle('🏆 Top 3 Winners - Team Event 🏆')
      .setDescription(`
<&${pingRole}>

Here are the top 3 scorers:

🥇 **First Position:** <&${first}>
🥈 **Second Position:** <&${second}>
🥉 **Third Position:** <&${third}>

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
