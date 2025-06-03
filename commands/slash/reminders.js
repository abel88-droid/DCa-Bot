const { SlashCommandBuilder } = require('discord.js');
const { getReminders } = require('../../utils/reminderManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('reminders')
    .setDescription('List your active reminders'),

  async execute(interaction) {
    const userReminders = getReminders(interaction.user.id);

    if (userReminders.length === 0) {
      return interaction.reply('📭 You have no active reminders!');
    }

    const list = userReminders.map(r => `• ID: ${r.id} – "${r.text}"`).join('\n');
    await interaction.reply(`📋 Your reminders:\n${list}`);
  }
};
