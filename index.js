const { Client, GatewayIntentBits, Collection,Partials } = require("discord.js");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
require("./youtube/youtubeNotifier.js"); // your YT notifier

// Error handlers
process.on("unhandledRejection", reason => console.error("Unhandled Rejection:", reason));
process.on("uncaughtException", err => console.error("Uncaught Exception:", err));

// Client Setup
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.MessageContent
    ],
    partials: [
    Partials.Message,
    Partials.Channel,
    Partials.Reaction
  ]
});

// custom ready flag for health check
client.isBotReady = false;

client.commands = new Collection();
client.slashCommands = new Collection();

// Load text (-) commands
const textCommandsPath = path.join(__dirname, "commands", "text");
if (fs.existsSync(textCommandsPath)) {
    const textFiles = fs.readdirSync(textCommandsPath).filter(f => f.endsWith(".js"));
    for (const file of textFiles) {
        try {
            const command = require(`./commands/text/${file}`);
            if (command.name) {
                client.commands.set(command.name, command);
                console.log(`✅ Loaded text command: ${command.name}`);
            } else {
                console.warn(`⚠️ Missing command name in ${file}`);
            }
        } catch (err) {
            console.error(`❌ Error loading text command ${file}:`, err);
        }
    }
}

// Load slash (/) commands
const slashPath = path.join(__dirname, "commands", "slash");

function getAllSlashCommands(dir) {
    let results = [];
    for (const file of fs.readdirSync(dir)) {
        const full = path.join(dir, file);
        if (fs.statSync(full).isDirectory()) {
            results = results.concat(getAllSlashCommands(full));
        } else if (file.endsWith(".js")) {
            results.push(full);
        }
    }
    return results;
}

if (fs.existsSync(slashPath)) {
    const slashFiles = getAllSlashCommands(slashPath);
    for (const file of slashFiles) {
        try {
            const command = require(file);
            if (command.data && command.data.name) {
                client.slashCommands.set(command.data.name, command);
                console.log(`✅ Loaded slash command: ${command.data.name}`);
            } else {
                console.warn(`⚠️ Missing slash command name in ${file}`);
            }
        } catch (err) {
            console.error(`❌ Error loading slash command ${file}:`, err);
        }
    }
}

// Load event files
const eventsPath = path.join(__dirname, "events");
if (fs.existsSync(eventsPath)) {
    const eventFiles = fs.readdirSync(eventsPath).filter(f => f.endsWith(".js"));
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
                console.warn(`⚠️ Missing event name in ${file}`);
            }
        } catch (err) {
            console.error(`❌ Error loading event ${file}:`, err);
        }
    }
}

// "-" text commands
client.on("messageCreate", async message => {
    if (!message.content.startsWith("-") || message.author.bot) return;

    const args = message.content.slice(1).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName);
    if (!command) return;

    try {
        await command.execute(message, args);
    } catch (err) {
        console.error(`❌ Error executing command ${commandName}:`, err);
        message.reply("❌ Error executing this command.");
    }
});

// Slash commands & buttons
client.on("interactionCreate", async interaction => {
    if (interaction.isCommand()) {
        const cmd = client.slashCommands.get(interaction.commandName);
        if (!cmd) return;

        try {
            await cmd.execute(interaction);
        } catch (err) {
            console.error(`❌ Slash error ${interaction.commandName}:`, err);
            interaction.reply({ content: "❌ Error executing this command.", ephemeral: true });
        }
    }

    if (interaction.isButton()) {
        try {
            const buttonHandler = require("./commands/events/buttonHandler.js");
            await buttonHandler.execute(interaction);
        } catch (err) {
            console.error("❌ Button handler error:", err);
        }
    }
});

// READY EVENT
client.once("ready", async () => {
    // mark bot as ready for health check
    client.isBotReady = true;

    console.log(`\n========================`);
    console.log(`✅ Logged in as ${client.user.tag}`);
    console.log(`========================\n`);

    console.log("ℹ️ Starting reaction role scripts...");

    try {
        const reactionRolesUnlock1 = require("./events/reactionRoles_unlockchannel1.js");
        const reactionRolesUnlock3 = require("./events/reactionRoles_unlockchannel3.js");
        const reactionRolesPECall = require("./events/reactionRoles_PEcall.js");
        const reactionRolesGCcall = require("./events/reactionRoles_GCcall.js");
        const reactionRolesTournament = require("./events/reactionRolesTournament.js");
        const reactionRolesRules = require("./events/reactionRoles_Rules.js");

        client.reactionRoleMessages = {
            unlockMsgId: await reactionRolesUnlock3.execute(client),
            peCallMsgId: await reactionRolesPECall.execute(client),
            gcCallMsgId: await reactionRolesGCcall.execute(client),
            tournamentMsgId: await reactionRolesTournament.execute(client),
            rulesMsgId: await reactionRolesRules.execute(client)
        };

        await reactionRolesUnlock1.execute(client);

        console.log("✅ Reaction role scripts done.");
    } catch (err) {
        console.error("❌ Reaction role script error:", err);
    }
});

// Universal reaction-role handler
const handleReactionRole = async (reaction, user, add) => {
    if (user.bot || !client.reactionRoleMessages) return;

    let roleId = null;

    if (reaction.message.id === client.reactionRoleMessages.unlockMsgId) {
        roleId = "842089922768797726";
    } else if (reaction.message.id === client.reactionRoleMessages.peCallMsgId) {
        roleId = "840250757235212339";
    } else if (reaction.message.id === client.reactionRoleMessages.gcCallMsgId) {
        roleId = "1026142060937498685";
    } else if (reaction.message.id === client.reactionRoleMessages.tournamentMsgId) {
        if (reaction.emoji.name === "🏁") roleId = "963429908619616286";
        if (reaction.emoji.name === "🏞️") roleId = "1103695688363159572";
    } else if (reaction.message.id === client.reactionRoleMessages.rulesMsgId) {
        roleId = "1345651591583367168";
    }

    if (!roleId) return;

    try {
        const member = await reaction.message.guild.members.fetch(user.id);
        if (add) {
            await member.roles.add(roleId);
        } else {
            await member.roles.remove(roleId);
        }
    } catch (err) {
        console.error("❌ Role modify error:", err);
    }
};

client.on("messageReactionAdd", (r, u) => handleReactionRole(r, u, true));
client.on("messageReactionRemove", (r, u) => handleReactionRole(r, u, false));

// Express keep-alive server
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.json({
        status: client.isBotReady ? "alive" : "disconnected",
        uptime: Math.floor(process.uptime()),
        discordStatus: client.isBotReady ? "connected" : "disconnected",
        timestamp: new Date().toISOString()
    });
});

// Keep-alive logs every 5 min
setInterval(() => {
    console.log(`Keep-alive: Discord ${client.isBotReady ? "connected" : "DISCONNECTED"}`);
}, 5 * 60 * 1000);

app.listen(PORT, () => console.log(`🌐 Web server running on ${PORT}`));

// Single login call
client.login(process.env.DISCORD_TOKEN);
