const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
});

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY; // YouTube API Key
const CHECK_INTERVAL = 60000; // Check interval (1 minute)

// YouTube channels mapped to specific Discord channels
const YOUTUBE_CHANNELS = {
  "UCyL-QGEkA1r7R7U5rN_Yonw": "1341719063780393031", 
  "UC16xML3oyIZDeF3g8nnV6MA": "1341719063780393031", 
  "UCnCaLcVf4YsPcsvi6PE4m6A": "1341733821707452437", 
  "UCBrnPp4lpRukfuvXUiRz6_A": "1341719134135779389", 
  "UC_Sn3iTUicORvNCieX-AqzQ": "1341719134135779389",
  "UCwxuNdbZ-nK5oUEeY1tY9CQ": "1341719134135779389",
  "UCBHmJJ0PN-efNW5PFdJ4EDQ": "1341719134135779389",
  "UCv_5HRU2ctFoYNeWFGLNoXw": "1341719134135779389",
  "UCF0iJo2klF-QGxzDDmOkQbQ": "1341719134135779389",
};

let lastVideoIds = {}; // Store last video IDs to prevent duplicate postings

async function checkForNewVideo() {
  try {
    for (const [youtubeChannelId, discordChannelId] of Object.entries(YOUTUBE_CHANNELS)) {
      const response = await axios.get("https://www.googleapis.com/youtube/v3/search", {
        params: {
          key: YOUTUBE_API_KEY,
          channelId: youtubeChannelId,
          part: "snippet",
          order: "date",
          maxResults: 1,
        },
      });

      const video = response.data.items[0];
      if (!video || !video.id.videoId) continue; // Skip if no video found

      const videoId = video.id.videoId;
      const channelName = video.snippet.channelTitle;
      const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

      // Check if it's a new video
      if (lastVideoIds[youtubeChannelId] === videoId) {
        console.log(`No new video for ${channelName}`);
        continue; // Skip posting duplicate video
      }

      lastVideoIds[youtubeChannelId] = videoId; // Update last posted video ID

      // Fetch the correct Discord channel and send the message
      const discordChannel = client.channels.cache.get(discordChannelId);
      if (discordChannel) {
        discordChannel.send(`(${channelName}) uploaded a new YouTube video!\n${videoUrl}`);
      } else {
        console.error(`Could not find Discord channel ID: ${discordChannelId}`);
      }
    }
  } catch (error) {
    console.error("Error fetching YouTube data:", error);
  }
}

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  setInterval(checkForNewVideo, CHECK_INTERVAL);
});

// Member Join Message
client.on('guildMemberAdd', member => {
  const welcomeChannel = member.guild.channels.cache.get('1239879910118654016'); // Replace with your actual channel ID

  if (welcomeChannel) {
    welcomeChannel.send(`Welcome <@${member.id}>

If you haven't read the <#1239880290026000385>, please do.
There is an explanation of the different roles in here too. Read them here <#1340644055855399005>.

There are more channels than you can see. Go to <#1239880291523366942> and select/deselect them.

If you want access to Discord Driver main other channel, please contact your leaders.

Hope you will have fun in DC driver Alliance`);
  } else {
    console.error("Bot cannot find the specified welcome channel!");
  }
});

// Member Leave Message
client.on('guildMemberRemove', member => {
  const leavingChannel = member.guild.channels.cache.get('1341566528989958266'); // Replace with actual channel ID

  if (leavingChannel) {
    leavingChannel.send(`${member.user.tag} Left DC driver Alliance`);
  } else {
    console.error("Bot cannot find the specified leaving channel!");
  }
});

// Log in to Discord
client.login(process.env.DISCORD_TOKEN);
