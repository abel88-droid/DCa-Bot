const { PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'unban',
    description: 'Unbans a user from the server',
    execute: async (message, args) => {
        // Check if the user has the required role
        const requiredRoles = ['Moderator', 'Admin'];
        const memberRoles = message.member.roles.cache.map(role => role.name);

        if (!requiredRoles.some(role => memberRoles.includes(role))) {
            return message.reply('❌ You do not have permission to use this command.');
        }

        // Check if an ID was provided
        if (!args[0]) {
            return message.reply('❌ Please provide a user ID to unban.');
        }

        const userId = args[0];

        try {
            // Fetch the ban list and check if the user is banned
            const banList = await message.guild.bans.fetch();
            const bannedUser = banList.get(userId);

            if (!bannedUser) {
                return message.reply('❌ That user is not banned.');
            }

            // Unban the user
            await message.guild.members.unban(userId);
            message.channel.send(`✅ **${bannedUser.user.tag}** has been unbanned.`);
        } catch (error) {
            console.error(error);
            message.reply('❌ An error occurred while trying to unban the user.');
        }
    }
};
