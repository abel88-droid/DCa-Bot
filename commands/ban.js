module.exports = {
  name: "ban",
  async execute(message, args) {
    if (!message.member.permissions.has("BAN_MEMBERS")) {
      return message.reply("You don't have permission to use this command.");
    }

    const target = message.mentions.members.first();
    const reason = args.slice(1).join(" ") || "No reason provided";

    if (!target) {
      return message.reply("Please mention a user to ban.");
    }

    if (!target.bannable) {
      return message.reply("I cannot ban this user.");
    }

    await target.ban({ reason });
    message.channel.send(`**${target.user.tag}** has been banned. Reason: **${reason}**`);
  },
};
