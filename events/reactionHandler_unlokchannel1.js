const { Events } = require("discord.js");

module.exports = {
    name: Events.MessageReactionAdd,
    async execute(reaction, user) {
        if (user.bot) return; // Fork off bot reactions

        const guild = reaction.message.guild;
        const member = await guild.members.fetch(user.id);
        const roleA = "1345784949256491109";
        const roleB = "1345785058979483730"; 
        if (reaction.emoji.name === "🇦") {
            await member.roles.add(roleA);
        } else if (reaction.emoji.name === "🇧") {
            await member.roles.add(roleB);
        }
    }
};
