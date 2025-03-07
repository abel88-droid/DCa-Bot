const { exec } = require("child_process");

exec("node deploy-commands.js", (error, stdout, stderr) => {
    if (error) {
        console.error(`Error registering commands: ${error.message}`);
        return;
    }
    if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
    }
    console.log(`Slash commands registered: ${stdout}`);
});

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
client.slashCommands = new Collection();

// Load traditional (-) commands from "commands/text/"
const textCommandsPath = path.join(__dirname, "commands", "text");
if (fs.existsSync(textCommandsPath)) {
    const commandFiles = fs.readdirSync(textCommandsPath).filter(file => file.endsWith(".js"));
    for (const file of commandFiles) {
        try {
            const command = require(`./commands/text/${file}`);
            if (command.name) {
                client.commands.set(command.name, command);
                console.log(`✅ Loaded text command: ${command.name}`);
            } else {
                console.warn(`⚠️ Command file ${file} is missing a name property.`);
            }
        } catch (error) {
            console.error(`❌ Error loading text command file ${file}:`, error);
        }
    }
} else {
    console.warn("⚠️ 'commands/text' folder not found. No text commands loaded.");
}

// Load slash (/) commands from "commands/slash/"
const slashCommandsPath = path.join(__dirname, "commands", "slash");
if (fs.existsSync(slashCommandsPath)) {
    const slashCommandFiles = fs.readdirSync(slashCommandsPath).filter(file => file.endsWith(".js"));
    for (const file of slashCommandFiles) {
        try {
            const command = require(`./commands/slash/${file}`);
            if (command.data && command.data.name) {
                client.slashCommands.set(command.data.name, command);
                console.log(`✅ Loaded slash command: ${command.data.name}`);
            } else {
                console.warn(`⚠️ Slash command file ${file} is missing a name property.`);
            }
        } catch (error) {
            console.error(`❌ Error loading slash command file ${file}:`, error);
        }
    }
} else {
    console.warn("⚠️ 'commands/slash' folder not found. No slash commands loaded.");
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
                console.log(`✅ Loaded event: ${event.name}`);
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

// Traditional (-) command handler
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

// Slash (/) command handler
client.on("interactionCreate", async interaction => {
    if (interaction.isCommand()) {
        const command = client.slashCommands.get(interaction.commandName);
        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(`❌ Error executing slash command ${interaction.commandName}:`, error);
            interaction.reply({ content: "❌ There was an error executing this command.", ephemeral: true });
        }
    } else if (interaction.isButton()) {
        // Handle button interactions from "commands/events/buttonHandler.js"
        const buttonHandler = require("./commands/events/buttonHandler.js");
        await buttonHandler.execute(interaction);
    }
});

// Bot ready event
client.once("ready", async () => {
    console.log(`✅ Logged in as ${client.user.tag}!`);

    // Run reaction role unlock scripts AFTER client is ready
    try {
        const reactionRolesUnlock1 = require("./events/reactionRoles_unlockchannel1.js");
        await reactionRolesUnlock1.execute(client);

        const reactionRolesUnlock2 = require("./events/reactionRoles_unlockchannel2.js");
        await reactionRolesUnlock2.execute(client);

        const reactionRolesUnlock3 = require("./events/reactionRoles_unlockchannel3.js");
        await reactionRolesUnlock3.execute(client);

        const reactionRoles_PEcall = require("./events/reactionRoles_PEcall.js");
        if (typeof reactionRoles_PEcall.execute === "function") {
            await reactionRoles_PEcall.execute(client);
            console.log("✅ reactionRoles_PEcall executed successfully.");
        } else {
            console.error("❌ reactionRoles_PEcall.execute is not a function!");
        }
        
    } catch (error) {
        console.error("❌ Error running reaction role scripts:", error);
    }
});

// Login the bot
client.login(process.env.TOKEN);
