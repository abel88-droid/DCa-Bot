const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMembers
    ]
});

const messageId = "1345780755523043388";
const channelId = "1239880291523366942";
const roleMappings = {
    "🇦": "1345784949256491109",
    "🇧": "1345785058979483730", 
};

client.on("ready", async () => {
    console.log(`✅ Logged in as ${client.user.tag}`);
    const channel = await client.channels.fetch(channelId);
    if (!channel) return console.log("❌ Channel not found!");

    try {
        const message = await channel.messages.fetch(messageId);
        for (const emoji of Object.keys(roleMappings)) {
            await message.react(emoji);
        }
        console.log("✅ Reactions added to the message!");
    } catch (error) {
        console.error("❌ Error fetching message or adding reactions:", error);
    }
});

client.on("messageReactionAdd", async (reaction, user) => {
    if (reaction.message.id !== messageId || user.bot) return;
    const roleId = roleMappings[reaction.emoji.name];
    if (!roleId) return;

    const guild = reaction.message.guild;
    const member = await guild.members.fetch(user.id);
    if (!member) return;

    await member.roles.add(roleId);
});

client.on("messageReactionRemove", async (reaction, user) => {
    if (reaction.message.id !== messageId || user.bot) return;
    const roleId = roleMappings[reaction.emoji.name];
    if (!roleId) return;

    const guild = reaction.message.guild;
    const member = await guild.members.fetch(user.id);
    if (!member) return;

    await member.roles.remove(roleId);
});

client.login(process.env.TOKEN);
