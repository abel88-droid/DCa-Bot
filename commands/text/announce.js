module.exports = {
    name: "announce",
    description: "Send an update announcement",
    execute: async (message, args) => {
        // developer role
        const developerRoleId = "1367467038737436712";
        
        if (!message.member.roles.cache.has(developerRoleId)) {
            return message.reply("Only developers can use this command.❌ ");
        }

        const announcementChannelId = "1364879132378529792";
        const announcementChannel = message.client.channels.cache.get(announcementChannelId);

        if (!announcementChannel) {
            return message.reply("❌ Announcement channel not found.");
        }

        try {
            await announcementChannel.send({
                embeds: [{
                    color: 0xFF6600,
                    title: "🎉 1 Year Anniversary + Bot Update",
                    description: "It's been 1 year!🐉\n\n**Bug Fixed**\nBot is back online with improvements.\n\n**Optimized**\nPerformance enhanced.",
                    footer: { text: "Thank you for your patience and support!" },
                    timestamp: new Date()
                }]
            });
            message.reply("✅ Announcement sent!");
        } catch (err) {
            console.error("❌ Failed to send announcement:", err);
            message.reply("❌ Failed to send announcement.");
        }
    }
};
