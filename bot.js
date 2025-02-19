const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
});

const YOUTUBE_CHANNEL_IDS = [
  'UCyL-QGEkA1r7R7U5rN_Yonw', // Replace with YouTuber 1's channel ID
  'UC16xML3oyIZDeF3g8nnV6MA', // Replace with YouTuber 2's channel ID
  'UCF0iJo2klF-QGxzDDmOkQbQ'  // Add more as needed
];

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY; // Store your YouTube API key in the .env file
const CHECK_INTERVAL = 60000; // Time interval (1 minute)

let lastVideoIds = {}; // Object to store last video IDs for each channel

async function checkForNewVideo() {
  try {
    for (const channelId of YOUTUBE_CHANNEL_IDS) {
      const response = await axios.get("https://www.googleapis.com/youtube/v3/search", {
        params: {
          key: YOUTUBE_API_KEY,
          channelId: channelId,
          part: 'snippet',
          order: 'date',
          maxResults: 1
        }
      });

      const video = response.data.items[0];
      if (!video || !video.id.videoId) continue;

      const videoId = video.id.videoId;
      const videoTitle = video.snippet.title;
      const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

      // Check if a new video has been uploaded for this channel
      if (videoId !== lastVideoIds[channelId]) {
        lastVideoIds[channelId] = videoId;

        // Send the new video link to a specific channel
        const channel = client.channels.cache.get('1341719063780393031'); // Replace with your actual channel ID
        if (channel) {
          channel.send(`New video uploaded by **${video.snippet.channelTitle}**: **${videoTitle}**\nWatch it here: ${videoUrl}`);
        }
      }
    }
  } catch (error) {
    console.error('Error fetching YouTube data:', error);
  }
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  setInterval(checkForNewVideo, CHECK_INTERVAL);
});

// Member Join Message
client.on('guildMemberAdd', member => {
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
