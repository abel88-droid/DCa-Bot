module.exports = {
    name: "reactionRoles_unlockchannel2",
    async execute(client) {
        const MESSAGE_ID = "1346086839299080218"; 
        const roles = {
            "1️⃣": "1346087307538599956",
            "2️⃣": "1346088650999464006",
            "3️⃣": "1346088973004574851",
            "4️⃣": "1346089335883042880",
        };

        client.on("messageReactionAdd", async (reaction, user) => {
            if (user.bot || reaction.message.id !== MESSAGE_ID) return;

            const roleId = roles[reaction.emoji.name];
            if (!roleId) return;

            const member = await reaction.message.guild.members.fetch(user.id);
            await member.roles.add(roleId);
        });

        client.on("messageReactionRemove", async (reaction, user) => {
            if (user.bot || reaction.message.id !== MESSAGE_ID) return;

            const roleId = roles[reaction.emoji.name];
            if (!roleId) return;

            const member = await reaction.message.guild.members.fetch(user.id);
            await member.roles.remove(roleId);
        });
    },
    console.log(reaction.emoji.name);
};
