module.exports = {
    name: "reactionRolesTournament",
    async execute(client) {
        const channelId = "1239880291523366942"; // tourn
        const messageContent = `**If you want to participate in tournament or socialise in a competitive way in adventure, choose the one you like.**

Tournament choose 🏁  
Adventure choose 🏞️`;
        const roleMappings = {
            "🏁": "1347890213296410644", //  Tournament role ID
            "🏞️": "1347890535343456276"  // Adventure role ID
        };

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
                console.log("✅ Unlock channel tournament reaction message sent!");
            } else {
                console.log("⚠️ Unlock channel tournament message exists, skipping.");
            }

            return botMessage.id; // ✅ Return message ID instead of setting `module.exports.messageId`
        } catch (error) {
            console.error("❌ Error in reactionRolesUnlock3:", error);
        }
    }
};
