const { WebhookClient } = require('discord.js');

let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_INTERVAL = 5000; // 5 seconds

function setupConnectionHandlers(client) {
    client.on('disconnect', () => {
        console.log('Bot disconnected from Discord!');
        handleReconnect(client);
    });

    client.on('error', error => {
        console.error('Discord client error:', error);
        handleReconnect(client);
    });

    client.on('reconnecting', () => {
        console.log('Bot is attempting to reconnect...');
    });

    // Reset reconnect attempts on successful connection
    client.on('ready', () => {
        console.log(`Bot reconnected as ${client.user.tag}!`);
        reconnectAttempts = 0;
    });
}

async function handleReconnect(client) {
    if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
        console.error('Maximum reconnection attempts reached. Please check your connection.');
        process.exit(1); // This will trigger Render to restart the service
        return;
    }

    reconnectAttempts++;
    console.log(`Attempting to reconnect... (Attempt ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})`);

    setTimeout(() => {
        try {
            if (!client.isReady()) {
                client.login(process.env.TOKEN);
            }
        } catch (error) {
            console.error('Error during reconnection:', error);
        }
    }, RECONNECT_INTERVAL);
}

module.exports = { setupConnectionHandlers };