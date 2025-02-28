module.exports = (client) => {
    client.on("guildMemberAdd", (member) => {
        const channel = member.guild.channels.cache.get("1239879910118654016"); // Update with your actual channel ID
        if (!channel) return;

        channel.send(`Welcome ${member}, 👋\n\nIf you **haven't** read the <#1239880290026000385> (rules), please do.\nThere is an explanation of the different roles in here too. Read them here <#1340644055855399005>.\n\nThere are more channels than you can see. Go to <#1239880291523366942> and select/deselect them.\n\nIf you want access to Discord Driver main other channel, please contact your leaders.\n\n**Hope you will have fun in DC driver Alliance** 👍`);
    });
};
