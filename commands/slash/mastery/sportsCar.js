const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sportscar')
    .setDescription('Displays mastery items for the sports car.'),
  async execute(interaction) {
    const rev = new AttachmentBuilder(path.join(__dirname, 'images/rev_surge.jpg'));
    const overdrive = new AttachmentBuilder(path.join(__dirname, 'images/overdrive.jpg'));
    const mega = new AttachmentBuilder(path.join(__dirname, 'images/mega_tank.jpg'));
    const extra = new AttachmentBuilder(path.join(__dirname, 'images/extra_part.jpg'));

    const embeds = [
      new EmbedBuilder()
        .setTitle('🏎️ Sports Car – REV SURGE')
        .setDescription('**Increased acceleration**')
        .setThumbnail('attachment://rev_surge.jpg')
        .setColor(0xff9900),

      new EmbedBuilder()
        .setTitle('🏎️ Sports Car – OVERDRIVE')
        .setDescription('**Boosts top speed**')
        .setThumbnail('attachment://overdrive.jpg')
        .setColor(0xff9900),

      new EmbedBuilder()
        .setTitle('🏎️ Sports Car – MEGA TANK')
        .setDescription('**Expands fuel tank size**')
        .setThumbnail('attachment://mega_tank.jpg')
        .setColor(0xff9900),

      new EmbedBuilder()
        .setTitle('🏎️ Sports Car – EXTRA PART')
        .setDescription('**Unlocks 4th mastery slot**')
        .setThumbnail('attachment://extra_part.jpg')
        .setColor(0xff9900),
    ];

    await interaction.reply({
      content: '**🏎️ Sports Car – Mastery Items**',
      embeds,
      files: [rev, overdrive, mega, extra],
    });
  },
};
