module.exports = {
    name: "reactionRolesGCcall",
    async execute(client) {
        const channelId = "839907517663936612"; // GC_call channel
        const messageContent = `React with thumbs up if you want ping in every changes of <#840008978162647071> . If you don't choose it, you will still get an ping on weekly basis when it's done.`;
        const roleMappings = { "👍": "1026142060937498685" }; // GC Call role

        try {
            const channel = await client.channels.fetch(channelId);
            if (!channel) return console.log("❌ PE Call channel not found!");

            let messages = await channel.messages.fetch({ limit: 10 });
            let botMessage = messages.find(msg => msg.author.id === client.user.id && msg.content.includes(messageContent));

            if (!botMessage) {
                botMessage = await channel.send(messageContent);
                for (const emoji of Object.keys(roleMappings)) {
                    await botMessage.react(emoji);
                }
                console.log("✅ GC Call reaction message sent!");
            } else {
                console.log("GC Call message exists, skipping.");
            }

            return botMessage.id; // ✅ Return message ID instead of setting `module.exports.messageId`
        } catch (error) {
            console.error("❌ Error in reactionRolesPECall:", error);
        }
    }
};
