const { Client, GatewayIntentBits } = require("discord.js");
const Parser = require("rss-parser");
const parser = new Parser();
require("dotenv").config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

const YOUTUBE_CHANNELS = {
  "UCyL-QGEkA1r7R7U5rN_Yonw": { discordChannel: "1341719063780393031", name: "Vereshchak" },
  "UC16xML3oyIZDeF3g8nnV6MA": { discordChannel: "1341719063780393031", name: "Vokope" },
  "UCBrnPp4lpRukfuvXUiRz6_A": { discordChannel: "1341719134135779389", name: "Soulis HCR2" },
  "UCwxuNdbZ-nK5oUEeY1tY9CQ": { discordChannel: "1341719134135779389", name: "tas HCR2" },
  "UCBHmJJ0PN-efNW5PFdJ4EDQ": { discordChannel: "1341719134135779389", name: "PROJECT GER" },
  "UCv_5HRU2ctFoYNeWFGLNoXw": { discordChannel: "1341719134135779389", name: "Exodus Hcr2" },
  "UCF0iJo2klF-QGxzDDmOkQbQ": { discordChannel: "1341719134135779389", name: "Zorro HCR2" },
  "UCnCaLcVf4YsPcsvi6PE4m6A": { discordChannel: "1341733821707452437", name: "ChillHcr2Guy" },
};

let lastVideos = {};

async function checkYouTube() {
  for (const [youtubeId, { discordChannel, name }] of Object.entries(YOUTUBE_CHANNELS)) {
    try {
      const feed = await parser.parseURL(`https://www.youtube.com/feeds/videos.xml?channel_id=${youtubeId}`);
      if (!feed || !feed.items.length) continue;

      const latestVideo = feed.items[0];
      const videoId = latestVideo.id.split(":").pop();
      const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

      if (lastVideos[youtubeId] !== videoId) {
        lastVideos[youtubeId] = videoId;
        const channel = client.channels.cache.get(discordChannel);
        if (channel) {
          await channel.send(`**${name}** uploaded a new video!\n${videoUrl}`);
        }
      }
    } catch (error) {
      console.error(`Error fetching feed for ${youtubeId}:`, error);
    }
  }
}

client.once("ready", () => {
  console.log("YouTube Notifier is running...");
  checkYouTube();
  setInterval(checkYouTube, 5 * 60 * 1000); // Check every 5 minutes
});

client.login(process.env.TOKEN);
