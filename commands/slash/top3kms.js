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
    try {
      console.log("Executing top3km command...");

      const pingRole = interaction.options.getRole('pingrole');
      const chestLevel = interaction.options.getInteger('chestlevel');
      const screenshot = interaction.options.getAttachment('screenshot');

      console.log(`Ping Role ID: ${pingRole.id}`);

      const resolveUser = async (input) => {
        const mentionMatch = input.match(/^<@!?(\d+)>$/);
        if (mentionMatch) {
          const userId = mentionMatch[1];
          try {
            const member = await interaction.guild.members.fetch(userId);
            return { mention: `<@${member.user.id}>`, id: member.user.id };
          } catch {
            return { mention: input, id: null };
          }
        }
        return { mention: input, id: null };
      };

      const firstUser = await resolveUser(interaction.options.getString('first'));
      const secondUser = await resolveUser(interaction.options.getString('second'));
      const thirdUser = await resolveUser(interaction.options.getString('third'));

      const rewardRoleId = '1137828749753188382';

      const embed = new EmbedBuilder()
        .setColor(0x1abc9c)
        .setTitle('Top 3 KM Drivers of the Week')
        .setDescription(`
<@&${pingRole.id}>

We got **level ${chestLevel} chest!** this time🔥, Let's aim higher next time!💪🏻

Our top 3 km drivers for this week are :
🥇 1st: ${firstUser.mention}
🥈 2nd: ${secondUser.mention}
🥉 3rd: ${thirdUser.mention}

Good work, top 3 drivers 🎉 and they have earned <@&${rewardRoleId}> for this week!  
Let's see who will be the next <@&${rewardRoleId}>!

Great work out there guys 👏🏻

Also **thanks to the rest of the members for contributing to the kms**.
        `)
        .setImage(screenshot.url);

      await interaction.reply({
        embeds: [embed],
        allowedMentions: {
          users: [firstUser.id, secondUser.id, thirdUser.id].filter(Boolean),
          roles: [pingRole.id, rewardRoleId],
        },
      });

      console.log("Message sent successfully.");
      
    } catch (error) {
      console.error("Error executing top3km command:", error);
      await interaction.reply({ content: "Oops! Something went wrong. Please check bot permissions and try again.", ephemeral: true });
    }
  }
};
