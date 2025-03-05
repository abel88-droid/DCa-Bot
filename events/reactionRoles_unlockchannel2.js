const { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMembers
    ]
});

const channelId = "1239880291523366942"; // #unlock-roles channel ID
const roleMappings = {
    "yagpdb": "1346087307538599956",
    "hcr2": "1346088650999464006",
    "meme": "1346088973004574851",
    "rhytm": "1346089335883042880"
};

client.on("ready", async () => {
    console.log(`✅ Logged in as ${client.user.tag}`);
    const channel = await client.channels.fetch(channelId);
    if (!channel) return console.log("❌ Channel not found!");

    
    const messageContent = `**To interact with bot choose which one.**\n\n
    1️⃣ yagpdb\n
    2️⃣ hcr2\n
    3️⃣ meme\n
    4️⃣ rhytm\n\n
    Click a button to select/deselect a role.`;

    
    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId("yagpdb").setLabel("1️⃣").setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId("hcr2").setLabel("2️⃣").setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId("meme").setLabel("3️⃣").setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId("rhytm").setLabel("4️⃣").setStyle(ButtonStyle.Primary)
    );

    try {
        // prevent duplicates
        let messages = await channel.messages.fetch({ limit: 10 });
        let botMessage = messages.find(msg => msg.author.id === client.user.id && msg.content.includes("To interact with bot choose which one."));

        if (!botMessage) {
            await channel.send({ content: messageContent, components: [row] });
            console.log("✅ Button role message sent!");
        } else {
            console.log("⚠️ Message already exists, skipping.");
        }
    } catch (error) {
        console.error("❌ Error sending message or adding buttons:", error);
    }
});


client.on("interactionCreate", async (interaction) => {
    if (!interaction.isButton()) return;

    const roleId = roleMappings[interaction.customId];
    if (!roleId) return;

    const member = interaction.member;

    if (member.roles.cache.has(roleId)) {
        await member.roles.remove(roleId);
        await interaction.reply({ content: `❌ Removed <@&${roleId}> role.`, ephemeral: true });
    } else {
        await member.roles.add(roleId);
        await interaction.reply({ content: `✅ Added <@&${roleId}> role.`, ephemeral: true });
    }
});

client.login(process.env.DISCORD_TOKEN);
