const { Client, GatewayIntentBits, Collection,Partials } = require("discord.js");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const { registerDashboardRoutes } = require("./utils/dashboardRoutes");
const {
    ensureReactionRoleMessages,
    handleReactionRole: handleDashboardReactionRole
} = require("./utils/reactionRoleManager");

// Error handlers
process.on("unhandledRejection", reason => console.error("Unhandled Rejection:", reason));
process.on("uncaughtException", err => console.error("Uncaught Exception:", err));

// Initialize YouTube Notifier with timeout protection
try {
    const youtubeNotifierPromise = Promise.resolve(require("./youtube/youtubeNotifier.js"));
    Promise.race([
        youtubeNotifierPromise,
        new Promise((_, reject) => setTimeout(() => reject(new Error("YT Notifier timeout after 10s")), 10000))
      ]).catch(err => console.error("❌ YouTube Notifier error:", err.message));
 } catch (err) {
     console.error("❌ Failed to load YouTube Notifier:", err);
  }

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
// testing
client.on("warn", (info) => {
    console.warn("⚠️ Client warning:", info);
});

client.on("debug", (info) => {
    if (info.includes("error") || info.includes("connection")) {
        console.log("🔍 Debug:", info);
    }
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

            // 🔧 FIXED PART (this is the only change)
            if (command.name && command.execute) {
                command.description = command.description || "No description";
                client.commands.set(command.name, command);
                console.log(`✅ Loaded text command: ${command.name}`);
            } else {
                console.warn(`⚠️ Invalid command in ${file}`);
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

    console.log("ℹ️ Syncing dashboard-managed reaction role messages...");

    try {
        const sync = await Promise.race([
            ensureReactionRoleMessages(client),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Reaction role setup timeout after 20s")), 20000)
            )
        ]);

        const syncedCount = sync.results.filter(result => !result.skipped).length;
        console.log(`✅ Reaction role sync done (${syncedCount} messages).`);
    } catch (err) {
        console.error("❌ Reaction role script error:", err.message);
        client.reactionRoleMessageMap = new Map();
    }
});

// Handle unexpected disconnections
client.on("disconnect", () => {
    console.log("⚠️ Bot disconnected from Discord");
    client.isBotReady = false;
});

// Handle client errors
client.on("error", err => {
    console.error("❌ Discord client error:", err);
});

// Universal reaction-role handler
client.on("messageReactionAdd", (r, u) => handleDashboardReactionRole(client, r, u, true));
client.on("messageReactionRemove", (r, u) => handleDashboardReactionRole(client, r, u, false));

// Express keep-alive server
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.set("trust proxy", 1);
app.use(express.json({ limit: "256kb" }));
registerDashboardRoutes(app, client);

app.get("/", (req, res) => {
    res.json({
        status: client.isBotReady ? "alive" : "disconnected",
        uptime: Math.floor(process.uptime()),
        discordStatus: client.isBotReady ? "connected" : "disconnected",
        timestamp: new Date().toISOString()
    });
});

// Health check endpoint for Render
app.get("/health", (req, res) => {
    if (client.isReady()) {
        res.status(200).json({
            status: "healthy",
            uptime: Math.floor(process.uptime()),
            discordStatus: "connected",
            timestamp: new Date().toISOString()
        });
    } else {
        res.status(503).json({
            status: "unhealthy",
            uptime: Math.floor(process.uptime()),
            discordStatus: "disconnected",
            timestamp: new Date().toISOString()
        });
    }
});

// Keep-alive logs every 5 min
setInterval(() => {
    console.log(`Keep-alive: Discord ${client.isBotReady ? "connected" : "DISCONNECTED"}`);
}, 5 * 60 * 1000);

app.listen(PORT, () => console.log(`🌐 Web server running on ${PORT}`));

// Single login call
console.log("📡 Attempting Discord connection...");
console.log(`Token: ${process.env.DISCORD_TOKEN ? process.env.DISCORD_TOKEN.substring(0, 10) + "..." : "MISSING"}`);
client.login(process.env.DISCORD_TOKEN);

let attempts = 0;
const checkInterval = setInterval(() => {
    attempts++;
    console.log(`[${attempts}] Checking connection status...`);
    if (client.isReady()) {
        console.log("✅ Bot is READY!");
        clearInterval(checkInterval);
    }
    if (attempts >= 7) {
        clearInterval(checkInterval);
        console.error("❌ Bot failed to connect after 35 seconds");
    }
}, 5000);
