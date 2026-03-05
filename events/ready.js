module.exports = {
    name: 'ready',
    once: true,

    execute(client) {
        console.log(`✅ Logged in as ${client.user.tag}!`);

        try {
            // No custom status
        } catch (error) {
            console.error('❌ Error in ready event:', error);
        }
    },
};
