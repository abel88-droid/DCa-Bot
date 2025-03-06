const { Client, GatewayIntentBits } = require("discord.js");

module.exports = {
    name: "reactionRolesUnlock1",
    execute: async (message, args) => {
        const client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildMessageReactions,
                GatewayIntentBits.GuildMembers
            ]
        }); 

        const channelId = "1239880291523366942"; 
        const roleMappings = {
            "🇦": "1345784949256491109", // singame
            "🇧": "1345785058979483730", // offbase
        };

        client.once("ready", async () => {
            console.log(`✅ Logged in as ${client.user.tag}`);
            try {
                const channel = await client.channels.fetch(channelId);
                if (!channel) return console.log("❌ Channel not found!");

                const messageContent = `**Select or deselect which category you wanted to be a part of your server.**\n\n For socialise ingame.\n 🇧 For socialise for everything else.**'
        

                let messages = await channel.messages.fetch({ limit: 10 });
                let botMessage = messages.find(msg => 
                    msg.author.id === client.user.id && msg.content.includes("Select or deselect which category you wanted to be a part of your server.")
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
        });

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

        client.login(process.env.DISCORD_TOKEN); // ✅ Ensuring bot logs in
    }
};
