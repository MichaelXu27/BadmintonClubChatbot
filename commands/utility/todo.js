const {SlashCommandBuilder} = require('discord.js');

const todoLists = new Map();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('todo')
        .setDescription('Manage your to-do list')
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('add something to todo list')
                .addStringOption(option =>
                    option
                        .setName('item')
                        .setDescription('the item to add')
                        .setRequired(true)
                )
        )

        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('remove from todo list')
                .addIntegerOption(option =>
                    option
                        .setName('index')
                        .setDescription('index of item to delete')
                        .setRequired(true)
                )
        )

        .addSubcommand(subcommand =>
            subcommand
                .setName('list')
                .setDescription('list the items in todo list')
        ),

    async execute(interaction){
        const userId = interaction.user.id;

        if(todoLists.has(userId) == false){
            todoLists.set(userId, [])
        }

        const subcommand = interaction.options.getSubcommand();
        const todoList = todoLists.get(userId);

        if(subcommand == 'add'){
            const item = interaction.options.getString('item');
            todoList.push(item);
            await interaction.reply(`added "${item}" to your to-do list.`);
        }else if (subcommand == 'remove'){
            const index = interaction.options.getInteger('index') - 1;
            if (index < 0 || index  >= todoList.length){
                await interaction.reply('Invalid index. Please provide a valid item number.');
                return
            }else{
                const itemToRemove = todoList.splice(index, 1);
                await interaction.reply(`Removed "${itemToRemove}" from your to-do list.`);
            }
        }else if (subcommand == 'list'){
            if (todoList.length === 0) {
                await interaction.reply('Your to-do list is empty.');
            } else {
                const formattedList = todoList
                    .map((item, i) => `${i + 1}. ${item}`)
                    .join('\n');
                await interaction.reply(`Your to-do list:\n${formattedList}`);
            }
        }
    }
}