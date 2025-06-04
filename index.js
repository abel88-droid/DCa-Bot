const { exec } = require("child_process");

exec("node deploy-commands.js", (error, stdout, stderr) => {
    if (error) {
        console.error(`❌ Error registering commands: ${error.message}`);
        return;
    }
    if (stderr) {
        console.error(`❌ stderr: ${stderr}`);
        return;
    }
    console.log(`✅ Slash commands registered: ${stdout}`);
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
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildBans,
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

// Load slash (/) commands from "commands/slash/" and subfolders
const slashCommandsPath = path.join(__dirname, "commands", "slash");
if (fs.existsSync(slashCommandsPath)) {
    function getAllSlashCommandFiles(dir) {
        let results = [];
        const list = fs.readdirSync(dir);

        for (const file of list) {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);

            if (stat && stat.isDirectory()) {
                results = results.concat(getAllSlashCommandFiles(filePath));
            } else if (file.endsWith(".js")) {
                results.push(filePath);
            }
        }

        return results;
    }

    const slashCommandFiles = getAllSlashCommandFiles(slashCommandsPath);
    for (const filePath of slashCommandFiles) {
        try {
            const command = require(filePath);
            if (command.data && command.data.name) {
                client.slashCommands.set(command.data.name, command);
                console.log(`✅ Loaded slash command: ${command.data.name} from ${filePath}`);
            } else {
                console.warn(`⚠️ Slash command file ${filePath} is missing a name property.`);
            }
        } catch (error) {
            console.error(`❌ Error loading slash command file ${filePath}:`, error);
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
            await interaction.reply({ content: "❌ There was an error executing this command.", ephemeral: true });
        }
    } else if (interaction.isButton()) {
        try {
            const buttonHandler = require("./commands/events/buttonHandler.js");
            await buttonHandler.execute(interaction);
        } catch (error) {
            console.error("❌ Error handling button interaction:", error);
        }
    }
});

client.once("ready", async () => {
    console.log(`✅ Logged in as ${client.user.tag}!`);
    console.log("ℹ️ Running reaction role scripts...");

    try {
        const reactionRolesUnlock1 = require("./events/reactionRoles_unlockchannel1.js");
        const reactionRolesUnlock2 = require("./events/reactionRoles_unlockchannel2.js");
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
            rulesMsgId: await reactionRolesRules.execute(client), 
        };

        await reactionRolesUnlock1.execute(client);
        await reactionRolesUnlock2.execute(client);

        console.log("✅ Reaction role scripts executed.");
    } catch (error) {
        console.error("❌ Error running reaction role scripts:", error);
    }
});

const handleReactionRole = async (reaction, user, add) => {
    if (user.bot || !client.reactionRoleMessages) return;

    let roleId;
    if (reaction.message.id === client.reactionRoleMessages.unlockMsgId) {
        roleId = "842089922768797726";
    } else if (reaction.message.id === client.reactionRoleMessages.peCallMsgId) {
        roleId = "840250757235212339";
    } else if (reaction.message.id === client.reactionRoleMessages.gcCallMsgId) {
        roleId = "1026142060937498685";
    } else if (reaction.message.id === client.reactionRoleMessages.tournamentMsgId) {
        if (reaction.emoji.name === "🏁") {
            roleId = "963429908619616286";
        } else if (reaction.emoji.name === "🏞️") {
            roleId = "1103695688363159572";
        }
    } else if (reaction.message.id === client.reactionRoleMessages.rulesMsgId) { 
        roleId = "1345651591583367168"; 
    } else {
        return;
    }

    try {
        const member = await reaction.message.guild.members.fetch(user.id);
        if (add) {
            await member.roles.add(roleId);
            console.log(`✅ Added role ${roleId} to ${user.tag}`);
        } else {
            await member.roles.remove(roleId);
            console.log(`❌ Removed role ${roleId} from ${user.tag}`);
        }
    } catch (error) {
        console.error("❌ Error modifying role:", error);
    }
};

client.on("messageReactionAdd", (reaction, user) => handleReactionRole(reaction, user, true));
client.on("messageReactionRemove", (reaction, user) => handleReactionRole(reaction, user, false));

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('Bot is alive!'));
app.listen(PORT, () => console.log(`Web server running on port ${PORT}`));

client.login(process.env.TOKEN);
