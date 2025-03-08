module.exports = {
    name: "reactionRolesUnlock3",
    execute: async (client) => {
        const channelId = "1239880291523366942"; // #unlock-roles channel ID
        const roleMappings = {
            "☑️": "1346152224564314202", // lng
        };

        console.log("🔹 Running reaction role script for Unlock Channel 3...");

        try {
            const channel = await client.channels.fetch(channelId);
            if (!channel) return console.log("❌ Channel not found!");

            const messageContent = `If you want to speak in other language choose ☑️ to select that. If you want to deselect it again just remove your selection.`;

            let messages = await channel.messages.fetch({ limit: 10 });
            let botMessage = messages.find(msg => 
                msg.author.id === client.user.id && msg.content.includes(messageContent)
            );

            if (!botMessage) {
                botMessage = await channel.send(messageContent);
                for (const emoji of Object.keys(roleMappings)) {
                    await botMessage.react(emoji);
                }
                console.log("✅ Reaction role message sent!");
            } else {
                console.log("⚠️ Message already exists, skipping.");
            }

            client.on("messageReactionAdd", async (reaction, user) => {
                if (user.bot) return;
                const roleId = roleMappings[reaction.emoji.name];
                if (!roleId) return;

                const guild = reaction.message.guild;
                const member = await guild.members.fetch(user.id);
                if (!member) return;

                await member.roles.add(roleId);
            });

            client.on("messageReactionRemove", async (reaction, user) => {
                if (user.bot) return;
                const roleId = roleMappings[reaction.emoji.name];
                if (!roleId) return;

                const guild = reaction.message.guild;
                const member = await guild.members.fetch(user.id);
                if (!member) return;

                await member.roles.remove(roleId);
            });

        } catch (error) {
            console.error("❌ Error in reactionRolesUnlock3:", error);
        }
    }
};
