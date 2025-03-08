module.exports = {
    name: "reactionRoles_PEcall",
    execute: async (client) => {
        const channelId = "1345936577410502716"; // #ping-settings
        const roleMappings = {
            "👍": "1346079729375252512", // PE_call
        };

        console.log("🔹 Running reaction role script for Unlock Channel 3...");

        try {
            const channel = await client.channels.fetch(channelId);
            if (!channel) return console.log("❌ Channel not found!");

            const messageContent = `React with 👍 if you want to get notified about events.`;

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

        } catch (error) {
            console.error("❌ Error in reactionRolesUnlock3:", error);
        }
    }
};

// Register reaction role listeners globally in index.js
module.exports.registerListeners = (client) => {
    const roleMappings = {
        "☑️": "1346079729375252512", // PE_call
    };

    client.on("messageReactionAdd", async (reaction, user) => {
        if (user.bot) return;
        const roleId = roleMappings[reaction.emoji.name];
        if (!roleId) return;

        const guild = reaction.message.guild;
        const member = await guild.members.fetch(user.id);
        if (!member) return;

        await member.roles.add(roleId);
        console.log(`✅ Added role ${roleId} to ${user.tag}`);
    });

    client.on("messageReactionRemove", async (reaction, user) => {
        if (user.bot) return;
        const roleId = roleMappings[reaction.emoji.name];
        if (!roleId) return;

        const guild = reaction.message.guild;
        const member = await guild.members.fetch(user.id);
        if (!member) return;

        await member.roles.remove(roleId);
        console.log(`❌ Removed role ${roleId} from ${user.tag}`);
    });

    console.log("🔹 Reaction role listeners registered.");
};
