const { PermissionsBitField } = require("discord.js");

module.exports = {
  name: "unban",
  description: "Unbans a user from the server using their ID or username",
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      return message.reply("🚫 You do not have permission to use this command.");
    }

    if (!args[0]) {
      return message.reply("❌ Please provide a user ID or username.");
    }

    try {
      const bans = await message.guild.bans.fetch(); // Fetch all bans

      // Check if the input is a user ID
      let bannedUser = bans.get(args[0]);

      // If no ID match, search by username
      if (!bannedUser) {
        bannedUser = [...bans.values()].find(ban => ban.user.username.toLowerCase() === args[0].toLowerCase());
      }

      // If user is not found in the ban list
      if (!bannedUser) {
        return message.reply("⚠️ This user is not banned or does not exist.");
      }

      // Unban the user
      await message.guild.bans.remove(bannedUser.user.id);
      message.reply(`✅ Successfully unbanned **${bannedUser.user.tag}**.`);
    } catch (error) {
      console.error(error);
      message.reply("❌ An error occurred while trying to unban the user.");
    }
  },
};
