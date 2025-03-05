const { Events } = require("discord.js");

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        const channelId = "1239880291523366942";
        const channel = await client.channels.fetch(channelId);
        if (!channel) return console.error("Channel not found!");

        
        const messageContent = `**Select or deselect which category you want to be a part of your server.**\n\n
        🇦 For socializing in-game.\n
        🇧 For socializing in everything else.`;

        
        const message = await channel.send(messageContent);

    
        await message.react("🇦");
        await message.react("🇧");

        console.log("✅ Reaction role message sent successfully!");
    }
};
