module.exports = {
    name: 'guildMemberAdd',
    execute(member) {
        // Find a welcome channel (adjust channel name as needed)
        const channel = member.guild.channels.cache.find(ch => ch.name === 'welcome' || ch.name === 'general');
        
        if (channel) {
            channel.send(`Welcome ${member.user}! Please type \`!setname <your name>\` to set your server nickname.`);
        }
    },
};