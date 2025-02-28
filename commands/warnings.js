const { PermissionsBitField } = require("discord.js");
const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

module.exports = {
  name: "warnings",
  description: "Displays all warnings for a user.",
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      return message.reply("You do not have permission to use this command.");
    }

    const user = message.mentions.users.first();
    if (!user) {
      return message.reply("Please mention a user to check their warnings.");
    }

    try {
      const result = await pool.query(
        "SELECT reason FROM warnings WHERE user_id = $1 AND guild_id = $2",
        [user.id, message.guild.id]
      );

      if (result.rows.length === 0) {
        return message.reply(`**${user.tag}** has no warnings.`);
      }

      const warningList = result.rows.map((row, index) => `**${index + 1}.** ${row.reason}`).join("\n");
      message.reply(`Warnings for **${user.tag}**:\n${warningList}`);
    } catch (error) {
      console.error(error);
      message.reply("An error occurred while fetching warnings.");
    }
  },
};
