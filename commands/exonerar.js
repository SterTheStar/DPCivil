const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('exonerar')
        .setDescription('Exonerate a user from their roles.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to exonerate.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('qra')
                .setDescription('The QRA of the exonerated user.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('id')
                .setDescription('The ID of the exonerated user.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('motivo')
                .setDescription('The reason for the exoneration.')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('media')
                .setDescription('Media (image/video link) related to the exoneration')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false),
    async execute(interaction, client) {
        const { exonerarRole, exonerarChannel } = client.config
        if (!exonerarChannel || !exonerarRole) {
            await interaction.reply({ content: 'Config error: exonerarChannel or exonerarRole is not defined in the config file.', ephemeral: true });
            return;
        }
        const user = interaction.options.getMember('user');
        const qra = interaction.options.getString('qra');
        const id = interaction.options.getString('id');
        const motivo = interaction.options.getString('motivo');
        const media = interaction.options.getString('media');

        try {
            await interaction.deferReply({ ephemeral: true });
            await user.roles.set([]);
            await user.roles.add(exonerarRole);

            const channel = client.channels.cache.get(exonerarChannel);
            if (!channel) {
                console.error(`Exoneration channel not found with ID: ${exonerarChannel}`);
                await interaction.editReply({ content: 'User exonerated, but could not post the information due to a configuration error.' });
                return;
            }

              const embed = new EmbedBuilder()
                    .setTitle('User Exoneration')
                .setColor('#ff0000')
                .addFields(
                    { name: 'User', value: `${user.user.tag} (${user.id})` , inline: true },
                    { name: 'QRA', value: qra, inline: true },
                    { name: 'ID', value: id, inline: true },
                    { name: 'Motivo', value: motivo, inline: false })
                .setTimestamp();
                if (media) {
                    embed.setImage(media);
                }

            await channel.send({ embeds: [embed] });
            await interaction.editReply({ content: `User ${user.user.tag} has been exonerated.` });

        } catch (error) {
            console.error('Error exonerating user:', error);
            await interaction.reply({ content: 'An error occurred while exonerating the user.', ephemeral: true });
        }
    },
};