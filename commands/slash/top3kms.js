const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('top3km')
    .setDescription('Announce the top 3 KM drivers of the week')
    .addRoleOption(option =>
      option.setName('pingrole').setDescription('Ping role to mention at the top').setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName('chestlevel').setDescription('Chest level achieved').setRequired(true)
    )
    .addStringOption(option =>
      option.setName('first').setDescription('First place (mention or ID)').setRequired(true)
    )
    .addStringOption(option =>
      option.setName('second').setDescription('Second place (mention or ID)').setRequired(true)
    )
    .addStringOption(option =>
      option.setName('third').setDescription('Third place (mention or ID)').setRequired(true)
    )
    .addAttachmentOption(option =>
      option.setName('screenshot').setDescription('Attach the event screenshot').setRequired(true)
    ),

  async execute(interaction) {
    try {
      const pingRole = interaction.options.getRole('pingrole');
      const chestLevel = interaction.options.getInteger('chestlevel');
      const screenshot = interaction.options.getAttachment('screenshot');

      const getMemberMention = async (input) => {
        const match = input.match(/<@!?(\d+)>|(\d{17,})/);
        const userId = match?.[1] || match?.[2];
        if (!userId) return input;

        try {
          const member = await interaction.guild.members.fetch(userId);
          return { mention: member.toString(), id: member.id };
        } catch {
          return { mention: `<@${userId}>`, id: userId };
        }
      };

      const first = await getMemberMention(interaction.options.getString('first'));
      const second = await getMemberMention(interaction.options.getString('second'));
      const third = await getMemberMention(interaction.options.getString('third'));

      const rewardRoleId = '1137828749753188382';

      const embed = new EmbedBuilder()
        .setColor(0x1abc9c)
        .setTitle('Top 3 KM Drivers of the Week')
        .setDescription(`
<@&${pingRole.id}>

We got **level ${chestLevel} chest!** this time🔥, Let's aim higher next time!💪🏻

Our top 3 km drivers for this week are:
🥇 1st: ${first.mention}
🥈 2nd: ${second.mention}
🥉 3rd: ${third.mention}

Good work, top 3 drivers 🎉 and they have earned <@&${rewardRoleId}> for this week!  
Let's see who will be the next <@&${rewardRoleId}>!

Great work out there guys 👏🏻

Also **thanks to the rest of the members for contributing to the kms**.
        `)
        .setImage(screenshot.url);

      await interaction.reply({
        embeds: [embed],
        allowedMentions: {
          users: [first.id, second.id, third.id].filter(Boolean),
          roles: [pingRole.id, rewardRoleId],
        },
      });

    } catch (error) {
      console.error("Error:", error);
      await interaction.reply({ content: "Something went wrong!", ephemeral: true });
    }
  }
};
