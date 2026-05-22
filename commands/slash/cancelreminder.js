const { SlashCommandBuilder } = require('discord.js');
const { removeReminder } = require('../../utils/reminderManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('cancelreminder')
    .setDescription('Cancel a reminder by ID')
    .addIntegerOption(opt =>
      opt.setName('id')
        .setDescription('The ID of the reminder to cancel')
        .setRequired(true)
    ),

  async execute(interaction) {
    const id = interaction.options.getInteger('id');
    const success = removeReminder(interaction.user.id, id);

    if (success) {
      await interaction.reply(`✅ Reminder ID ${id} cancelled!`);
    } else {
      await interaction.reply(`⚠️ No reminder found with ID ${id}.`);
    }
  }
};
