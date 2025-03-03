module.exports = {
    name: "reactionRoles_unlockchannel2", 
    async execute(client) {
        const channelId = "1239880291523366942"; // Channel ID
        const messageId = "1346086839299080218"; // Message ID
        const roles = {
            "1️⃣": "1346087307538599956",
            "2️⃣": "1346088650999464006",
            "3️⃣": "1346088973004574851",
            "4️⃣": "1346089335883042880",
        };

        client.on("messageReactionAdd", async (reaction, user) => {
            if (reaction.message.id !== messageId || user.bot) return;

            const roleId = roles[reaction.emoji.name];
            if (!roleId) return;

            const guild = reaction.message.guild;
            const member = await guild.members.fetch(user.id);
            await member.roles.add(roleId);
        });

        client.on("messageReactionRemove", async (reaction, user) => {
            if (reaction.message.id !== messageId || user.bot) return;

            const roleId = roles[reaction.emoji.name];
            if (!roleId) return;

            const guild = reaction.message.guild;
            const member = await guild.members.fetch(user.id);
            await member.roles.remove(roleId);
        });

        console.log("Reaction role event (unlockchannel2) is loaded.");
    },
};
