const { PermissionsBitField } = require("discord.js");

module.exports = {
    name: "ban",
    description: "Bans a user from the server",
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return message.reply("You do not have permission to ban members.");
        }

        const user = message.mentions.members.first();
        if (!user) {
            return message.reply("Please mention a user to ban.");
        }

        const reason = args.slice(1).join(" ") || "No reason provided";

        if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return message.reply("I do not have permission to ban members.");
        }

        try {
            await user.ban({ reason });
            message.channel.send(`**${user.user.tag**} has been banned. **Reason**: *${reason}*`);
        } catch (error) {
            console.error(error);
            message.reply("I was unable to ban the member.");
        }
    }
};
