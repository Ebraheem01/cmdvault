#!/usr/bin/env node

const { program } = require('commander');
const chalk = require('chalk');
const boxen = require('boxen');
const {
    addCommand,
    listCommands,
    searchCommands,
    deleteCommand,
    copyCommand,
    executeCommand,
    initializeStorage
} = require('./commands');

// Initialize storage on startup
initializeStorage();

// ASCII art banner
const banner = chalk.cyan.bold(`
  ╔═╗╔╦╗╔╦╗  ╦  ╦╔═╗╦ ╦╦  ╔╦╗
  ║  ║║║ ║║  ╚╗╔╝╠═╣║ ║║   ║ 
  ╚═╝╩ ╩═╩╝   ╚╝ ╩ ╩╚═╝╩═╝ ╩ 
`);

console.log(boxen(banner + '\n' + chalk.gray('Your Command Vault'), {
    padding: 1,
    margin: 1,
    borderStyle: 'round',
    borderColor: 'cyan'
}));

program
    .name('cmdvault')
    .description('A CLI tool to store, search, and manage your favorite terminal commands')
    .version('1.0.0');

// Add command
program
    .command('add')
    .description('Add a new command to the vault')
    .option('-c, --command <command>', 'The command to save')
    .option('-d, --description <description>', 'Description of the command')
    .option('-t, --tags <tags>', 'Comma-separated tags')
    .action(addCommand);

// List commands
program
    .command('list')
    .alias('ls')
    .description('List all commands in the vault')
    .option('-t, --tag <tag>', 'Filter by tag')
    .action(listCommands);

// Search commands
program
    .command('search <keyword>')
    .alias('find')
    .description('Search commands by keyword')
    .action(searchCommands);

// Delete command
program
    .command('delete <id>')
    .alias('rm')
    .description('Delete a command by ID')
    .action(deleteCommand);

// Copy command
program
    .command('copy <id>')
    .alias('cp')
    .description('Copy a command to clipboard by ID')
    .action(copyCommand);

// Execute command
program
    .command('exec <id>')
    .alias('run')
    .description('Execute a command by ID')
    .action(executeCommand);

program.parse(process.argv);

// Show help if no arguments provided
if (!process.argv.slice(2).length) {
    program.outputHelp();
}
