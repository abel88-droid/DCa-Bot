const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sportscar')
    .setDescription('Displays tuning parts for the sports car.'),
  async execute(interaction) {
    
    const rev = new AttachmentBuilder(path.join(__dirname, '../images/rev_surge.jpg'));
    const overdrive = new AttachmentBuilder(path.join(__dirname, '../images/overdrive.jpg'));
    const mega = new AttachmentBuilder(path.join(__dirname, '../images/mega_tank.jpg'));
    const extra = new AttachmentBuilder(path.join(__dirname, '../images/extra_part.jpg'));

    
    const revEmbed = new EmbedBuilder()
      .setTitle('🏎️ REV SURGE')
      .setDescription('📈 *Increased acceleration*')
      .setImage('attachment://rev_surge.jpg')
      .setColor(0xff0000);

    const overdriveEmbed = new EmbedBuilder()
      .setTitle('🚀 OVERDRIVE')
      .setDescription('🔥 *Increased top speed*')
      .setImage('attachment://overdrive.jpg')
      .setColor(0xffa500);

    const megaEmbed = new EmbedBuilder()
      .setTitle('⛽ MEGA TANK')
      .setDescription('💧 *Increased fuel tank size*')
      .setImage('attachment://mega_tank.jpg')
      .setColor(0x0000ff);

    const extraEmbed = new EmbedBuilder()
      .setTitle('🛠️ EXTRA PART')
      .setDescription('🔓 *Unlocks the 4th tuning part slot*')
      .setImage('attachment://extra_part.jpg')
      .setColor(0x00ff00);

    await interaction.reply({
      embeds: [revEmbed, overdriveEmbed, megaEmbed, extraEmbed],
      files: [rev, overdrive, mega, extra],
    });
  },
};
