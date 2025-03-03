const { Events } = require("discord.js");

module.exports = {
    name: Events.MessageReactionAdd, 
    async execute(reaction, user) {
        if (reaction.message.id !== "1346086839299080218" || user.bot) return;

        const roles = {
            "1️⃣": "1346087307538599956",
            "2️⃣": "1346088650999464006",
            "3️⃣": "1346088973004574851",
            "4️⃣": "1346089335883042880",
        };

        const roleId = roles[reaction.emoji.name];
        if (!roleId) return;

        const member = await reaction.message.guild.members.fetch(user.id);
        await member.roles.add(roleId);
    },
};

module.exports = {
    name: Events.MessageReactionRemove, 
    async execute(reaction, user) {
        if (reaction.message.id !== "1346086839299080218" || user.bot) return;

        const roles = {
            "1️⃣": "1346087307538599956",
            "2️⃣": "1346088650999464006",
            "3️⃣": "1346088973004574851",
            "4️⃣": "1346089335883042880",
        };

        const roleId = roles[reaction.emoji.name];
        if (!roleId) return;

        const member = await reaction.message.guild.members.fetch(user.id);
        await member.roles.remove(roleId);
    },
};
