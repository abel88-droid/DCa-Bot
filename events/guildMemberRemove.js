const { Events } = require('discord.js');
const { loadDashboardConfig } = require("../utils/dashboardConfig");
const { renderMemberTemplate } = require("../utils/messageTemplates");

module.exports = {
    name: Events.GuildMemberRemove,
    async execute(member) {
        const { leave } = loadDashboardConfig();
        if (!leave.enabled || !leave.channelId) return;

        try {
            const channel = await member.guild.channels.fetch(leave.channelId);
            if (!channel?.isTextBased?.()) return;

            await channel.send(renderMemberTemplate(leave.message, member));
        } catch (error) {
            console.error("Error sending leave message:", error);
        }
    },
};
