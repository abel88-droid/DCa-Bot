const { SlashCommandBuilder } = require('discord.js');
const ms = require('ms');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('remind')
    .setDescription('Set a reminder')
    .addStringOption(option =>
      option.setName('duration')
        .setDescription('When to remind you (e.g., 10m, 2h, 1d)')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('message')
        .setDescription('What should I remind you about?')
        .setRequired(true)
    ),

  async execute(interaction) {
    const durationInput = interaction.options.getString('duration');
    const reminderText = interaction.options.getString('message');
    const durationMs = ms(durationInput);

    if (!durationMs || durationMs < 5000) {
      return interaction.reply({ content: '⚠️ Please provide a valid duration (minimum 5s). Example: `10m`, `2h`', ephemeral: true });
    }

    await interaction.reply(`✅ Got it! I’ll remind you in **${durationInput}**.`);

    setTimeout(() => {
      interaction.user.send(`⏰ Reminder: **${reminderText}** (set ${durationInput} ago)`)
        .catch(() => interaction.channel.send(`<@${interaction.user.id}> ⏰ Reminder: **${reminderText}**`));
    }, durationMs);
  }
};
