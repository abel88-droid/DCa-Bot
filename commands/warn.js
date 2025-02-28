const { PermissionsBitField } = require("discord.js");
const pool = require("../database.js"); // PostgreSQL connection

module.exports = {
  name: "warn",
  description: "Warns a user and stores it in the database",
  async execute(message, args) {
    // Check if the user has permission
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      return message.reply("❌ You do not have permission to use this command.");
    }

    // Get the mentioned user
    const user = message.mentions.users.first();
    if (!user) return message.reply("❌ Please mention a user to warn.");

    // Get the reason
    const reason = args.slice(1).join(" ") || "No reason provided.";

    try {
      // Store the warning in the database
      await pool.query(
        "INSERT INTO warnings (user_id, guild_id, reason) VALUES ($1, $2, $3)",
        [user.id, message.guild.id, reason]
      );

      message.reply(`✅ Successfully warned **${user.tag}** for "**${reason}**".`);
    } catch (error) {
      console.error(error);
      message.reply("❌ An error occurred while trying to warn the user.");
    }
  },
};
