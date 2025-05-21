const {SlashCommandBuilder} = require('discord.js');
const {MongoClient} = require('mongodb');
const { uri } = require('../../config.json');

//create the mongo client
const client = new MongoClient(uri);

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
        const subcommand = interaction.options.getSubcommand();

        try {
            await client.connect();
            const db = client.db('todoApp');
            const todosCollection = db.collection('todos');

            if (subcommand === 'add') {
                const item = interaction.options.getString('item');
                
                // update document: push new item; create document if it doesn't exist
                await todosCollection.updateOne(
                    { userId },
                    { $push: { todos: item } },
                    { upsert: true }
                );
                await interaction.reply(`Added "${item}" to your to-do list.`);
            } else if (subcommand === 'remove') {
                const index = interaction.options.getInteger('index') - 1;
                const userDoc = await todosCollection.findOne({ userId });
                
                if (!userDoc || !userDoc.todos || index < 0 || index >= userDoc.todos.length) {
                    await interaction.reply('Invalid index. Please provide a valid item number.');
                    return;
                }
                
                // remove the item from the array
                const removedItem = userDoc.todos[index];
                userDoc.todos.splice(index, 1);
                await todosCollection.updateOne(
                    { userId },
                    { $set: { todos: userDoc.todos } }
                );
                await interaction.reply(`Removed "${removedItem}" from your to-do list.`);
            } else if (subcommand === 'list') {
                const userDoc = await todosCollection.findOne({ userId });
                if (!userDoc || !userDoc.todos || userDoc.todos.length === 0) {
                    await interaction.reply('Your to-do list is empty.');
                } else {
                    const formattedList = userDoc.todos
                        .map((item, i) => `${i + 1}. ${item}`)
                        .join('\n');
                    await interaction.reply(`Your to-do list:\n${formattedList}`);
                }
            }
        } catch (error) {
            console.error(error);
            await interaction.reply(`An error occurred: ${error.message}`);
        }
    }
}