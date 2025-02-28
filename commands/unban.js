const { PermissionsBitField } = require("discord.js");

module.exports = {
    name: "unban",
    description: "Unbans a user",
    async execute(message, args) {
        if (!message.member.roles.cache.some(role => role.name === "Moderator" || role.name === "Admin")) {
            return message.reply("❌ You do not have permission to use this command.");
        }

        if (!args[0]) {
            return message.reply("❌ Please provide a user ID to unban.");
        }

        const userId = args[0];

        try {
            const bans = await message.guild.bans.fetch();
            const bannedUser = bans.get(userId);

            if (!bannedUser) {
                return message.reply("❌ This user is not banned.");
            }

            await message.guild.bans.remove(userId);
            message.reply(`✅ **${bannedUser.user.tag}** has been unbanned.`);
        } catch (error) {
            console.error(error);
            message.reply("❌ There was an error trying to unban this user.");
        }
    },
};
