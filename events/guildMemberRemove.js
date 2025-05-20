const { Events } = require('discord.js');

module.exports = {
  name: Events.GuildMemberRemove,
  async execute(member) {
    const channelId = '839905184154517597'; // Change to your leave channel ID

    const channel = member.guild.channels.cache.get(channelId);
    if (!channel) return;

    const leaveMessage = `**${member.user.tag}** has left the server.`;

    await channel.send(leaveMessage);
  },
};
