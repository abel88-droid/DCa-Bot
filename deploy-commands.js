require("dotenv").config();
const { REST, Routes } = require("discord.js");
const fs = require("fs");

const commands = [];
const slashCommandsPath = "./slashCommands";
const commandFiles = fs.readdirSync(slashCommandsPath).filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
    const command = require(`./slashCommands/${file}`);
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log("🔄 Refreshing slash commands...");
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands }
        );
        console.log("✅ Slash commands registered!");
    } catch (error) {
        console.error("❌ Error registering slash commands:", error);
    }
})();
