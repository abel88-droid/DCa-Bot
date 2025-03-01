const { PermissionsBitField } = require("discord.js");
const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Required for Railway hosting
});

module.exports = {
  name: "warn",
  description: "Warns a user and records it in the database.",
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      return message.reply("You do not have permission to use this command.");
    }

    const user = message.mentions.users.first();
    if (!user) {
      return message.reply("Please mention a user to warn.");
    }

    const reason = args.slice(1).join(" ") || "No reason provided.";

    try {
      await pool.query(
        "INSERT INTO warnings (user_id, guild_id, reason) VALUES ($1, $2, $3)",
        [user.id, message.guild.id, reason]
      );

      message.reply(`**${user.tag}** has been warned for: **${reason}**`);
    } catch (error) {
      console.error(error);
      message.reply("An error occurred while adding the warning.");
    }
  },
};
