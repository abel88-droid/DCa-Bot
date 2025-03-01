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

    // Function to format age correctly
    function formatDuration(duration) {
      let years = duration.years();
      let weeks = duration.weeks();
      let days = duration.days() % 7; // Remaining days after weeks
      let hours = duration.hours();

      let ageString = "";
      if (years > 0) ageString += `${years} year${years > 1 ? "s" : ""} `;
      if (weeks > 0) ageString += `${weeks} week${weeks > 1 ? "s" : ""} `;
      if (days > 0) ageString += `${days} day${days > 1 ? "s" : ""} `;
      if (hours > 0) ageString += `${hours} hour${hours > 1 ? "s" : ""} `;
      
      return ageString.trim();
    }

    // Calculate Account Age
    const now = moment();
    const createdMoment = moment(user.createdAt);
    const duration = moment.duration(now.diff(createdMoment));
    const accountAge = formatDuration(duration);

    // Calculate Server Join Age
    let joinServerAge = "Couldn't find out";
    if (member) {
      const joinedMoment = moment(member.joinedAt);
      const joinDuration = moment.duration(now.diff(joinedMoment));
      joinServerAge = formatDuration(joinDuration);
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
        { name: "Account Age", value: accountAge || "Couldn't calculate", inline: true },
        { name: "Joined Server At", value: joinedAt, inline: true },
        { name: "Join Server Age", value: joinServerAge || "Couldn't calculate", inline: true },
        { name: "Status", value: customStatus, inline: false }
      )
      .setColor("Blue");

    message.reply({ embeds: [embed] });
  },
};
