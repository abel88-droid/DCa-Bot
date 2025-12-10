const { ActivityType } = require('discord.js');

module.exports = {
    name: 'ready',
    once: true,

    execute(client) {
        console.log(`✅ Logged in as ${client.user.tag}!`);

        try {
            client.user.setPresence({
                activities: [
                    {
                        name: 'Running smoother than Ishan’s Wi-Fi',
                        type: ActivityType.Custom,
                        state: 'Running smoother than Ishan’s Wi-Fi',
                    },
                ],
                status: 'online',
            });

            console.log('✅ Custom status set to: Eating Dragons');
        } catch (error) {
            console.error('❌ Error setting custom status:', error);
        }
    },
};
