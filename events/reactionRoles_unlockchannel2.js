const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMembers] });

const TOKEN = "MTM0MDIyMjk3MTg0NzExNDc2Mg.Gus_c1.rcewlIIP4EDlT3PMmYEgSMCOo-NcBqp7Vdt2B4";
const CHANNEL_ID = "1239880291523366942";
const MESSAGE_ID = "1346086839299080218";

const roles = {
    "1️⃣": "1346087307538599956",
    "2️⃣": "1346088650999464006",
    "3️⃣": "1346088973004574851",
    "4️⃣": "1346089335883042880",
};

client.once("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on("messageReactionAdd", async (reaction, user) => {
    if (reaction.message.id !== MESSAGE_ID || user.bot) return;
    
    const roleId = roles[reaction.emoji.name];
    if (!roleId) return;

    const guild = reaction.message.guild;
    const member = await guild.members.fetch(user.id);
    await member.roles.add(roleId);
});

client.on("messageReactionRemove", async (reaction, user) => {
    if (reaction.message.id !== MESSAGE_ID || user.bot) return;

    const roleId = roles[reaction.emoji.name];
    if (!roleId) return;

    const guild = reaction.message.guild;
    const member = await guild.members.fetch(user.id);
    await member.roles.remove(roleId);
});

client.login(TOKEN);
