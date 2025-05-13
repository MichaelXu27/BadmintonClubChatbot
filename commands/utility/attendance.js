// const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, ComponentType, MessageFlags } = require('discord.js');

// const attendance = new Map(); // Map to track attendance: { userId: 'checked-in' or 'checked-out' }

// module.exports = {
//     data: new SlashCommandBuilder()
//         .setName('attendance')
//         .setDescription('Track attendance')
//         .addSubcommand(subcommand =>
//             subcommand
//                 .setName('checkin')
//                 .setDescription('Check in users')
//         )
//         .addSubcommand(subcommand =>
//             subcommand
//                 .setName('checkout')
//                 .setDescription('Check out users')
//         ),

//     async execute(interaction) {
//         try {
//             const subcommand = interaction.options.getSubcommand();

//             // Create a user select menu
//             const userSelectMenu = new StringSelectMenuBuilder()
//                 .setCustomId(`attendance-${subcommand}`)
//                 .setPlaceholder('Select users')
//                 .setMinValues(1)
//                 .setMaxValues(10); // Adjust max values as needed

//             // Populate the menu with users from the guild
//             const members = await interaction.guild.members.fetch();
//             members.forEach(member => {
//                 const username = member.user.username;
//                 const userId = member.user.id;

//                 // Ensure label is at least 10 characters long
//                 const paddedLabel = username.length < 10 ? `${username}#${member.user.discriminator}` : username;

//                 userSelectMenu.addOptions({
//                     label: paddedLabel, // Use padded label
//                     value: userId, // User ID is always valid
//                 });
//             });

//             const actionRow = new ActionRowBuilder().addComponents(userSelectMenu);

//             // Send the menu to the user
//             await interaction.reply({
//                 content: `Select users to ${subcommand === 'checkin' ? 'check in' : 'check out'}:`,
//                 components: [actionRow],
//                 flags: MessageFlags.Ephemeral, // Use flags instead of ephemeral
//             });
//         } catch (error) {
//             console.error(error);
//             await interaction.reply({
//                 content: 'An error occurred while processing the command.',
//                 flags: MessageFlags.Ephemeral,
//             });
//         }
//     },

//     async handleComponentInteraction(interaction) {
//         try {
//             if (!interaction.isStringSelectMenu()) return;

//             const customId = interaction.customId;
//             if (!customId.startsWith('attendance-')) return;

//             const subcommand = customId.split('-')[1];
//             const selectedUserIds = interaction.values;

//             let responseMessage = '';

//             if (subcommand === 'checkin') {
//                 selectedUserIds.forEach(userId => {
//                     attendance.set(userId, 'checked-in');
//                 });
//                 responseMessage = `Checked in: ${selectedUserIds.map(id => `<@${id}>`).join(', ')}`;
//             } else if (subcommand === 'checkout') {
//                 selectedUserIds.forEach(userId => {
//                     attendance.set(userId, 'checked-out');
//                 });
//                 responseMessage = `Checked out: ${selectedUserIds.map(id => `<@${id}>`).join(', ')}`;
//             }

//             await interaction.update({
//                 content: responseMessage,
//                 components: [], // Remove the menu after selection
//             });
//         } catch (error) {
//             console.error(error);
//             await interaction.update({
//                 content: 'An error occurred while processing your selection.',
//                 components: [],
//             });
//         }
//     },
// };

const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, ComponentType, MessageFlags } = require('discord.js');

const attendance = new Map(); // Map to track attendance: { userId: 'checked-in' or 'checked-out' }

module.exports = {
    data: new SlashCommandBuilder()
        .setName('attendance')
        .setDescription('Track attendance')
        .addSubcommand(subcommand =>
            subcommand
                .setName('checkin')
                .setDescription('Check in users')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('checkout')
                .setDescription('Check out users')
        ),

    async execute(interaction) {
        try {
            const subcommand = interaction.options.getSubcommand();

            // Create a user select menu
            const userSelectMenu = new StringSelectMenuBuilder()
                .setCustomId(`attendance-${subcommand}`)
                .setPlaceholder('Select users')
                .setMinValues(1)
                .setMaxValues(10); // Adjust max values as needed

            // Populate the menu with users from the guild
            const members = await interaction.guild.members.fetch();
            
            // Filter out bots and track valid options
            let validOptionsCount = 0;
            
            members.forEach(member => {
                if (member.user.bot) return; // Skip bots
                
                const username = member.user.username || 'Unknown User';
                const userId = member.user.id;
                
                // Ensure label is at least 10 characters long by padding with spaces if needed
                let paddedLabel;
                
                if (username.length >= 10) {
                    paddedLabel = username;
                } else {
                    // Add "User: " prefix to short usernames to ensure 10+ characters
                    paddedLabel = `User: ${username}`;
                    
                    // If still too short, pad with spaces
                    if (paddedLabel.length < 10) {
                        paddedLabel = paddedLabel.padEnd(10, '_');
                    }
                }
                
                userSelectMenu.addOptions({
                    label: paddedLabel,
                    value: userId,
                });
                
                validOptionsCount++;
            });
            
            if (validOptionsCount === 0) {
                await interaction.reply({
                    content: "No users found to select.",
                    flags: MessageFlags.Ephemeral
                });
                return;
            }

            const actionRow = new ActionRowBuilder().addComponents(userSelectMenu);

            // Send the menu to the user
            await interaction.reply({
                content: `Select users to ${subcommand === 'checkin' ? 'check in' : 'check out'}:`,
                components: [actionRow],
                flags: MessageFlags.Ephemeral, 
            });
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: `An error occurred: ${error.message}`,
                flags: MessageFlags.Ephemeral,
            });
        }
    },

    async handleComponentInteraction(interaction) {
        try {
            if (!interaction.isStringSelectMenu()) return;

            const customId = interaction.customId;
            if (!customId.startsWith('attendance-')) return;

            const subcommand = customId.split('-')[1];
            const selectedUserIds = interaction.values;

            let responseMessage = '';

            if (subcommand === 'checkin') {
                selectedUserIds.forEach(userId => {
                    attendance.set(userId, 'checked-in');
                });
                responseMessage = `Checked in: ${selectedUserIds.map(id => `<@${id}>`).join(', ')}`;
            } else if (subcommand === 'checkout') {
                selectedUserIds.forEach(userId => {
                    attendance.set(userId, 'checked-out');
                });
                responseMessage = `Checked out: ${selectedUserIds.map(id => `<@${id}>`).join(', ')}`;
            }

            await interaction.update({
                content: responseMessage,
                components: [], // Remove the menu after selection
            });
        } catch (error) {
            console.error(error);
            await interaction.update({
                content: 'An error occurred while processing your selection.',
                components: [],
            });
        }
    },
};