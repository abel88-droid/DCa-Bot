const fs = require("fs");
const path = require("path");

module.exports = {
  name: "pull",
  description: "Inspect project files (Dev only)",

  execute(message, args) {
    const DEV_ROLE_NAME = "Developer";

    // Check role
    if (!message.member.roles.cache.some(role => role.name === DEV_ROLE_NAME)) {
      return message.reply("❌ You need the Developer role to use this command.");
    }

    const fileName = args[0];

    if (!fileName) {
      return message.reply("❌ Provide a file name. Example: `-pull index.js`");
    }

    //  Block sensitive files
    if (fileName.includes(".env")) {
      return message.reply("❌ Access denied.");
    }

    const filePath = path.join(__dirname, "..", "..", fileName);

    if (!fs.existsSync(filePath)) {
      return message.reply("❌ File not found.");
    }

    const code = fs.readFileSync(filePath, "utf-8");

    const chunk = code.slice(0, 1900);

    message.channel.send({
      content: ` Pulling \`${fileName}\`...\n\`\`\`js\n${chunk}\n\`\`\``
    });
  }
};
