const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const UserManager = require('../utils/userManager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ranking')
        .setDescription('Mostra o ranking de usuários.')
        .addStringOption(option =>
            option.setName('tipo')
                .setDescription('Tipo de ranking')
                .setRequired(true)
                .addChoices(
                    { name: 'Total', value: 'total' },
                    { name: 'Mensal', value: 'monthly' }
                )
        ),
    async execute(interaction, client) {
        try{
            const userManager = new UserManager();
            const rankingType = interaction.options.getString('type');
            const users = userManager.users

            let sortedUsers;

            if (rankingType === 'total') {
                 sortedUsers = Object.entries(users)
                    .sort(([, a], [, b]) => {
                        const totalA = Object.values(a).reduce((sum, value) => sum + value, 0);
                        const totalB = Object.values(b).reduce((sum, value) => sum + value, 0);
                        return totalB - totalA;
                    })
            } else if (rankingType === 'monthly') {
                 sortedUsers = Object.entries(users)
                    .filter(([, user]) => user.hasOwnProperty('monthly'))
                    .sort(([, a], [, b]) => {
                        const totalA = Object.values(a.monthly).reduce((sum, value) => sum + value, 0);
                        const totalB = Object.values(b.monthly).reduce((sum, value) => sum + value, 0);
                        return totalB - totalA;
                    })
            } else{
                await interaction.reply({ content: 'Invalid ranking type.', ephemeral: true });
                return;
            }


            if (sortedUsers.length === 0) {
                await interaction.reply({ content: 'No users found in the ranking.', ephemeral: true });
                return;
            }

            const embed = new EmbedBuilder()
                .setTitle(`${rankingType.charAt(0).toUpperCase() + rankingType.slice(1)} Ranking`)
                .setColor('#0099ff')
                .setTimestamp();

            for (let i = 0; i < sortedUsers.length; i++) {
                 const [userId, userData] = sortedUsers[i]
                 const user = await client.users.fetch(userId)
                if (rankingType === 'total'){
                const total = Object.values(userData).reduce((sum, value) => sum + value, 0)
                 embed.addFields({name:`${i + 1}º - ${user.tag}`, value: `Total: ${total}`})
                }else if(rankingType === 'monthly'){
                    const total = Object.values(userData.monthly).reduce((sum, value) => sum + value, 0)
                    embed.addFields({name:`${i + 1}º - ${user.tag}`, value: `Monthly: ${total}`})
                }

            }
            await interaction.reply({ embeds: [embed] });
        }catch(error){
            await interaction.reply({ content: 'An error occurred while showing the ranking.', ephemeral: true });
        }

    },
};