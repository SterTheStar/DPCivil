module.exports = {
    name: 'guildCreate',
    once: false,
    async execute(guild) {
        const types = ['Recrutamentos', 'Prisões'];
        guild.commands.set([
            {
                name: 'solicitar',
                description: 'Request something.',
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
            }
        ]);
    },
};