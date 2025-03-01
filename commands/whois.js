const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "whois",
  description: "Displays information about a user.",
  async execute(message, args) {
    let user = message.mentions.users.first() || message.author;
    let member = message.guild.members.cache.get(user.id);

    const createdAt = `<t:${Math.floor(user.createdTimestamp / 1000)}:f>`;
    const joinedAt = member ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:f>` : "Couldn't find out";
    
    const embed = new EmbedBuilder()
      .setTitle(`${user.username}`)
      .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 1024 }))
      .addFields(
  { name: "ID", value: user.id, inline: true },
  { name: "Avatar", value: `[Link](${user.displayAvatarURL({ dynamic: true, size: 1024 })})`, inline: true },
  { name: "Account Created", value: createdAt, inline: true },
  { name: "Account Age", value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`, inline: true },
  { name: "Joined Server At", value: joinedAt, inline: true },
  { name: "Join Server Age", value: member ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>` : "Couldn't find out", inline: true },
  { name: "Status", value: customStatus, inline: false } // ✅ Closing bracket fixed
);
      .setColor("Blue");

    message.reply({ embeds: [embed] });
  },
};
