const {SlashCommandBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('listusers')
        .setDescription('Lists all the users in the guild'),
    
    async execute(interaction){
        const allMembers = await interaction.guild.members.fetch();

        const userList = allMembers
            .map(member =>`${member.nickname|| member.user.username}`).join('\n');

        await interaction.reply({
            content: `Here are the users in this guild:\n${userList}`,
        
        });
    }
}