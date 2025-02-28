const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'ban',
    description: 'Bans a user from the server',
    execute: async (client, message, args) => {
        if (!message.member.roles.cache.some(role => role.name === 'Moderator' || role.name === 'Admin')) {
            return message.reply('You do not have permission to use this command.');
        }

        const user = message.mentions.users.first();
        if (!user) return message.reply('Please mention a user to ban.');

        const reason = args.slice(1).join(' ') || 'No reason provided';
        const member = message.guild.members.cache.get(user.id);

        if (!member) return message.reply('User not found in the server.');
        if (!member.bannable) return message.reply('I cannot ban this user. They might have a higher role or I lack permissions.');

        try {
            await user.send(`You have been banned from **${message.guild.name}** for: ${reason}`);
        } catch (error) {
            console.log(`Could not DM the user: ${error}`);
        }

        await member.ban({ reason });

        const embed = new EmbedBuilder()
            .setColor('Red')
            .setTitle('User Banned')
            .setDescription(`${user.tag} has been banned`)
            .addFields({ name: 'Reason', value: reason })
            .setTimestamp();

        return message.channel.send({ embeds: [embed] });
    }
};
