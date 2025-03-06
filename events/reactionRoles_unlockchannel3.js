module.exports = {
    name: "reactionRoles_unlockchannel3",
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

const channelId = "1239880291523366942"; 
const roleId = "1346152224564314202"; 
const reactionEmoji = "☑️"; 

client.on("ready", async () => {
    console.log(`✅ Logged in as ${client.user.tag}`);
    const channel = await client.channels.fetch(channelId);
    if (!channel) return console.log("❌ Channel not found!");

    // Message content
    const messageContent = `If you want to speak in other language choose ☑️ to select that. If you want to deselect it again just remove your selection.`;

    try {
        // Fetch recent messages to prevent duplicates
        let messages = await channel.messages.fetch({ limit: 10 });
        let botMessage = messages.find(msg => msg.author.id === client.user.id && msg.content.includes("If you want to speak in other language choose ☑️"));

        if (!botMessage) {
            botMessage = await channel.send(messageContent);
            await botMessage.react(reactionEmoji);
            console.log("✅ Language selection message sent with reaction!");
        } else {
            console.log("⚠️ Message already exists, ensuring reaction.");
            if (!botMessage.reactions.cache.has(reactionEmoji)) {
                await botMessage.react(reactionEmoji);
            }
        }
    } catch (error) {
        console.error("❌ Error sending message or adding reaction:", error);
    }
});

// Role management with reactions
client.on("messageReactionAdd", async (reaction, user) => {
    if (reaction.message.channel.id !== channelId || reaction.emoji.name !== reactionEmoji || user.bot) return;

    const member = await reaction.message.guild.members.fetch(user.id);
    await member.roles.add(roleId);
    console.log(`✅ Added role to ${user.tag}`);
});

client.on("messageReactionRemove", async (reaction, user) => {
    if (reaction.message.channel.id !== channelId || reaction.emoji.name !== reactionEmoji || user.bot) return;

    const member = await reaction.message.guild.members.fetch(user.id);
    await member.roles.remove(roleId);
    console.log(`❌ Removed role from ${user.tag}`);
});

client.login(process.env.DISCORD_TOKEN);
    }
};
