module.exports = {
    name: "guildMemberAdd",
    execute(member) {
        const channel = member.guild.channels.cache.get("916042813425201152"); // Update with your channel ID
        if (!channel) return;

        channel.send(` **Welcome** ${member}, 👋\n\nIf you **haven't** read the <#839605609027600415>, please do.\nThere is an explanation of the different roles in here too. Read them here <#981257687008428082>.\n\nThere are more channels than you can see. Go to <#840310137390104627> and select/deselect them.\n\nIf you want access to Discord Driver main other channel, please contact your leaders.\n\n**Hope you will have fun in DC driver Alliance** 👍`);
    }
};
