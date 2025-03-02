const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Required for Railway hosting
});

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clearwarns")
    .setDescription("Clears all warnings for a user.")
    .addUserOption(option =>
      option.setName("user")
        .setDescription("User whose warnings will be cleared")
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages), // Restrict to mods/admins

  async execute(interaction) {
    const user = interaction.options.getUser("user");

    try {
      const result = await pool.query(
        "DELETE FROM warnings WHERE user_id = $1 AND guild_id = $2 RETURNING *",
        [user.id, interaction.guild.id]
      );

      if (result.rowCount === 0) {
        return interaction.reply({ content: `❌ **${user.tag}** has no warnings to clear.`, ephemeral: true });
      }

      return interaction.reply({ content: `✅ Cleared all warnings for **${user.tag}**.`, ephemeral: false });
    } catch (error) {
      console.error(error);
      return interaction.reply({ content: "❌ An error occurred while clearing warnings.", ephemeral: true });
    }
  },
};
