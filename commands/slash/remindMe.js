const { SlashCommandBuilder } = require('discord.js');
const ms = require('ms');
const { addReminder } = require('../../utils/reminderManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('remindme')
    .setDescription('Set a reminder')
    .addStringOption(opt => opt.setName('duration').setRequired(true).setDescription('e.g., 10m, 1h'))
    .addStringOption(opt => opt.setName('message').setRequired(true).setDescription('Reminder message')),

  async execute(interaction) {
    const durationInput = interaction.options.getString('duration');
    const messageText = interaction.options.getString('message');
    const durationMs = ms(durationInput);

    if (!durationMs || durationMs < 5000) {
      return interaction.reply({ content: '⚠️ Please enter a valid time (min 5s). Try `10m`, `1h`, etc.', ephemeral: true });
    }

    const id = addReminder(
      interaction.user.id,
      messageText,
      durationMs,
      () => interaction.user.send(`⏰ Reminder: ${messageText}`)
        .catch(() => interaction.channel.send(`<@${interaction.user.id}> ⏰ Reminder: ${messageText}`))
    );

    await interaction.reply(`✅ Reminder set! I’ll remind you in **${durationInput}** (ID: ${id})`);
  }
};
