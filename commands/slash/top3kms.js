const { SlashCommandBuilder } = require('discord.js');

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
      option.setName('first').setDescription('First place (mention or user ID)').setRequired(true)
    )
    .addStringOption(option =>
      option.setName('second').setDescription('Second place (mention or user ID)').setRequired(true)
    )
    .addStringOption(option =>
      option.setName('third').setDescription('Third place (mention or user ID)').setRequired(true)
    )
    .addAttachmentOption(option =>
      option.setName('screenshot').setDescription('Attach the event screenshot').setRequired(true)
    ),

  async execute(interaction) {
    try {
      const pingRole = interaction.options.getRole('pingrole');
      const chestLevel = interaction.options.getInteger('chestlevel');
      const screenshot = interaction.options.getAttachment('screenshot');

      const resolveUser = async (input) => {
        const match = input.match(/<@!?(\d+)>|(\d{17,})/);
        const userId = match?.[1] || match?.[2];
        if (!userId) return { mention: input, id: null };

        try {
          const member = await interaction.guild.members.fetch(userId);
          return { mention: `${member.toString()} (${member.displayName})`, id: member.id };
        } catch {
          return { mention: `<@${userId}> (Unknown User)`, id: userId };
        }
      };

      const firstUser = await resolveUser(interaction.options.getString('first'));
      const secondUser = await resolveUser(interaction.options.getString('second'));
      const thirdUser = await resolveUser(interaction.options.getString('third'));

      const rewardRoleId = '1137828749753188382';

      const message = `
<@&${pingRole.id}>

We got **level ${chestLevel} chest!** this time🔥, Let's aim higher next time!💪🏻

Our top 3 km drivers for this week are:
🥇 1st: ${firstUser.mention}
🥈 2nd: ${secondUser.mention}
🥉 3rd: ${thirdUser.mention}

Good work, top 3 drivers 🎉 and they have earned <@&${rewardRoleId}> for this week!
Let's see who will be the next <@&${rewardRoleId}>!

Great work out there guys 👏🏻

Also **thanks to the rest of the members for contributing to the kms**.

${screenshot.url}
      `;

      await interaction.reply({
        content: message,
        allowedMentions: {
          users: [firstUser.id, secondUser.id, thirdUser.id].filter(Boolean),
          roles: [pingRole.id, rewardRoleId],
        },
      });
    } catch (error) {
      console.error("Error executing top3km command:", error);
      await interaction.reply({
        content: "Oops! Something went wrong. Please make sure the bot can see all members.",
        ephemeral: true,
      });
    }
  }
};
