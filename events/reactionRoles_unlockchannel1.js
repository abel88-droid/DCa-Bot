const { Events } = require("discord.js");

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        const channelId = "1239880291523366942"; 
        const roleA = "1345784949256491109"; 
        const roleB = "1345785058979483730"; 

        const channel = await client.channels.fetch(channelId);
        if (!channel) return console.error("Channel not found!");

        // Message content
        const messageContent = `**Select or deselect which category you want to be a part of your server.**\n\n
        🇦 For socializing in-game.\n
        🇧 For socializing in everything else.`;

        // Send the message (only send if it's not already in the channel)
        let messages = await channel.messages.fetch({ limit: 10 });
        let botMessage = messages.find(msg => msg.author.id === client.user.id && msg.content.includes("Select or deselect"));

        if (!botMessage) {
            botMessage = await channel.send(messageContent);
            await botMessage.react("🇦");
            await botMessage.react("🇧");
        }

        console.log("✅ Reaction role message is set!");

        // Reaction role handling
        client.on("messageReactionAdd", async (reaction, user) => {
            if (user.bot) return;
            const member = await reaction.message.guild.members.fetch(user.id);
            if (reaction.emoji.name === "🇦") await member.roles.add(roleA);
            if (reaction.emoji.name === "🇧") await member.roles.add(roleB);
        });

        client.on("messageReactionRemove", async (reaction, user) => {
            if (user.bot) return;
            const member = await reaction.message.guild.members.fetch(user.id);
            if (reaction.emoji.name === "🇦") await member.roles.remove(roleA);
            if (reaction.emoji.name === "🇧") await member.roles.remove(roleB);
        });
    }
};
