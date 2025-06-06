module.exports = (client) => {
  client.once('ready', () => {
    console.log(`✅ Logged in as ${client.user.tag}!`);

    
    client.user.setPresence({
      activities: [{
        name: 'Eating Dragons',
        type: 'CUSTOM', 
        state: 'Eating Dragons' 
      }],
      status: 'online' // Set the bot's status to online (green dot)
    })
      .then(() => console.log('✅ Custom status set to: Eating Dragons'))
      .catch(error => console.error('❌ Error setting custom status:', error));
  });
};
