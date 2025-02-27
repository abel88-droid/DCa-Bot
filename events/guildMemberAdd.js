const { Events } = require('discord.js');

module.exports = {
  name: Events.GuildMemberAdd,
  async execute(member) {
    const channelId = '1239879910118654016'; // Change to your welcome channel ID
    const rulesChannelId = '1239880290026000385';
    const unlockChannelId = '1239880291523366942';
    const rolesChannelId = '1340644055855399005';

    const channel = member.guild.channels.cache.get(channelId);
    if (!channel) return;

    const welcomeMessage = `**Welcome <@${member.id}>!** 🎉\nCheck out the rules <#${rulesChannelId}>.\nUnlock channels <#${unlockChannelId}>.\nSee available roles <#${rolesChannelId}>.`;

    await channel.send(welcomeMessage);
  },
};
