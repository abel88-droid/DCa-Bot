module.exports = {
    name: "reactionRoles_GCcall",
    async execute() {
        const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMembers
    ]
});

const channelId = "1345936577410502716"; // #unlock-roles channel ID
const roleMappings = {
    "☑️": "1346083963168362601", // GC call
};

client.on("ready", async () => {
    console.log(`✅ Logged in as ${client.user.tag}`);
    const channel = await client.channels.fetch(channelId);
    if (!channel) return console.log("❌ Channel not found!");

    const messageContent = `React with thumbsup if you want ping everytime there is a organized event.`;

    try {
        // Fetch recent messages to prevent duplicates
        let messages = await channel.messages.fetch({ limit: 10 });
        let botMessage = messages.find(msg => msg.author.id === client.user.id && msg.content.includes("Select or deselect which category you wanted to be a part of your server."));

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

// Role management
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

client.login(process.env.DISCORD_TOKEN);
    }
};
