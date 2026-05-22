module.exports = {
    name: "reactionRolesUnlock3",
    async execute(client) {
        const channelId = "840310137390104627"; // Unlock channel 3
        const messageContent = `If you want to speak in other language choose ☑️ to select that.`;
        const roleMappings = { "☑️": "842089922768797726" }; // Unlock role

        try {
            const channel = await client.channels.fetch(channelId);
            if (!channel) return console.log("❌ Unlock channel not found!");

            let messages = await channel.messages.fetch({ limit: 10 });
            let botMessage = messages.find(msg => msg.author.id === client.user.id && msg.content.includes(messageContent));

            if (!botMessage) {
                botMessage = await channel.send(messageContent);
                for (const emoji of Object.keys(roleMappings)) {
                    await botMessage.react(emoji);
                }
                console.log("✅ Unlock channel reaction message sent!");
            } else {
                console.log("⚠️ Unlock channel message exists, skipping.");
            }

            return botMessage.id; // ✅ Return message ID instead of setting `module.exports.messageId`
        } catch (error) {
            console.error("❌ Error in reactionRolesUnlock3:", error);
        }
    }
};
