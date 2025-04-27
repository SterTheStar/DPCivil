const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const RequestManager = require('../utils/requestManager');

const types = ['Recrutamentos', 'Prisões'];

module.exports = {
    data: {      
        name: 'solicitar',
        description: 'Solicitar algo.',
        options: [ 
            {
                name: 'type',
                description: 'Type of request',
                type: 3,
                required: true,
                choices: types.map(type => ({ name: type, value: type }))
            },
            {
                name: 'quantity',
                description: 'Quantity of items',
                type: 4,
                required: true
            }
        ]
    },

    async execute(interaction, client) {
        const { channelId, adminRole } = require('../config.json'); 
        const type = interaction.options.getString('type');
        const quantity = interaction.options.getInteger('quantity');
        const member = interaction.member;
        const requestManager = new RequestManager();
    
        if (!types.includes(type)) {
            await interaction.reply({ content: `Invalid type. Available types are: ${types.join(', ')}`, ephemeral: true });
            return;
        }
    
        const token = Date.now();
        const embed = new EmbedBuilder()
            .setTitle('Nova Solicitação')
            .setDescription(`Tipo: ${type}\nQuantidade: ${quantity}\nSolicitado por: <@${member.user.id}>\nToken: ${token}`)
            .setColor('#0099ff')
            .setTimestamp();
    
        const channel = client.channels.cache.get(channelId); 
        if (!channel) return;
    
        const message = await channel.send({ embeds: [embed]});
        
    
        requestManager.addRequest({
            token: token,
            type,
            quantity,
            memberId: member.user.id,
            messageId: message.id,
            channelId: channelId
        });
        
       

        await interaction.reply({ content: `Sua solicitação com o token ${token} foi enviada!`, ephemeral: true });
    }
};