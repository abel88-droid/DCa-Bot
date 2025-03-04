const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket')
        .setDescription('Sends Recruitment message'),
    async execute(interaction) {
        // Send an ephemeral message to the user
        await interaction.reply({ content: 'Connecting you to our recruiters...', ephemeral: true });

        // Create button to create a ticket
        const createTicketButton = new MessageButton()
            .setCustomId('create_ticket')
            .setLabel('Apply now!')
            .setStyle('PRIMARY');

        const row = new MessageActionRow().addComponents(createTicketButton);

        // Send a public message with a button to create a ticket
        await interaction.followUp({
            content: 'Press the button below to apply to one of our teams.',
            components: [row],
        });

        // Set up a button interaction handler
        const filter = (i) => i.customId === 'create_ticket' && i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async (i) => {
            if (i.customId === 'create_ticket') {
                // Create a new thread
                const thread = await interaction.channel.threads.create({
                    name: `${i.user.username}`,
                    autoArchiveDuration: 60,
                    reason: 'Applied to join one of our teams',
                });

                // Create a button to close the ticket
                const closeTicketButton = new MessageButton()
                    .setCustomId('close_ticket')
                    .setLabel('Close Ticket')
                    .setStyle('DANGER');

                const closeRow = new MessageActionRow().addComponents(closeTicketButton);

                // Create an embed for the ticket
                const ticketEmbed = new MessageEmbed()
                    .setTitle('Ticket')
                    .setDescription(`Hello ${i.user}, how can we assist you today?`)
                    .setColor('BLUE');

                // Send an embed with a button to close the ticket
                await thread.send({ embeds: [ticketEmbed], components: [closeRow] });

                await i.reply({ content: 'Please check the thread you have been pinged in and our recruiters will assist you from there', ephemeral: true });

                // Set up a button interaction handler for closing the ticket
                const closeFilter = (i) => i.customId === 'close_ticket' && i.user.id === interaction.user.id;
                const closeCollector = thread.createMessageComponentCollector({ closeFilter, time: 86400000 });

                closeCollector.on('collect', async (i) => {
                    if (i.customId === 'close_ticket') {
                        await thread.setArchived(true);
                        await i.reply({ content: 'Ticket closed and archived!', ephemeral: true });
                    }
                });
            }
        });
    },
};
