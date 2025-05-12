# BadmintonClubChatbot

me having fun with discordjs

## Overview

BadmintonClubChatbot is a Discord bot designed to enhance the experience of managing and interacting within a Discord server. It provides several utility commands to assist users and administrators.

### Features

- **To-Do List Management**: 
  - `/todo add <item>`: Add an item to your personal to-do list.
  - `/todo remove <index>`: Remove an item from your to-do list by its index.
  - `/todo list`: View all items in your to-do list.

- **Ping Command**: 
  - `/ping`: Replies with "Pong!" to check if the bot is responsive.

- **Server Information**: 
  - `/server`: Provides information about the server, including its name and member count.

- **User Information**: 
  - `/user`: Displays information about the user who invoked the command, such as their username and join date.

### Setup

1. Clone the repository.
2. Install dependencies using `npm install`.
3. Configure the bot by adding your `token`, `clientId`, and `guildId` in `config.json`.
4. Deploy the commands using `deploy-command.js`.
5. Start the bot with `node index.js`.

### Dependencies

- `discord.js`: For interacting with the Discord API.
- `@eslint/js` and `eslint`: For linting and maintaining code quality.

### Development

This bot is a fun project to explore the capabilities of Discord.js and experiment with creating interactive commands.
