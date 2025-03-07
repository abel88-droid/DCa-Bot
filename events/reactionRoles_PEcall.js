const { Client, GatewayIntentBits } = require("discord.js");

module.exports = {
    name: "reactionRoles_PEcall",
    execute: async (message, args) => {
        const client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildMessageReactions,
                GatewayIntentBits.GuildMembers
            ]
        });

        const channelId = "1345936577410502716"; 
        const roleMappings = {
            "👍": "1346079729375252512", // PE call
        };

        client.once("ready", async () => {
            console.log(`✅ Logged in as ${client.user.tag}`);
            try {
                const channel = await client.channels.fetch(channelId);
                if (!channel) return console.log("❌ Channel not found!");

                const messageContent = `React with thumbs up if you want ping every time there is an organized event.`;

                let messages = await channel.messages.fetch({ limit: 10 });
                let botMessage = messages.find(msg => 
                    msg.author.id === client.user.id && msg.content.includes("React with thumbs up if you want ping every time there is an organized event.")
                );

                if (!botMessage) {
                    botMessage = await channel.send(messageContent);
                    await botMessage.react("👍");
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
