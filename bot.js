const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('guildMemberAdd', member => {
  // Use the raw channel ID (without <# >)
  const welcomeChannel = member.guild.channels.cache.get('1239879910118654016'); // Replace with your actual channel ID

  if (welcomeChannel) {
    welcomeChannel.send(`**Welcome <@${member.id}>** 🤗

If you **haven't** read the <#1239880290026000385>, please do.
There is an explanation of the different roles in here too. Read them here <#1340644055855399005>.

There are more channels than you can see. Go to <#1239880291523366942> and select/deselect them.

If you want access to Discord Driver main other channel, please contact your leaders.

**Hope you will have fun in DC driver Alliance** 👍`);
  } else {
    console.error("Bot cannot find the specified welcome channel!");
  }
});

// Log in to Discord with the bot token
client.login(process.env.DISCORD_TOKEN);
