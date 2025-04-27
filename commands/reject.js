const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const RequestManager = require('../utils/requestManager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rejeitar')
        .setDescription('Rejeita uma solicitação pelo seu token.')
        .addStringOption(option =>
            option.setName('token')
                .setDescription('O token da solicitação a ser rejeitada.')
                .setRequired(true)
        ),
    async execute(interaction, client) {
        try{
            const requestManager = new RequestManager();
            const token = interaction.options.getString('token');
            const request = requestManager.getRequest(parseInt(token));

            if (!request) {
                await interaction.reply({ content: 'Invalid or expired token.', ephemeral: true });
                return;
            }

            requestManager.updateRequest(parseInt(token), { rejected: true })
            const { type, quantity, memberId, messageId, channelId } = request;
            const channel = client.channels.cache.get(channelId);
            const message = await channel.messages.fetch(messageId);

            const user = await client.users.fetch(memberId);
            user.send(`Your request for ${quantity} ${type} has been rejected!`);
            const newEmbed = EmbedBuilder.from(message.embeds[0]).setColor('Red').setTitle(`[REJECTED] Request Token ${token}`);
            message.edit({ embeds: [newEmbed], components: [] });
            requestManager.deleteRequest(parseInt(token));

            await interaction.reply({ content: `Request ${token} has been rejected.`, ephemeral: true });
        }catch(error){
            await interaction.reply({ content: 'An error occurred while rejecting the request.', ephemeral: true });
        }
    },
};