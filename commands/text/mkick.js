const { PermissionsBitField, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "mkick",
  description: "Kicks all members with a specific role. Usage: -mkick @role [reason]",
  prefix: "-",
  async execute(message, args) {
    if (!message.content.startsWith(this.prefix)) return;

    // Administrator permission
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return message.reply("❌ This command can only be used by administrators.");
    }

    const role = message.mentions.roles.first();
    if (!role) {
      return message.reply("Please mention a valid role to kick its members.");
    }

    if (args.length < 2) {
      return message.reply("❌ Error: A reason is required! Usage: -mkick @role [reason]");
    }

    const reason = args.slice(1).join(" ");
    const action = "Kicked";
    const kickedMembers = [];
    const failedKicks = [];

    // FETCH ALL MEMBERS FIRST (fix)
    await message.guild.members.fetch();

    // Get members with role
    const membersWithRole = message.guild.members.cache.filter(member =>
      member.roles.cache.has(role.id) &&
      member.kickable &&
      member.id !== message.guild.ownerId
    );

    if (membersWithRole.size === 0) {
      return message.reply("No kickable members found with that role.");
    }

    const confirmMessage = await message.reply(
      `Are you sure you want to kick ${membersWithRole.size} members with the ${role.name} role? Reply with \`yes\` to confirm or \`no\` to cancel.`
    );

    try {
      const collected = await message.channel.awaitMessages({
        filter: m => m.author.id === message.author.id && ['yes', 'no'].includes(m.content.toLowerCase()),
        max: 1,
        time: 30000,
        errors: ['time']
      });

      const response = collected.first().content.toLowerCase();
      if (response !== 'yes') {
        return message.reply("Operation cancelled.");
      }
    } catch (error) {
      return message.reply("No confirmation received within 30 seconds. Operation cancelled.");
    }

    // Create DM embed
    const dmEmbed = new EmbedBuilder()
      .setColor(0xFF0000)
      .setTitle(`You have been ${action}`)
      .setDescription(`You have been **${action}** from **${message.guild.name}**.`)
      .addFields(
        { name: "Reason", value: reason },
        { name: "Need Help?", value: "If you think this is a mistake, please contact:\n- gorillakurt\n- dc_void_\n- b7m5" }
      )
      .setTimestamp();

    const statusMessage = await message.reply("Processing kicks...");
    let processedCount = 0;

    for (const [_, member] of membersWithRole) {
      try {

        try {
          await member.send({ embeds: [dmEmbed] });
        } catch (dmError) {
          console.log(`Could not DM user ${member.user.tag}`);
        }

        await member.kick(reason);
        kickedMembers.push(member.user.tag);

        processedCount++;

        if (processedCount % 5 === 0) {
          await statusMessage.edit(`Processed ${processedCount}/${membersWithRole.size} members...`);
        }

        // small delay to avoid rate limits
        await new Promise(r => setTimeout(r, 800));

      } catch (error) {
        console.error(`Failed to kick ${member.user.tag}:`, error);
        failedKicks.push(member.user.tag);
      }
    }

    const resultEmbed = new EmbedBuilder()
      .setColor(0x00FF00)
      .setTitle("Mass Kick Results")
      .setDescription(`Completed kicking members with role: ${role.name}`)
      .addFields({
        name: "Successfully Kicked",
        value: kickedMembers.length > 0
          ? kickedMembers.slice(0, 20).join('\n')
          : "None",
        inline: false
      })
      .setTimestamp();

    if (failedKicks.length > 0) {
      resultEmbed.addFields({
        name: "Failed to Kick",
        value: failedKicks.slice(0, 20).join('\n'),
        inline: false
      });
    }

    await message.channel.send({ embeds: [resultEmbed] });

    await statusMessage.delete().catch(() => {});
  },
};

