const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "help",
  description: "Shows all prefix commands",

  execute(message) {
    const commands = message.client.commands;

    if (!commands || commands.size === 0) {
      return message.channel.send("No commands found.");
    }

    const commandList = commands
      .map(cmd => `• \`-${cmd.name}\` → ${cmd.description}`)
      .join("\n");

    const embed = new EmbedBuilder()
      .setTitle("📜 Help Menu")
      .setDescription(commandList)
      .setColor("#00b0f4")
      .setFooter({ text: `Total Commands: ${commands.size}` });

    message.channel.send({ embeds: [embed] });
  }
};
