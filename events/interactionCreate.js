const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const RequestManager = require('../utils/requestManager');
const UserManager = require('../utils/userManager')
const requestManager = new RequestManager();
const userManager = new UserManager()

const types = ['Recrutamentos', 'Prisões'];

module.exports = {
    data: new SlashCommandBuilder().setName('solicitar').setDescription('Request something')
        .addStringOption(option => option.setName('type').setDescription('Type of request').setRequired(true).addChoices(...types.map(type => ({ name: type, value: type }))))
        .addIntegerOption(option => option.setName('quantity').setDescription('Quantity of items').setRequired(true)),
    async execute(interaction, client) {
        let token;
        if (interaction.isChatInputCommand()) {
            if (interaction.commandName === 'solicitar') {
                const type = interaction.options.getString('type');
                const quantity = interaction.options.getInteger('quantity');
                const member = interaction.member;
    
                if (!types.includes(type)) {
                    await interaction.reply({ content: `Invalid type. Available types are: ${types.join(', ')}`, ephemeral: true });
                    return;
                }
    
                token = Date.now();
                const request = {type, quantity, memberId: member.user.id, messageId:null, channelId: client.config.channelId, token: token}
                const embed = new EmbedBuilder()
                    
                    .setTitle('New Request')
                    .setDescription(`Type: ${type}\nQuantity: ${quantity}\nRequested by: <@${member.user.id}>\nToken: ${token}`)
                    .setColor('#0099ff')
                    .setTimestamp();
    
                const acceptButton = new ButtonBuilder()
                    .setCustomId(`accept-${token}`)
                    .setLabel('Accept')
                    .setStyle(ButtonStyle.Success);
                const rejectButton = new ButtonBuilder()
                    .setCustomId(`reject-${newToken}`)
                    .setLabel('Reject')    
                    .setStyle(ButtonStyle.Danger);
    
                const row = new ActionRowBuilder().addComponents(acceptButton, rejectButton);
    
                const channel = client.channels.cache.get(client.config.channelId);
                if (!channel) return;
    
                const message = await channel.send({ embeds: [embed], components: [row] });                
                
                request.messageId = message.id
                requestManager.addRequest(request)

                await interaction.reply({ content: `Your request with token ${token} has been submitted!`, ephemeral: true });
            }
        } else if (interaction.isButton()) {
            if (!interaction.member.roles.cache.has(client.config.adminRole)) {
                await interaction.reply({ content: 'You are not allowed to use this button', ephemeral: true });
                return;
            }
    
            const [action, token] = interaction.customId.split('-');
            const request = requestManager.getRequest(parseInt(token));
    
            if (!request) {
                await interaction.reply({ content: 'This request no longer exists.', ephemeral: true });
                return;
            }
    
            const { type, quantity, memberId, messageId, channelId } = request;
            const channel = client.channels.cache.get(channelId);
            const message = await channel.messages.fetch(messageId);
            
            if (action === 'accept') {
                const user = await client.users.fetch(memberId);
                user.send(`Your request for ${quantity} ${type} has been accepted!`);
                const newEmbed = EmbedBuilder.from(message.embeds[0]).setColor('Green').setTitle(`[ACCEPTED] Request Token ${token}`);
                userManager.addItem(memberId, type, quantity)
                requestManager.deleteRequest(token);
                message.edit({ embeds: [newEmbed], components: [] });
    
            } else if (action === 'reject') {
                const user = await client.users.fetch(memberId);
                user.send(`Your request for ${quantity} ${type} has been rejected!`);
                const newEmbed = EmbedBuilder.from(message.embeds[0]).setColor('Red').setTitle(`[REJECTED] Request Token ${token}`);
                message.edit({ embeds: [newEmbed], components: [] });
    
            }           
            
            await interaction.reply({ content: `Request ${token} has been ${action}ed.`, ephemeral: true });
        }
    },
    types: types
};