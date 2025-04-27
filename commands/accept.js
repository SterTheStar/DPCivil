const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const RequestManager = require('../utils/requestManager');
const UserManager = require('../utils/userManager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('aceitar')
        .setDescription('Aceita uma solicitação pelo token.')
        .addIntegerOption(option =>
            option.setName('token')
                .setDescription('O token da solicitação a ser aceita.')
                .setRequired(true)
        ),
    async execute(interaction, client) {
        const requestManager = new RequestManager();
        const userManager = new UserManager();
        const token = interaction.options.getInteger('token');
        const request = requestManager.getRequest(token);

        if (!request) {
            await interaction.reply({ content: 'Invalid token or request not found.', ephemeral: true });
            return;
        }

        const { type, quantity, memberId, messageId, channelId } = request;
        const channel = client.channels.cache.get(channelId);
        const message = await channel.messages.fetch(messageId);
        const user = await client.users.fetch(memberId);

        user.send(`Your request for ${quantity} ${type} has been accepted!`);
        const newEmbed = EmbedBuilder.from(message.embeds[0]).setColor('Green').setTitle(`[ACCEPTED] Request Token ${token}`);
        userManager.addItem(memberId, type, quantity);
        requestManager.updateRequest(token, { accepted: true })
        requestManager.deleteRequest(token);
        message.edit({ embeds: [newEmbed], components: [] });

        await interaction.reply({ content: `Request ${token} has been accepted.`, ephemeral: true });
    },
};