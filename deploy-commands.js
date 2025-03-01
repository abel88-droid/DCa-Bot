const { REST, Routes } = require("discord.js");
require("dotenv").config();
const fs = require("fs");
const path = require("path");

const clientId = "1340222971847114762";
const token = process.env.DISCORD_TOKEN;

if (!token) {
    console.error("❌ DISCORD_TOKEN is not set in environment variables!");
    process.exit(1);
}

const commands = [];
const slashCommandsPath = path.join(__dirname, "commands/slash");
const slashCommandFiles = fs.readdirSync(slashCommandsPath).filter(file => file.endsWith(".js"));

for (const file of slashCommandFiles) {
    const command = require(`./commands/slash/${file}`);
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: "10" }).setToken(token);

(async () => {
    try {
        console.log("📡 Registering slash commands...");
        await rest.put(Routes.applicationCommands(clientId), { body: commands });
        console.log("✅ Slash commands registered successfully!");
    } catch (error) {
        console.error("❌ Error registering slash commands:", error);
    }
})();
