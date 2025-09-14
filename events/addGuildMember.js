module.exports = {
    name: 'guildMemberAdd',
    async execute(member) {
        // Assign Unverified role to new members
        const unverifiedRole = member.guild.roles.cache.find(role => role.name === 'Unverified');
        
        if (unverifiedRole) {
            try {
                await member.roles.add(unverifiedRole);
                console.log(`Assigned Unverified role to ${member.user.tag}`);
            } catch (error) {
                console.error(`Failed to assign Unverified role to ${member.user.tag}:`, error);
            }
        } else {
            console.warn('Unverified role not found! Please create an "Unverified" role.');
        }
        
        // Find a welcome channel (adjust channel name as needed)
        const channel = member.guild.channels.cache.find(ch => ch.name === 'welcome');
        
        if (channel) {
            channel.send(`Welcome ${member.user}! Please type \`!setname <your name>\` to set your server nickname and gain access to the server.`);
        }
    },
};