const { ActionRowBuilder, ButtonBuilder, ButtonStyle, Events } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        const channelId = '1346299247779250246';
        const roleId = '1346297821120299028';

        client.channels.fetch(channelId).then(channel => {
            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('apply_button')
                    .setLabel('Apply')
                    .setStyle(ButtonStyle.Primary)
            );

            channel.send({
                content: '**Apply to join the team!**\nClick the button below to start.',
                components: [row]
            });
        });
    }
};
