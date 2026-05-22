module.exports = {
  name: "bam",
  async execute(message, args) {
    try {
      const target = message.mentions.users.first();

      if (!target) {
        return message.reply("Bruh who am I supposed to BAM? You want **yourself** to get blasted?");
      }

      const responses = [
        `BAM! **${target}** just got blasted into another dimension!`,
        `POW! **${target}** has been cooked extra crispy!`,
        `BOOM! **${target}** couldn't survive the BAM attack!`,
        `WHAM! **${target}** folded like a school uniform!`,
        `KABOOM! **${target}** got deleted… in your imagination`
      ];

      const random = responses[Math.floor(Math.random() * responses.length)];

      await message.channel.send(random);
    } 
    catch (err) {
      console.error("BAM command error:", err);
      message.reply("❌ Error executing this command");
    }
  },
};
