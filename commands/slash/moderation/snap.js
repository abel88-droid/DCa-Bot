const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('snap')
    .setDescription('Thanos-style moderation command')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator) // 🔐 Admins only
    .addSubcommand(subcommand =>
      subcommand
        .setName('ban')
        .setDescription('Ban someone... the Thanos way')
        .addUserOption(option => 
          option.setName('user')
            .setDescription('User to ban')
            .setRequired(true))
        .addStringOption(option => 
          option.setName('reason')
            .setDescription('Reason for the snap')))
    .addSubcommand(subcommand =>
      subcommand
        .setName('kick')
        .setDescription('Kick someone... dramatically')
        .addUserOption(option => 
          option.setName('user')
            .setDescription('User to kick')
            .setRequired(true))
        .addStringOption(option => 
          option.setName('reason')
            .setDescription('Reason for the snap'))),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided.';
    const member = interaction.guild.members.cache.get(user.id);

    const quotes = [
      "You should’ve gone for the head.",
      "I am inevitable.",
      "Dread it. Run from it. Destiny arrives all the same.",
      "Perfectly balanced, as all things should be.",
      "Reality is often disappointing.",
    ];
    const quote = quotes[Math.floor(Math.random() * quotes.length)];

    if (!member) {
      return interaction.reply({ content: "User not found in this server.", ephemeral: true });
    }

    if (subcommand === 'ban') {
      if (!member.bannable) {
        return interaction.reply({ content: "⚠️ I can't snap that user. They're too powerful!", ephemeral: true });
      }

      await member.ban({ reason });

      const embed = new EmbedBuilder()
        .setTitle('💥 **Snap Ban Executed**')
        .setDescription(`💀 *"${quote}"*\n\n💨 **${user.tag} has been banned from the universe!**`)
        .setColor('#800080')
        .setImage('https://media.tenor.com/1B8uvL_sUwEAAAAC/thanos-snap.gif')
        .setFooter({ text: `Snapped by ${interaction.user.tag}` })
        .setTimestamp();

      return interaction.reply({ embeds: [embed] });
    }

    if (subcommand === 'kick') {
      if (!member.kickable) {
        return interaction.reply({ content: "⚠️ I can't snap that user. They're too powerful!", ephemeral: true });
      }

      await member.kick(reason);

      const embed = new EmbedBuilder()
        .setTitle('💨 **Snap Kick Executed**')
        .setDescription(`*"${quote}"*\n\n **${user.tag} has been kicked out of existence!**`)
        .setColor('#990000')
        .setImage('https://media.tenor.com/G9dQID3iMjUAAAAC/thanos.gif')
        .setFooter({ text: `Snapped by ${interaction.user.tag}` })
        .setTimestamp();

      return interaction.reply({ embeds: [embed] });
    }
  }
};
