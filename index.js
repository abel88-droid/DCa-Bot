const { Client, GatewayIntentBits } = require("discord.js");
require("dotenv").config();
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers
    ]
});

// Event Handlers
client.on("guildMemberAdd", require("./events/guildMemberAdd"));
client.on("guildMemberRemove", require("./events/guildMemberRemove"));

// Command Handler
client.on("messageCreate", async message => {
    if (!message.content.startsWith("-") || message.author.bot) return;

    const args = message.content.slice(1).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    try {
        const commandFile = require(`./commands/${command}.js`);
        await commandFile.execute(message, args);
    } catch (err) {
        console.log(`❌ Unknown command: ${command}`);
    }
});

client.once("ready", () => {
    console.log(`✅ Logged in as ${client.user.tag}`);
});

client.login(process.env.TOKEN);
