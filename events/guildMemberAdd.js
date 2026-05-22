module.exports = {
    name: "guildMemberAdd",
    execute(member) {
        const channel = member.guild.channels.cache.get("916042813425201152"); // Update with your channel ID
        if (!channel) return;

        channel.send({
            content: `
Hey ${member}! 👋  
Welcome to the **Discord Alliance server**!

> 1️⃣ **Head to <#839605609027600415>**  
> Read the server rules carefully, and once done, press ☑️ to get access to the main channels.  
>  
> 2️⃣ **Unlock More Channels**  
> Go to <#840310137390104627> and select your desired option to access more channels of this server.  
>  
> 3️⃣ **Name Policy**  
> Please make sure your in-game name and your Discord display name matches in this server.
> This helps leaders identify you easily.  

If you want access to more channels in the **Discord Drivers** server, just reach out to your team leader or co-leaders.  

**Have fun and enjoy your time here!**
            `
        });
    }
};
