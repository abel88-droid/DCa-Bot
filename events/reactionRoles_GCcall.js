module.exports = {
    name: "reactionRoles_GCcall",
    async execute(client) {
        const channelId = "1345936577410502716"; // GC_call channel
        const messageContent = `React with 👍 if you want to get notified about events.`;
        const roleMappings = { "👍": "1346083963168362601" }; // GC Call role

        try {
            const channel = await client.channels.fetch(channelId);
            if (!channel) return console.log("❌ GC Call channel not found!");

            let messages = await channel.messages.fetch({ limit: 10 });
            let botMessage = messages.find(msg => msg.author.id === client.user.id && msg.content.includes(messageContent));

            if (!botMessage) {
                botMessage = await channel.send(messageContent);
                for (const emoji of Object.keys(roleMappings)) {
                    await botMessage.react(emoji);
                }
                console.log("✅ GC Call reaction message sent!");
            } else {
                console.log("⚠️ GC Call message exists, skipping.");
            }

            module.exports.messageId = botMessage.id; // ✅ Store Message ID
            return botMessage.id; // ✅ Ensure message ID is returned
        } catch (error) {
            console.error("❌ Error in reactionRoles_GCcall:", error);
        }
    }
};
