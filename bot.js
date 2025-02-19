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

// Member Join Message
client.on('guildMemberAdd', member => {
  const welcomeChannel = member.guild.channels.cache.get('1341567042880278548'); // Replace with your actual channel ID

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

// Member Leave Message
client.on('guildMemberRemove', member => {
  const leavingChannel = member.guild.channels.cache.get('1341566528989958266'); // Replace with actual channel ID

  if (leavingChannel) {
    leavingChannel.send(`**${member.user.tag}** Left **DC driver Alliance**`);
  } else {
    console.error("Bot cannot find the specified leaving channel!");
  }
});

// Log in to Discord with the bot token
client.login(process.env.DISCORD_TOKEN);
