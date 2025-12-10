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
                        name: 'Eating Dragon',
                        type: ActivityType.Custom,
                        state: 'Eating Dragon',
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
