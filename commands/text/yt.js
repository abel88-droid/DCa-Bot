const { Events } = require("discord.js");

const YOUTUBE_CHANNELS = {
    "UCyL-QGEkA1r7R7U5rN_Yonw": { name: "Vereshchak" },
    "UC16xML3oyIZDeF3g8nnV6MA": { name: "Vokope" },
    "UCBrnPp4lpRukfuvXUiRz6_A": { name: "Soulis HCR2" },
    "UCwxuNdbZ-nK5oUEeY1tY9CQ": { name: "tas HCR2" },
    "UCBHmJJ0PN-efNW5PFdJ4EDQ": { name: "PROJECT GER" },
    "UCv_5HRU2ctFoYNeWFGLNoXw": { name: "Exodus HCR2" },
    "UCF0iJo2klF-QGxzDDmOkQbQ": { name: "Zorro HCR2" },
    "UCnCaLcVf4YsPcsvi6PE4m6A": { name: "ChillHcr2Guy" },
};

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        // Ignore bot messages and messages not starting with "-yt list"
        if (message.author.bot || !message.content.startsWith("-yt list")) return;

        // Create a formatted list of YouTube channels
        const channelList = Object.entries(YOUTUBE_CHANNELS)
            .map(([id, { name }]) => `📺 **${name}** - [YouTube](https://www.youtube.com/channel/${id})`)
            .join("\n");

        await message.reply(channelList || "No YouTube channels are being tracked.");
    },
};
