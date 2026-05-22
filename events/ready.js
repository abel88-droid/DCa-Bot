const { ActivityType } = require("discord.js");

module.exports = {
    name: 'ready',
    once: true,

    execute(client) {
        console.log(`✅ Logged in as ${client.user.tag}!`);

        try {
            client.user.setPresence({
                activities: [
                    {
                        name: "Use -help",
                        type: ActivityType.Playing
                    }
                ],
                status: "online"
            });
        } catch (error) {
            console.error('❌ Error in ready event:', error);
        }
    },
};
