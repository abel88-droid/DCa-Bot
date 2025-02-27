const { Events } = require('discord.js');

module.exports = {
  name: Events.GuildMemberRemove,
  async execute(member) {
    const channelId = '1341566528989958266'; // Change to your leave channel ID

    const channel = member.guild.channels.cache.get(channelId);
    if (!channel) return;

    const leaveMessage = `**${member.user.tag}** has left the server.`;

    await channel.send(leaveMessage);
  },
};
