const BlacklistManager = require('../utils/blacklistManager');

module.exports = {
    name: 'guildMemberAdd',
    async execute(member, client) {
        const blacklistManager = new BlacklistManager();
        const blacklistRole = client.config.blacklistRole;

        if (blacklistManager.isBlacklisted(member.id)) {
            const role = member.guild.roles.cache.get(blacklistRole);
            if (role) {
                await member.roles.add(role);
                console.log(`Added blacklist role to ${member.user.tag} (ID: ${member.id})`);
            } else {
                console.error(`Blacklist role not found with ID: ${blacklistRole}`);
            }
        }
    },
};