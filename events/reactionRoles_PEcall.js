const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMembers],
});

const MESSAGE_ID = "1346079269985583154";
const CHANNEL_ID = "1345936577410502716";
const ROLE_ID = "1346079729375252512";
const EMOJI = "👍";

client.once("ready", async () => {
  console.log(`Logged in as ${client.user.tag}`);

  const channel = await client.channels.fetch(CHANNEL_ID);
  if (!channel) return console.log("Channel not found.");

  try {
    const message = await channel.messages.fetch(MESSAGE_ID);
    await message.react(EMOJI); 
    console.log("Reaction added to the message.");
  } catch (error) {
    console.error("Failed to fetch message or react:", error);
  }
});

client.on("messageReactionAdd", async (reaction, user) => {
  if (reaction.message.id === MESSAGE_ID && reaction.emoji.name === EMOJI) {
    const member = await reaction.message.guild.members.fetch(user.id);
    if (member) {
      await member.roles.add(ROLE_ID);
      console.log(`Added role to ${user.tag}`);
    }
  }
});

client.on("messageReactionRemove", async (reaction, user) => {
  if (reaction.message.id === MESSAGE_ID && reaction.emoji.name === EMOJI) {
    const member = await reaction.message.guild.members.fetch(user.id);
    if (member) {
      await member.roles.remove(ROLE_ID);
      console.log(`Removed role from ${user.tag}`);
    }
  }
});

client.login("YOUR_BOT_TOKEN"); // Replace with your bot token
