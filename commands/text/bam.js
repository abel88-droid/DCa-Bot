module.exports = {
    name: "bam",
    description: "Funny fake ban command",
    run: async (client, message, args) => {

        const target = message.mentions.users.first();

        if (!target) {
            return message.reply("Bruh 💀 who am I supposed to BAM? You want **yourself** to get blasted?");
        }

        const responses = [
            `BAM! **${target}** just got blasted into another dimension!`,
            `POW! **${target}** has been fried crispy!`,
            `BOOM! **${target}** couldn't survive the BAM attack!`,
            `WHAM! **${target}** got folded like a shirt!`,
            `KABOOM! **${target}** has been deleted (in your imagination 😭).`
        ];

        const random = responses[Math.floor(Math.random() * responses.length)];

        message.channel.send(random);
    }
};
