const { Events } = require('discord.js');

module.exports = {
    name: Events.GuildMemberRemove,
    async execute(member) {
        const channelId = '839905184154517597'; // Change to your leave channel ID

        try {
            const channel = await member.guild.channels.fetch(channelId); // Fetch instead of cache lookup
            if (!channel) return;

            const leaveMessage = `**${member.user.tag}** has left the server.`;

            await channel.send(leaveMessage);
        } catch (error) {
            console.error("Error sending leave message:", error);
        }
    },
};
