module.exports = {
    name: "reactionRolesRules",
    async execute(client) {
        const channelId = "1239880290026000385"; 
        const messageContent = `If you can confirm you have read the rules, then press ☑️`;
        const roleMappings = { "☑️": "1345651591583367168" }; // Read rules

        try {
            const channel = await client.channels.fetch(channelId);
            if (!channel) return console.log("❌ Rules channel not found!");

            let messages = await channel.messages.fetch({ limit: 10 });
            let botMessage = messages.find(msg => msg.author.id === client.user.id && msg.content.includes(messageContent));

            if (!botMessage) {
                botMessage = await channel.send(messageContent);
                for (const emoji of Object.keys(roleMappings)) {
                    await botMessage.react(emoji);
                }
                console.log("✅ Rules channel reaction message sent!");
            } else {
                console.log("⚠️ Rules channel message exists, skipping.");
            }

            return botMessage.id; 
        } catch (error) {
            console.error("❌ Error in reactionRolesUnlock3:", error);
        }
    }
};
