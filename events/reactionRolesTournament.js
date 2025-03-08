module.exports = {
    name: "reactionRolesTournament",
    async execute(client) {
        const channelId = "1239880291523366942"; // Replace with your actual channel ID
        const messageContent = 
`If you want to participate in tournament or socialise in a competitive way in adventure, choose the one you like.

**Tournament choose** 🏁  
**Adventure choose** 🏞️`;

        const roleMappings = {
            "🏁": "1347890213296410644", // Replace with Tournament role ID
            "🏞️": "1347890535343456276"  // Replace with Adventure role ID
        };

        try {
            const channel = await client.channels.fetch(channelId);
            if (!channel) return console.log("❌ Tournament channel not found!");

            let messages = await channel.messages.fetch({ limit: 10 });
            let botMessage = messages.find(msg => msg.author.id === client.user.id && msg.content.includes("choose the one you like"));

            if (!botMessage) {
                botMessage = await channel.send(messageContent);
                for (const emoji of Object.keys(roleMappings)) {
                    await botMessage.react(emoji);
                }
                console.log("✅ Tournament reaction role message sent!");
            } else {
                console.log("⚠️ Tournament message exists, skipping.");
            }

            module.exports.messageId = botMessage.id;
        } catch (error) {
            console.error("❌ Error in reactionRolesTournament:", error);
        }
    }
};
