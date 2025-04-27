const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const RequestManager = require('../utils/requestManager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('solicitacoes')
        .setDescription('Mostra o status de suas solicitações.'),
    async execute(interaction, client) {
        const requestManager = new RequestManager();
        const userId = interaction.user.id;
        const requests = requestManager.getAllRequestsByUser(userId);

        if (requests.length === 0) {
            await interaction.reply({ content: 'You have no requests.', ephemeral: true });
            return;
        }

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle(`${interaction.user.tag}'s Requests`)
            .setTimestamp();

        for (const request of requests) {
            let status = 'On analysis';
            if (request.accepted) {
                status = 'Accepted';
            } else if (request.rejected) {
                status = 'Rejected';
            }
            embed.addFields({ name: `Token: ${request.token}`, value: `Type: ${request.type}\nQuantity: ${request.quantity}\nStatus: ${status}`, inline: false });
        }

        await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};