const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const BlacklistManager = require('../utils/BlacklistManager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lista-negra')
        .setDescription('Gerencia a lista negra.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('adicionar')
                .setDescription('Adiciona um usuário à lista negra.')
                .addUserOption(option => option.setName('usuario').setDescription('O usuário a ser adicionado.').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('remover')
                .setDescription('Remove um usuário da lista negra.')
                .addUserOption(option => option.setName('usuario').setDescription('O usuário a ser removido.').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('info')
                .setDescription('Obtém informações sobre um usuário na lista negra.')
                .addUserOption(option => option.setName('usuario').setDescription('O usuario a obter informações').setRequired(true))
        ),
    async execute(interaction, client) {
        try{
            const blacklistManager = new BlacklistManager();
            const subcommand = interaction.options.getSubcommand();
            const user = interaction.options.getUser('usuario');

            if (subcommand === 'add') {
                if(blacklistManager.isBlacklisted(user.id)){
                    await interaction.reply({content: `The user ${user.tag} is already blacklisted`, ephemeral: true})
                    return
                }
                blacklistManager.addUser(user.id);
                await interaction.reply({ content: `User ${user.tag} has been added to the blacklist.`, ephemeral: true });
            } else if (subcommand === 'delete') {
                if(!blacklistManager.isBlacklisted(user.id)){
                    await interaction.reply({content: `The user ${user.tag} is not blacklisted`, ephemeral: true})
                    return
                }
                blacklistManager.deleteUser(user.id);
                await interaction.reply({ content: `User ${user.tag} has been removed from the blacklist.`, ephemeral: true });
            } else if (subcommand === 'info') {
                if(!blacklistManager.isBlacklisted(user.id)){
                    await interaction.reply({content: `The user ${user.tag} is not blacklisted`, ephemeral: true})
                    return
                }
                const embed = new EmbedBuilder()
                    .setTitle(`Blacklist Information`)
                    .setColor('#ff0000')
                    .addFields({ name: 'User', value: `${user.tag} (${user.id})` })
                    .setTimestamp();
                await interaction.reply({ embeds: [embed], ephemeral: true });
            }
        }catch(error){
             await interaction.reply({ content: 'An error occurred while managing the blacklist.', ephemeral: true });
        }
    },
};