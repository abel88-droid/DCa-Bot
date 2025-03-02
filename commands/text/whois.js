const { EmbedBuilder, ActivityType } = require("discord.js");

module.exports = {
  name: "whois",
  description: "Displays information about a user.",
  async execute(message, args) {
    try {
      let user = message.mentions.users.first() || message.author;
      let member = await message.guild.members.fetch(user.id).catch(() => null);

      const createdAt = `<t:${Math.floor(user.createdTimestamp / 1000)}:f>`;
      const joinedAt = member ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:f>` : "Couldn't find out";
      
      let customStatus = "No custom status";
      if (member?.presence?.activities?.length) {
        const customActivity = member.presence.activities.find(act => act.type === ActivityType.Custom);
        if (customActivity?.state) {
          customStatus = `Custom Status: "${customActivity.state}"`;
        }
      }

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
          { name: "Status", value: customStatus, inline: false }
        )
        .setColor("Blue");

      message.reply({ embeds: [embed] });
    } catch (error) {
      console.error("Error in whois command:", error);
      message.reply("❌ Something went wrong while fetching user information.");
    }
  },
};
