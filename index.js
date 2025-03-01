const { Client, GatewayIntentBits, Collection } = require("discord.js");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
require("./youtube/youtubeNotifier.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildBans, // Required for unban command
        GatewayIntentBits.MessageContent
    ]
});

client.commands = new Collection();

// Load commands dynamically
const commandsPath = path.join(__dirname, "commands");
if (fs.existsSync(commandsPath)) {
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));
    for (const file of commandFiles) {
        try {
            const command = require(`./commands/${file}`);
            if (command.name) {
                client.commands.set(command.name, command);
            } else {
                console.warn(`⚠️ Command file ${file} is missing a name property.`);
            }
        } catch (error) {
            console.error(`❌ Error loading command file ${file}:`, error);
        }
    }
} else {
    console.warn("⚠️ 'commands' folder not found. No commands loaded.");
}

// Load event handlers (welcome and leave messages)
const eventsPath = path.join(__dirname, "events");
if (fs.existsSync(eventsPath)) {
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith(".js"));
    for (const file of eventFiles) {
        try {
            const event = require(`./events/${file}`);
            if (event.name) {
                if (event.once) {
                    client.once(event.name, (...args) => event.execute(...args, client));
                } else {
                    client.on(event.name, (...args) => event.execute(...args, client));
                }
            } else {
                console.warn(`⚠️ Event file ${file} is missing a name property.`);
            }
        } catch (error) {
            console.error(`❌ Error loading event file ${file}:`, error);
        }
    }
} else {
    console.warn("⚠️ 'events' folder not found. No event handlers loaded.");
}

// Command handler
client.on("messageCreate", async message => {
    if (!message.content.startsWith("-") || message.author.bot) return;

    const args = message.content.slice(1).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName);

    if (!command) return;

    try {
        await command.execute(message, args);
    } catch (error) {
        console.error(`❌ Error executing command ${commandName}:`, error);
        message.reply("❌ There was an error executing this command.");
    }
});

client.once("ready", () => {
    console.log(`✅ Logged in as ${client.user.tag}!`);
});

client.login(process.env.TOKEN);
