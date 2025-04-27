const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const BlacklistManager = require('../utils/BlacklistManager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('blacklist')
        .setDescription('Manage the blacklist.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('Add a user to the blacklist.')
                .addUserOption(option => option.setName('user').setDescription('The user to add.').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('delete')
                .setDescription('Delete a user from the blacklist.')
                .addUserOption(option => option.setName('user').setDescription('The user to delete.').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('info')
                .setDescription('Get info about a user in the blacklist.')
                .addUserOption(option => option.setName('user').setDescription('The user to get info about.').setRequired(true))
        ),
    async execute(interaction, client) {
        const blacklistManager = new BlacklistManager();
        const subcommand = interaction.options.getSubcommand();
        const user = interaction.options.getUser('user');

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
    },
};