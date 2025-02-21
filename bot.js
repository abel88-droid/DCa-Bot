const { Client, GatewayIntentBits } = require("discord.js");
require("dotenv").config();
const db = require("./database.js");
const { addYouTubeVideo } = require("./youtube.js");

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.GuildMembers
    ] 
});

client.once("ready", () => {
    console.log(`✅ Logged in as ${client.user.tag}`);
});

// Welcome Message
client.on("guildMemberAdd", member => {
    const welcomeChannel = member.guild.channels.cache.get("1239879910118654016"); // Correct welcome channel ID
    if (welcomeChannel) {
        welcomeChannel.send(
            `👋 Welcome **<@${member.id}>**!\n\n` +
            `If you **haven't** read the <#1239880290026000385> yet, please do. ` +
            `There is an explanation of the different roles in <#1340644055855399005>. ` +
            `More channels can be unlocked in <#1239880291523366942>.\n\n` +
            `Hope you will have **fun** in DC Driver Alliance! 👍`
        );
    }
});

// Leaving Message
client.on("guildMemberRemove", member => {
    const leaveChannel = member.guild.channels.cache.get("1341566528989958266"); // Correct leaving channel ID
    if (leaveChannel) {
        leaveChannel.send(`**${member.user.tag}** Left **DC Driver Alliance**`);
    }
});

client.on("messageCreate", async message => {
    if (!message.content.startsWith("-") || message.author.bot) return;
    
    const args = message.content.slice(1).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === "ban") {
        if (!message.member.permissions.has("BAN_MEMBERS")) return message.reply("❌ You don't have permission!");
        const user = message.mentions.members.first();
        if (!user) return message.reply("⚠️ Please mention a user.");
        const reason = args.slice(1).join(" ") || "No reason provided.";
        await user.ban({ reason });
        message.channel.send(`🔨 <@${user.id}> has been banned! Reason: ${reason}`);
    }

    if (command === "unban") {
        if (!message.member.permissions.has("BAN_MEMBERS")) return message.reply("❌ You don't have permission!");
        const userId = args[0];
        if (!userId) return message.reply("⚠️ Provide the user ID.");
        await message.guild.bans.remove(userId);
        message.channel.send(`✅ User with ID **${userId}** has been unbanned.`);
    }

    if (command === "kick") {
        if (!message.member.permissions.has("KICK_MEMBERS")) return message.reply("❌ You don't have permission!");
        const user = message.mentions.members.first();
        if (!user) return message.reply("⚠️ Please mention a user.");
        const reason = args.slice(1).join(" ") || "No reason provided.";
        await user.kick(reason);
        message.channel.send(`👢 <@${user.id}> has been kicked! Reason: ${reason}`);
    }

    if (command === "clean") {
        if (!message.member.permissions.has("MANAGE_MESSAGES")) return message.reply("❌ You don't have permission!");
        const deleteCount = parseInt(args[0]);
        if (isNaN(deleteCount) || deleteCount < 1 || deleteCount > 100) return message.reply("⚠️ Provide a number between 1-100.");
        const messages = await message.channel.bulkDelete(deleteCount, true);
        message.channel.send(`🧹 Deleted **${messages.size}** messages!`).then(msg => setTimeout(() => msg.delete(), 3000));
    }
});

client.login(process.env.TOKEN);
