const { PermissionsBitField } = require("discord.js");

module.exports = {
  name: "unban",
  description: "Unbans a user from the server",
  async execute(message, args) {
    if (!message.member.permissions.has("BAN_MEMBERS")) {
      return message.reply("You do not have permission to use this command.");
    }

    const userId = args[0]; // Expecting a user ID
    if (!userId) return message.reply("Please provide a valid user ID.");

    try {
      const bans = await message.guild.bans.fetch();
      console.log(bans); // Debugging: Log the fetched bans

      if (!bans.has(userId)) {
        return message.reply("This user is not banned.");
      }

      await message.guild.bans.remove(userId);
      message.reply(`Successfully unbanned <@${userId}>.`);
    } catch (error) {
      console.error(error);
      message.reply("An error occurred while trying to unban the user.");
    }
  },
};
