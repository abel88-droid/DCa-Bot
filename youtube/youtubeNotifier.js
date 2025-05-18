const { Client, GatewayIntentBits } = require("discord.js");
const Parser = require("rss-parser");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const SENT_VIDEOS_FILE = "./youtube/sentVideos.json";
const FEEDS_FILE = "./youtube/feeds.json";

if (!fs.existsSync(path.join(__dirname, "youtube"))) {
  fs.mkdirSync(path.join(__dirname, "youtube"), { recursive: true });
}

const parser = new Parser();
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

// Load feeds.json
let YOUTUBE_CHANNELS = {};
if (fs.existsSync(FEEDS_FILE)) {
  try {
    YOUTUBE_CHANNELS = JSON.parse(fs.readFileSync(FEEDS_FILE, "utf8"));
  } catch (error) {
    console.error("Error reading feeds.json:", error);
  }
} else {
  console.error("feeds.json not found!");
}

let sentVideos = {};
if (fs.existsSync(SENT_VIDEOS_FILE)) {
  try {
    sentVideos = JSON.parse(fs.readFileSync(SENT_VIDEOS_FILE, "utf8"));
  } catch (error) {
    console.error("Error reading sentVideos.json:", error);
  }
}

async function checkYouTube() {
  for (const [youtubeId, { discordChannel, name }] of Object.entries(YOUTUBE_CHANNELS)) {
    try {
      const feed = await parser.parseURL(`https://www.youtube.com/feeds/videos.xml?channel_id=${youtubeId}`);
      if (!feed || !feed.items.length) continue;

      const latestVideo = feed.items[0];
      const videoId = latestVideo.id.split(":").pop();
      const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

      // Ensure channel has a video history array
      // First time tracking this channel
        if (!sentVideos[youtubeId]) {
         sentVideos[youtubeId] = [videoId]; // Save current video but don't send it
         fs.writeFileSync(SENT_VIDEOS_FILE, JSON.stringify(sentVideos, null, 2));
          continue; // Skip sending message
}

// Already tracking — check if this video is new
if (!sentVideos[youtubeId].includes(videoId)) {
        const channel = client.channels.cache.get(discordChannel);
        if (channel) {
          await channel.send(`**${name}** uploaded a new video!\n${videoUrl}`);
        }

        // Update sent history (add to front, keep only latest 5)
        sentVideos[youtubeId].unshift(videoId);
        sentVideos[youtubeId] = sentVideos[youtubeId].slice(0, 5); // Keep only last 5

        try {
          fs.writeFileSync(SENT_VIDEOS_FILE, JSON.stringify(sentVideos, null, 2));
        } catch (error) {
          console.error("Error saving sentVideos.json:", error);
        }
      }
    } catch (error) {
      console.error(`Error fetching feed for ${youtubeId}:`, error);
    }
  }
}

client.once("ready", () => {
  console.log("YouTube Notifier is running...");
  setTimeout(() => checkYouTube(), 10000); // Wait 10 seconds before first check
  setInterval(checkYouTube, 5 * 60 * 1000); // Check every 5 minutes
});

client.login(process.env.TOKEN);
