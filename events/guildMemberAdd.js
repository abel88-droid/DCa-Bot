const { loadDashboardConfig } = require("../utils/dashboardConfig");
const { renderMemberTemplate } = require("../utils/messageTemplates");

module.exports = {
    name: "guildMemberAdd",
    async execute(member) {
        const { welcome } = loadDashboardConfig();
        if (!welcome.enabled || !welcome.channelId) return;

        try {
            const channel = await member.guild.channels.fetch(welcome.channelId);
            if (!channel?.isTextBased?.()) return;

            await channel.send({
                content: renderMemberTemplate(welcome.message, member)
            });
        } catch (error) {
            console.error("Error sending welcome message:", error);
        }
    }
};
