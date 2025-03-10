const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("ytlist").setDescription("Shows the list of YouTube channels being tracked"),
  async execute(interaction) {
    let response = "**Tracked YouTube Channels:**\n";
    
    for (const { name, discordChannel } of Object.values(YOUTUBE_CHANNELS)) {
      response += `- **${name}** → <#${discordChannel}>\n`;
    }

    await interaction.reply({ content: response, ephemeral: true });
  },
};
