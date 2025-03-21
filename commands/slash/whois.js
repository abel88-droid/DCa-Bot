const { SlashCommandBuilder, EmbedBuilder, ActivityType } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("whois")
        .setDescription("Displays information about a user.")
        .addUserOption(option =>
            option.setName("target")
                .setDescription("The user to get information about")
                .setRequired(false)
        ),

    async execute(interaction) {
        const user = interaction.options.getUser("target") || interaction.user;
        const member = interaction.guild.members.cache.get(user.id);

        const createdAt = `<t:${Math.floor(user.createdTimestamp / 1000)}:f>`;
        const joinedAt = member ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:f>` : "Couldn't find out";

        let customStatus = "No custom status";
        if (member && member.presence && member.presence.activities.length > 0) {
            const customActivity = member.presence.activities.find(act => act.type === ActivityType.Custom);
            if (customActivity && customActivity.state) {
                customStatus = `Custom Status: "${customActivity.state}"`;
            }
        }

        const embed = new EmbedBuilder()
            .setTitle(`${user.username}`)
            .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 1024 }))
            .addFields(
                { name: "ID", value: user.id, inline: true },
                { name: "Avatar", value: `[Link](${user.displayAvatarURL({ dynamic: true, size: 1024 })})`, inline: true },
                { name: "Account Created", value: createdAt, inline: true },
                { name: "Account Age", value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`, inline: true },
                { name: "Joined Server At", value: joinedAt, inline: true },
                { name: "Join Server Age", value: member ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>` : "Couldn't find out", inline: true },
                { name: "Status", value: customStatus, inline: false }
            )
            .setColor("Blue");

        await interaction.reply({ embeds: [embed] });
    },
};
