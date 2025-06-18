module.exports = {
    name: "guildMemberAdd",
    execute(member) {
        const channel = member.guild.channels.cache.get("916042813425201152"); // Update with your channel ID
        if (!channel) return;

        channel.send(`Hey ${member}! 👋
Welcome to the **Discord Alliance server**!

**Getting Started**:
> 1. Please go to <#839605609027600415> and read the server rules. You’ll get access to the main channels after you press ☑️.

> 2. There are many more channels available. Head over to <#840310137390104627> and select your options to unlock them.

> 3. Please make sure your in-game name and Discord display name are the same on this server, so your leaders can identify you easily (it's mandatory).

If you want access to more channels in the **Discord Drivers server**, please contact your team leader.

**Have fun and enjoy your time here!**`);
    }
};
