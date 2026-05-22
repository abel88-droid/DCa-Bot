const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "announce",
  description: "Send an announcement in this channel.\nUsage: -announce <title> | <message>",

  async execute(message, args) {
    const DEV_ROLE_ID = "839536675067002950";

    if (!message.member.roles.cache.has(DEV_ROLE_ID)) {
      return message.reply("You are not allowed to use this command.");
    }

    if (args.length === 0) {
      return message.reply("Usage: -announce <title> | <message>");
    }

    const input = args.join(" ");
    const [title, description] = input.split("|").map(x => x.trim());

    if (!title || !description) {
      return message.reply("Format: -announce <title> | <message>");
    }

    const embed = new EmbedBuilder()
      .setTitle(title)
      .setDescription(description)
      .setColor("#00b0f4")
      .setFooter({ text: `Announcement by ${message.author.tag}` })
      .setTimestamp();

    try {
      await message.delete();
      await message.channel.send({ embeds: [embed] });
    } catch (err) {
      console.error(err);
      message.reply("Failed to send announcement.");
    }
  }
};
