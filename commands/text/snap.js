module.exports = {
  name: "snapban",
  description: "Thanos-style ban someone out of existence",
  async execute(message, args) {
    // Check if the message author has permission to ban members
    if (!message.member.permissions.has('BanMembers')) {
      return message.reply("🛑 You don't have the power of the Infinity Gauntlet!");
    }

    // Get the mentioned member
    const target = message.mentions.members.first();

    // Get reason (if any)
    const reason = args.slice(1).join(" ") || "No reason provided.";

    if (!target) {
      return message.reply("❗ You need to mention a user to snap! Example: `-snapban @user being sus`");
    }

    if (target.id === message.author.id) {
      return message.reply("⚠️ You can't snap yourself, even if you're feeling dramatic.");
    }

    if (!target.bannable) {
      return message.reply("🔥 I can't snap that user. They're too powerful!");
    }

    // Try to send DM
    try {
      await target.send(`💥 You have been snapped from **${message.guild.name}**.\nReason: ${reason}`);
    } catch (err) {
      console.log("Couldn't DM the target. They probably have DMs off.");
    }

    // Ban the user
    await target.ban({ reason });

    // Announce in the channel
    return message.channel.send(`☠️ *"You should’ve gone for the head..."*\n💨 **${target.user.tag} has been snapped out of existence!**`);
  }
};
