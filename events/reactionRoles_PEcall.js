module.exports = {
    name: "reactionRoles_PEcall",
    execute: async (client) => {
        console.log("✅ reactionRoles_PEcall.js is running!");

        const channelId = "1345936577410502716"; // Your channel ID
        const roleMappings = {
            "👍": "1346079729375252512", // PE call
        };

        try {
            const channel = await client.channels.fetch(channelId);
            if (!channel) return console.log("❌ Channel not found!");

            console.log("✅ Found channel:", channel.name);

            const messageContent = `React with 👍 if you want to get notified about events.`;

            let messages = await channel.messages.fetch({ limit: 10 });
            let botMessage = messages.find(msg =>
                msg.author.id === client.user.id && msg.content.includes("React with 👍")
            );

            if (!botMessage) {
                botMessage = await channel.send(messageContent);
                await botMessage.react("👍");
                console.log("✅ Reaction role message sent!");
            } else {
                console.log("⚠️ Message already exists, skipping.");
            }
        } catch (error) {
            console.error("❌ Error sending message or adding reactions:", error);
        }
    }
};
