module.exports = {
    name: "reactionRolesTournament",
    async execute(client) {
        const channelId = "840310137390104627"; // tourn
        const messageContent = `**If you want to participate in tournament or socialise in a competitive way in adventure, choose the one you like.**

Tournament choose 🏁  
Adventure choose 🏞️`;
        const roleMappings = {
            "🏁": "963429908619616286", // Tournament role ID
            "🏞️": "1103695688363159572"  // Adventure role ID
        };

        try {
            const channel = await client.channels.fetch(channelId);
            if (!channel) return console.log("❌ Tournament channel not found!");

            let messages;
            try {
                messages = await channel.messages.fetch({ limit: 10 });
            } catch (fetchError) {
                console.error("❌ Error fetching messages:", fetchError);
                return;
            }

            let botMessage = messages.find(msg => msg.author.id === client.user.id && msg.content.includes(messageContent));

            if (!botMessage) {
                botMessage = await channel.send(messageContent);
                for (const emoji of Object.keys(roleMappings)) {
                    await botMessage.react(emoji);
                }
                console.log("✅ Tournament reaction role message sent!");
            } else {
                console.log("⚠️ Tournament message exists, skipping.");
            }

            return botMessage.id; // ✅ Always return the message ID
        } catch (error) {
            console.error("❌ Error in reactionRolesTournament:", error);
        }
    }
};
