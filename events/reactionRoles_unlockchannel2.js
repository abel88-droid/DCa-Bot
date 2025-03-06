module.exports = {
    name: "reactionRolesUnlock2",
    execute: async (message, args) => {
        const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMembers
    ]
        const channelId = "1239880291523366942"; 
        const roleMappings = {
            "1️⃣": "1346087307538599956", // YAGPDB
            "2️⃣": "1346088650999464006", // HCR2
            "3️⃣": "1346088973004574851", // Meme
            "4️⃣": "1346089335883042880"  // Rhythm
        };

        try {
            console.log(`✅ Reaction Roles Unlock 2 script executed!`);
            const channel = await client.channels.fetch(channelId);
            if (!channel) return console.log("❌ Channel not found!");

            const messageContent = `**To interact with bot choose which one.**\n\n
            1️⃣ yagpdb\n
            2️⃣ hcr2\n
            3️⃣ meme\n
            4️⃣ rhytm`;

            let messages = await channel.messages.fetch({ limit: 10 });
            let botMessage = messages.find(msg => 
                msg.author.id === client.user.id && msg.content.includes("To interact with bot choose which one.")
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
            console.error("❌ Error sending message or adding reactions:", error);
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
    }
};
