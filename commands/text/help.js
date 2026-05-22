const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "help",
  description: "Shows all prefix commands",

  async execute(message) {
    const commands = message.client.commands;

    if (!commands || commands.size === 0) {
      const msg = await message.channel.send("No commands found.");
      return setTimeout(() => msg.delete().catch(() => {}), 10000);
    }

    // Grouping 
    const sections = {
      "Moderation": [],
      "Utility": [],
      "Fun / Misc": []
    };

    commands.forEach(cmd => {
      const text = `\`-${cmd.name}\` • ${cmd.description}`;

      if (["ban", "kick", "mute", "warn", "warnings", "unban", "clearwarns", "mkick", "snapban"].includes(cmd.name)) {
        sections["Moderation"].push(text);
      } else if (["help", "whois", "temperature", "team","pull"].includes(cmd.name)) {
        sections["Utility"].push(text);
      } else {
        sections["Fun / Misc"].push(text);
      }
    });

    let description = "";

    for (const [title, cmds] of Object.entries(sections)) {
      if (cmds.length > 0) {
        description += `**${title}**\n${cmds.join("\n")}\n\n`;
      }
    }

    const embed = new EmbedBuilder()
      .setTitle("📜 Help Menu")
      .setDescription(description)
      .setColor("#00b0f4")
      .setFooter({ text: `Total Commands: ${commands.size}` });

    const sentMsg = await message.channel.send({ embeds: [embed] });

    // ephemeral
    setTimeout(() => {
      sentMsg.delete().catch(() => {});
    }, 15000); // disappears after 15 sec
  }
};
