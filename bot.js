const { Client, GatewayIntentBits, PermissionsBitField } = require('discord.js');
const axios = require('axios');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const CHECK_INTERVAL = 60000;

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

let lastVideoIds = {};

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
      if (!video || !video.id.videoId) continue;

      const videoId = video.id.videoId;
      const channelName = video.snippet.channelTitle;
      const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

      if (lastVideoIds[youtubeChannelId] === videoId) continue;
      lastVideoIds[youtubeChannelId] = videoId;

      const discordChannel = client.channels.cache.get(discordChannelId);
      if (discordChannel) {
        discordChannel.send(`(${channelName}) uploaded a new YouTube video!\n${videoUrl}`);
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

client.on("messageCreate", async (message) => {
  if (message.author.bot || !message.guild) return;

  const args = message.content.split(" ");
  const command = args.shift().toLowerCase();

  if (command === "-ban") {
    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return message.reply("You don't have permission!");
    const user = message.mentions.members.first();
    const reason = args.slice(1).join(" ") || "No reason provided";
    let days = 0;
    
    const daysArgIndex = args.findIndex(arg => arg.startsWith("-ddays"));
    if (daysArgIndex !== -1 && args[daysArgIndex + 1]) {
      days = parseInt(args[daysArgIndex + 1]) || 0;
    }

    if (user) {
      await user.ban({ days, reason });
      message.channel.send(`${user.user.tag} has been banned. Reason: ${reason}`);
    } else {
      message.reply("Please mention a user to ban.");
    }
  }

  if (command === "-unban") {
    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return message.reply("You don't have permission!");
    const userId = args[0];
    const reason = args.slice(1).join(" ") || "No reason provided";
    
    message.guild.bans.fetch().then(bans => {
      const bannedUser = bans.get(userId);
      if (bannedUser) {
        message.guild.members.unban(userId, reason);
        message.channel.send(`${bannedUser.user.tag} has been unbanned.`);
      } else {
        message.reply("This user is not banned.");
      }
    });
  }

  if (command === "-kick") {
    if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) return message.reply("You don't have permission!");
    const user = message.mentions.members.first();
    const reason = args.slice(1).join(" ") || "No reason provided";

    if (user) {
      await user.kick(reason);
      message.channel.send(`${user.user.tag} has been kicked. Reason: ${reason}`);
    } else {
      message.reply("Please mention a user to kick.");
    }
  }

  if (command === "-warn") {
    message.reply("Warning system is not yet implemented.");
  }

  if (command === "-warnings") {
    message.reply("Warning retrieval system is not yet implemented.");
  }

  if (command === "-whois") {
    const user = message.mentions.members.first() || message.member;
    const joinDate = user.joinedAt.toDateString();
    message.channel.send(`${user.user.tag} joined on ${joinDate}.`);
  }

  if (command === "-clean") {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return message.reply("You don't have permission!");
    const amount = parseInt(args[0]);
    const noPin = args.includes("-nopin");

    if (isNaN(amount) || amount < 1 || amount > 100) {
      return message.reply("Please provide a number between 1 and 100.");
    }

    const messages = await message.channel.messages.fetch({ limit: amount });
    const filteredMessages = noPin ? messages.filter(m => !m.pinned) : messages;

    await message.channel.bulkDelete(filteredMessages, true);
    message.channel.send(`Deleted ${filteredMessages.size} messages.`);
  }
});

client.on('guildMemberAdd', member => {
  const welcomeChannel = member.guild.channels.cache.get('1239879910118654016');
  if (welcomeChannel) {
    welcomeChannel.send(`Welcome <@${member.id}>! Please check the rules and role selection.`);
  }
});

client.on('guildMemberRemove', member => {
  const leavingChannel = member.guild.channels.cache.get('1341566528989958266');
  if (leavingChannel) {
    leavingChannel.send(`${member.user.tag} left the server.`);
  }
});

client.login(process.env.DISCORD_TOKEN);
