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
  // Get the channel to send the welcome message
  const channel = member.guild.systemChannel;
  
  // Make sure the channel is available and the bot has permission to send messages
  if (channel) {
    channel.send(`**Welcome <@${member.id}>** 🤗

If you **haven't** read the <#1239880290026000385>, please do.
There is an explanation of the different roles in here too. Read them here <#1340644055855399005>.

There are more channels than you can see. Go to <#1239880291523366942> and select/deselect them.

If you want access to Discord Driver main other channel, please contact your leaders.

**Hope you will have fun in DC driver Alliance** 👍`);
  }
});

// Log in to Discord with the bot token
client.login(process.env.DISCORD_TOKEN);
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Bot is running!');
});

app.listen(PORT, () => {
  console.log(`Server is live at http://localhost:${PORT}`);
});
