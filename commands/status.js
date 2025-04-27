const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const UserManager = require('../utils/userManager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('Show your own status or the status of another user.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to check the status of.')
                .setRequired(false)
        ),
    async execute(interaction, client) {
        const userManager = new UserManager();
        const targetUser = interaction.options.getUser('user') || interaction.user;
        const userData = userManager.getUser(targetUser.id);

        if (!userData) {
            await interaction.reply({ content: targetUser.id === interaction.user.id ? 'You have no data yet!' : 'That user has no data yet!', ephemeral: true });
            return;
        }

        const totalPrisoes = userData.Prisões || 0;
        const totalRecrutamentos = userData.Recrutamentos || 0;

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle(`${targetUser.tag}'s Status`)
            .addFields(
                { name: 'Total Prisões', value: `${totalPrisoes}`, inline: true },
                { name: 'Total Recrutamentos', value: `${totalRecrutamentos}`, inline: true },
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};