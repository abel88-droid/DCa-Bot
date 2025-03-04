const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType } = require("discord.js");

module.exports = {
  name: "ticket",
  description: "Sends a button to apply (creates a private thread).",
  execute: async (message, args) => {
    const button = new ButtonBuilder()
      .setCustomId("apply_ticket")
      .setLabel("Apply")
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(button);

    await message.channel.send({
      content: "Click the button below to apply and start a private thread.",
      components: [row],
    });
  },
};
