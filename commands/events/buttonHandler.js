const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, ChannelType } = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (!interaction.isButton()) return;

        const { customId, guild, member, channel } = interaction;

        // 🎟️ Ticket System: Handle 'open_ticket' Button
        if (customId === 'open_ticket') {
            const existingThread = guild.channels.cache.find(ch => 
                ch.type === ChannelType.PrivateThread && ch.name.includes(member.user.username)
            );

            if (existingThread) {
                return interaction.reply({ content: 'You already have an open ticket!', ephemeral: true });
            }

            const thread = await channel.threads.create({
                name: `Ticket - ${member.user.username}`,
                autoArchiveDuration: 60,
                type: ChannelType.PrivateThread,
                reason: `Support ticket opened by ${member.user.tag}`,
            });

            await thread.members.add(member.id);

            const embed = new EmbedBuilder()
                .setTitle('Now we need some details...')
                .setDescription(
                    "Great that you want to join us! Please send the following screenshots, so we can find out which team fits best.\n\n" +
                    "• **Your in-game profile (incl. GP)**\n" +
                    "• **Recent team event scores**\n\n" +
                    "**Additional questions:**\n" +
                    "1️⃣ Which team do you want to join?\n" +
                    "2️⃣ Do you have other accounts, if yes, in which team?\n" +
                    "3️⃣ Were you ever flagged/banned, had double VIP?\n" +
                    "4️⃣ Do you want to stay long-term or just visit?\n" +
                    "5️⃣ How many km's do you usually drive per week?"
                )
                .setColor('#5865F2');

            const closeButton = new ButtonBuilder()
                .setCustomId('close_ticket')
                .setLabel('Close')
                .setStyle(ButtonStyle.Danger)
                .setEmoji('🔒');

            const closeReasonButton = new ButtonBuilder()
                .setCustomId('close_ticket_reason')
                .setLabel('Close With Reason')
                .setStyle(ButtonStyle.Danger)
                .setEmoji('🔒');

            const actionRow = new ActionRowBuilder().addComponents(closeButton, closeReasonButton);

            await thread.send({ embeds: [embed], components: [actionRow] });

            return interaction.reply({ content: 'Your ticket has been created!', ephemeral: true });
        }

        // ✅ Handle 'apply_button' Click
        if (customId === 'apply_button') {
            await interaction.reply({ content: "You clicked 'Apply'! We will process your application soon.", ephemeral: true });
        }
    }
};
