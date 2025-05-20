const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('top3km')
    .setDescription('Announce the top 3 KM drivers of the week')
    .addIntegerOption(option =>
      option.setName('chestlevel').setDescription('Chest level achieved').setRequired(true)
    )
    .addStringOption(option =>
      option.setName('first').setDescription('First place (mention or name)').setRequired(true)
    )
    .addStringOption(option =>
      option.setName('second').setDescription('Second place (mention or name)').setRequired(true)
    )
    .addStringOption(option =>
      option.setName('third').setDescription('Third place (mention or name)').setRequired(true)
    )
    .addAttachmentOption(option =>
      option.setName('screenshot').setDescription('Attach the event screenshot').setRequired(true)
    ),

  async execute(interaction) {
    const chestLevel = interaction.options.getInteger('chestlevel');
    const screenshot = interaction.options.getAttachment('screenshot');

    const resolveUser = async (input) => {
      const mentionMatch = input.match(/^<@!?(\d+)>$/);
      if (mentionMatch) {
        const userId = mentionMatch[1];
        try {
          const member = await interaction.guild.members.fetch(userId);
          return `<@${member.user.id}>`;
        } catch {
          return input;
        }
      }
      return input;
    };

    const firstRaw = interaction.options.getString('first');
    const secondRaw = interaction.options.getString('second');
    const thirdRaw = interaction.options.getString('third');

    const first = await resolveUser(firstRaw);
    const second = await resolveUser(secondRaw);
    const third = await resolveUser(thirdRaw);

    const embed = new EmbedBuilder()
      .setColor(0x1abc9c)
      .setTitle('Top 3 KM Drivers of the Week')
      .setDescription(`
We got **level ${chestLevel} chest!** this time🔥, Let's aim higher next time!💪🏻

Our top 3 km drivers for this week are :
🥇 1st: ${first}
🥈 2nd: ${second}
🥉 3rd: ${third}

Good work, top 3 drivers 🎉 and they have earned <@&1137828749753188382> for this week!  
Let's see who will be the next <@&1137828749753188382>!

Great work out there guys 👏🏻

Also **thanks to the rest of the members for contributing to the kms**.
      `)
      .setImage(screenshot.url);

    await interaction.reply({ embeds: [embed] });
  }
};
