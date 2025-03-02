const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Required for Railway hosting
});

module.exports = {
  data: new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Warn a user and log it in the database.")
    .addUserOption(option =>
      option.setName("user")
        .setDescription("User to warn")
        .setRequired(true))
    .addStringOption(option =>
      option.setName("reason")
        .setDescription("Reason for the warning")
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages), // Restrict command usage to users with "Manage Messages"

  async execute(interaction) {
    const user = interaction.options.getUser("user");
    const reason = interaction.options.getString("reason") || "No reason provided.";

    try {
      await pool.query(
        "INSERT INTO warnings (user_id, guild_id, reason) VALUES ($1, $2, $3)",
        [user.id, interaction.guild.id, reason]
      );

      return interaction.reply({ content: `✅ **${user.tag}** has been warned for: **${reason}**`, ephemeral: false });
    } catch (error) {
      console.error(error);
      return interaction.reply({ content: "❌ An error occurred while adding the warning.", ephemeral: true });
    }
  },
};
