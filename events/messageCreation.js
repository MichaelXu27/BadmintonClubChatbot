module.exports = {
    name: 'messageCreate',
    execute(message) {
        // Ignore bot messages
        if (message.author.bot) return;

        if (message.content.startsWith('!setname')) {
            const name = message.content.split(' ').slice(1).join(' ');
            
            if (name) {
                // Check bot permissions first
                const botMember = message.guild.members.cache.get(message.client.user.id);
                const hasPermission = botMember.permissions.has('ManageNicknames');
                
                // console.log(`Bot has ManageNicknames permission: ${hasPermission}`);
                // console.log(`Bot's highest role position: ${botMember.roles.highest.position}`);
                // console.log(`User's highest role position: ${message.member.roles.highest.position}`);
                // console.log(`Target user ID: ${message.member.id}`);
                // console.log(`Bot ID: ${message.client.user.id}`);
                // console.log(`Is user server owner: ${message.member.id === message.guild.ownerId}`);
                // console.log(`Bot roles: ${botMember.roles.cache.map(r => r.name).join(', ')}`);
                // console.log(`User roles: ${message.member.roles.cache.map(r => r.name).join(', ')}`);
                
                if (!hasPermission) {
                    return message.reply("❌ I don't have the 'Manage Nicknames' permission. Please ask an admin to give me this permission.");
                }
                
                if (message.member.id === message.guild.ownerId) {
                    return message.reply("❌ I cannot change the server owner's nickname.");
                }
                
                if (botMember.roles.highest.position <= message.member.roles.highest.position) {
                    return message.reply("❌ I can't change your nickname because your role is equal to or higher than mine. Please ask an admin to move my role higher.");
                }
                
                message.member.setNickname(name)
                    .then(async () => {
                        // Remove Unverified role and add Verified role
                        const unverifiedRole = message.guild.roles.cache.find(role => role.name === 'Unverified');
                        const verifiedRole = message.guild.roles.cache.find(role => role.name === 'Verified');
                        
                        try {
                            if (unverifiedRole && message.member.roles.cache.has(unverifiedRole.id)) {
                                await message.member.roles.remove(unverifiedRole);
                            }
                            
                            if (verifiedRole) {
                                await message.member.roles.add(verifiedRole);
                            }
                            
                            message.reply(`Your name has been set to **${name}** ✅ Welcome to the server!`);
                        } catch (roleError) {
                            console.error('Error managing roles:', roleError);
                            message.reply(`Your name has been set to **${name}** ✅ (Note: There was an issue with role assignment)`);
                        }
                    })
                    .catch(err => {
                        console.error(err);
                        if (err.code === 50013) {
                            message.reply("❌ I don't have permission to change your nickname. This might be a role hierarchy issue.");
                        } else {
                            message.reply("❌ An error occurred while trying to change your nickname.");
                        }
                    });
            } else {
                message.reply("Please provide a name! Usage: `!setname <your name>`");
            }
        }
    },
};