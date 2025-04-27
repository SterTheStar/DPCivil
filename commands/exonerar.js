const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('exonerar')
        .setDescription('Exonera um usuário de suas funções.')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('O usuário a ser exonerado.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('qra')
                .setDescription('O QRA do usuário exonerado.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('id')
                .setDescription('O ID do usuário exonerado.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('motivo')
                .setDescription('O motivo da exoneração.')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('midia')
                .setDescription('Mídia (link de imagem/vídeo) relacionada à exoneração.')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false),
    async execute(interaction, client) {
        const { exonerarRole, exonerarChannel } = client.config
        if (!exonerarChannel || !exonerarRole) {
          await interaction.reply({ content: 'Erro de configuração: exonerarChannel ou exonerarRole não está definido no arquivo config.', ephemeral: true });
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
                await interaction.editReply({ content: 'User exonerated, but could not post the information due to a configuration error.', ephemeral: true });
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
            await interaction.editReply({ content: `User ${user.user.tag} has been exonerated.`, ephemeral: true });

        } catch (error) {
            console.error('Error exonerating user:', error);
            await interaction.editReply({ content: 'An error occurred while exonerating the user.', ephemeral: true });
        }
    },
};