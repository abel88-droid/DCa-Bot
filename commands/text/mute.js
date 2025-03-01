const { PermissionsBitField, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "mute",
  description: "Mutes a user for a specified duration (using Discord's timeout feature).",
  async execute(message, args) {
  
    if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
      return message.reply("You do not have permission to use this command.");
    }

    
    const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!user) return message.reply("Please mention a valid user or provide their ID.");

    
    if (!user.moderatable) return message.reply("I cannot mute this user. They may have a higher role than me.");

  
    const timeArg = args[1] || "10m"; 
    const duration = parseDuration(timeArg);
    if (!duration) return message.reply("Invalid duration format. Use `1m`, `10m`, `1h`, etc.");

  
    try {
      await user.timeout(duration, `Muted by ${message.author.tag}`);
      
    
      const embed = new EmbedBuilder()
        .setTitle("User Muted")
        .setColor("Red")
        .setThumbnail(user.user.displayAvatarURL({ dynamic: true, size: 1024 }))
        .addFields(
          { name: "User", value: `${user.user.tag} (${user.id})`, inline: true },
          { name: "Duration", value: timeArg, inline: true },
          { name: "Moderator", value: `${message.author.tag}`, inline: true }
        )
        .setTimestamp();
      
      message.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      message.reply("An error occurred while trying to mute this user.");
    }
  },
};

function parseDuration(time) {
  const match = time.match(/^(\d+)([smhd])$/);
  if (!match) return null;

  const value = parseInt(match[1]);
  const unit = match[2];

  const multipliers = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
  return value * multipliers[unit];
}
