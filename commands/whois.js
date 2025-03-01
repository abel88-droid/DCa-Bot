const { EmbedBuilder, ActivityType } = require("discord.js");
const moment = require("moment");

module.exports = {
  name: "whois",
  description: "Displays information about a user.",
  async execute(message, args) {
    let user = message.mentions.users.first() || message.author;
    let member = message.guild.members.cache.get(user.id);

    const createdAt = `<t:${Math.floor(user.createdTimestamp / 1000)}:f>`;
    const joinedAt = member ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:f>` : "Couldn't find out";

    // Calculate Account Age
    const now = moment();
    const createdMoment = moment(user.createdAt);
    const duration = moment.duration(now.diff(createdMoment));
    const accountAge = `${duration.years()} years ${duration.weeks()} weeks and ${duration.hours()} hours`;

    // Calculate Server Join Age
    let joinServerAge = "Couldn't find out";
    if (member) {
      const joinedMoment = moment(member.joinedAt);
      const joinDuration = moment.duration(now.diff(joinedMoment));
      joinServerAge = `${joinDuration.years()} years ${joinDuration.weeks()} weeks and ${joinDuration.hours()} hours`;
    }

    // Handle Custom Status
    let customStatus = "No custom status";
    if (member && member.presence && member.presence.activities.length > 0) {
      const customActivity = member.presence.activities.find(act => act.type === ActivityType.Custom);
      if (customActivity && customActivity.state) {
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
        { name: "Account Age", value: accountAge, inline: true },
        { name: "Joined Server At", value: joinedAt, inline: true },
        { name: "Join Server Age", value: joinServerAge, inline: true },
        { name: "Status", value: customStatus, inline: false }
      )
      .setColor("Blue");

    message.reply({ embeds: [embed] });
  },
};
