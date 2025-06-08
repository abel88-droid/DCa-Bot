const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  name: "snapban",
  description: "Thanos-style ban someone out of existence",
  async execute(message, args) {
    
    if (!message.member.permissions.has("BanMembers")) {
      return message.reply("🛑 You don't have the power of the Infinity Gauntlet!");
    }

    const target = message.mentions.members.first();
    const reason = args.slice(1).join(" ") || "No reason provided.";

    if (!target) {
      return message.reply("You need to mention a user to snap!");
    }
    if (!target.bannable) {
      return message.reply("I can't snap that user. Too powerful!🔥");
    }

    try {
      await target.send(`💥 You have been snapped from **${message.guild.name}**. Reason: ${reason}`);
    } catch (err) {
      console.log("Couldn't DM the target. Probably has DMs off.");
    }

    await target.ban({ reason });

    return message.channel.send(`☠️ *"You should’ve gone for the head..."*\n💨 **${target.user.tag} has been snapped out of existence!**`);
  }
};
