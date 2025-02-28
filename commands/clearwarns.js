const { PermissionsBitField } = require("discord.js");
const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

module.exports = {
  name: "clearwarns",
  description: "Clears all warnings for a user.",
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      return message.reply("You do not have permission to use this command.");
    }

    const user = message.mentions.users.first();
    if (!user) {
      return message.reply("Please mention a user to clear their warnings.");
    }

    try {
      const result = await pool.query(
        "DELETE FROM warnings WHERE user_id = $1 AND guild_id = $2 RETURNING *",
        [user.id, message.guild.id]
      );

      if (result.rowCount === 0) {
        return message.reply(`**${user.tag}** has no warnings to clear.`);
      }

      message.reply(`Cleared all warnings for **${user.tag}**.`);
    } catch (error) {
      console.error(error);
      message.reply("An error occurred while clearing warnings.");
    }
  },
};
