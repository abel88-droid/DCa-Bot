const { ActivityType } = require('discord.js');

module.exports = {
  name: 'ready',
  once: true, // run only once, when the bot logs in
  execute(client) {
    console.log(`✅ Logged in as ${client.user.tag}!`);

    client.user.setPresence({
      activities: [
        {
          name: 'Eating Dragons',
          type: ActivityType.Custom, // custom status
          state: 'Eating Dragons',
        },
      ],
      status: 'online',
    })
      .then(() => console.log('✅ Custom status set to: Eating Dragons'))
      .catch(error => console.error('❌ Error setting custom status:', error));
  },
};

