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
const guildMemberAdd = require("./events/guildMemberAdd.js");
const guildMemberRemove = require("./events/guildMemberRemove.js");

client.on("guildMemberAdd", guildMemberAdd);
client.on("guildMemberRemove", guildMemberRemove);

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
