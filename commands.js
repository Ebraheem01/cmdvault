const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');
const clipboardy = require('clipboardy');
const ora = require('ora');
const { table } = require('table');
const { exec } = require('child_process');

const STORAGE_FILE = path.join(__dirname, 'commands.json');

// Initialize storage file
function initializeStorage() {
    if (!fs.existsSync(STORAGE_FILE)) {
        fs.writeFileSync(STORAGE_FILE, JSON.stringify({ commands: [] }, null, 2));
    }
}

// Read commands from storage
function readCommands() {
    try {
        const data = fs.readFileSync(STORAGE_FILE, 'utf8');
        return JSON.parse(data).commands;
    } catch (error) {
        console.error(chalk.red('Error reading commands:'), error.message);
        return [];
    }
}

// Write commands to storage
function writeCommands(commands) {
    try {
        fs.writeFileSync(STORAGE_FILE, JSON.stringify({ commands }, null, 2));
        return true;
    } catch (error) {
        console.error(chalk.red('Error writing commands:'), error.message);
        return false;
    }
}

// Generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Add command
async function addCommand(options) {
    let command = options.command;
    let description = options.description;
    let tags = options.tags;

    // Interactive mode if options not provided
    if (!command || !description) {
        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'command',
                message: 'Enter the command:',
                default: command,
                validate: (input) => input.trim() !== '' || 'Command cannot be empty'
            },
            {
                type: 'input',
                name: 'description',
                message: 'Enter a description:',
                default: description,
                validate: (input) => input.trim() !== '' || 'Description cannot be empty'
            },
            {
                type: 'input',
                name: 'tags',
                message: 'Enter tags (comma-separated):',
                default: tags || ''
            }
        ]);

        command = answers.command;
        description = answers.description;
        tags = answers.tags;
    }

    const spinner = ora('Adding command...').start();

    const commands = readCommands();
    const newCommand = {
        id: generateId(),
        command: command.trim(),
        description: description.trim(),
        tags: tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
        createdAt: new Date().toISOString()
    };

    commands.push(newCommand);

    if (writeCommands(commands)) {
        spinner.succeed(chalk.green('Command added successfully!'));
        console.log(chalk.gray('\nDetails:'));
        console.log(chalk.cyan('ID:'), newCommand.id);
        console.log(chalk.cyan('Command:'), chalk.yellow(newCommand.command));
        console.log(chalk.cyan('Description:'), newCommand.description);
        console.log(chalk.cyan('Tags:'), newCommand.tags.join(', ') || 'None');
    } else {
        spinner.fail(chalk.red('Failed to add command'));
    }
}

// List commands
function listCommands(options) {
    const commands = readCommands();

    if (commands.length === 0) {
        console.log(chalk.yellow('\n⚠ No commands found. Add your first command with: cmdvault add\n'));
        return;
    }

    let filteredCommands = commands;

    // Filter by tag if specified
    if (options.tag) {
        filteredCommands = commands.filter(cmd =>
            cmd.tags.some(tag => tag.toLowerCase().includes(options.tag.toLowerCase()))
        );

        if (filteredCommands.length === 0) {
            console.log(chalk.yellow(`\n⚠ No commands found with tag: ${options.tag}\n`));
            return;
        }
    }

    // Prepare table data
    const data = [
        [
            chalk.bold.cyan('ID'),
            chalk.bold.cyan('Command'),
            chalk.bold.cyan('Description'),
            chalk.bold.cyan('Tags')
        ]
    ];

    filteredCommands.forEach(cmd => {
        data.push([
            chalk.gray(cmd.id.substring(0, 8) + '...'),
            chalk.yellow(cmd.command.length > 40 ? cmd.command.substring(0, 37) + '...' : cmd.command),
            cmd.description.length > 30 ? cmd.description.substring(0, 27) + '...' : cmd.description,
            chalk.magenta(cmd.tags.join(', ') || '-')
        ]);
    });

    const config = {
        border: {
            topBody: '─',
            topJoin: '┬',
            topLeft: '┌',
            topRight: '┐',
            bottomBody: '─',
            bottomJoin: '┴',
            bottomLeft: '└',
            bottomRight: '┘',
            bodyLeft: '│',
            bodyRight: '│',
            bodyJoin: '│',
            joinBody: '─',
            joinLeft: '├',
            joinRight: '┤',
            joinJoin: '┼'
        }
    };

    console.log('\n' + table(data, config));
    console.log(chalk.gray(`Total: ${filteredCommands.length} command(s)\n`));
}

// Search commands
function searchCommands(keyword) {
    const commands = readCommands();

    if (commands.length === 0) {
        console.log(chalk.yellow('\n⚠ No commands found. Add your first command with: cmdvault add\n'));
        return;
    }

    const searchTerm = keyword.toLowerCase();
    const results = commands.filter(cmd =>
        cmd.command.toLowerCase().includes(searchTerm) ||
        cmd.description.toLowerCase().includes(searchTerm) ||
        cmd.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );

    if (results.length === 0) {
        console.log(chalk.yellow(`\n⚠ No commands found matching: "${keyword}"\n`));
        return;
    }

    console.log(chalk.green(`\n✓ Found ${results.length} matching command(s):\n`));

    results.forEach((cmd, index) => {
        console.log(chalk.cyan(`[${index + 1}] ${cmd.id.substring(0, 8)}...`));
        console.log(chalk.yellow(`    Command: ${cmd.command}`));
        console.log(chalk.gray(`    Description: ${cmd.description}`));
        console.log(chalk.magenta(`    Tags: ${cmd.tags.join(', ') || 'None'}`));
        console.log();
    });
}

// Delete command
async function deleteCommand(id) {
    const commands = readCommands();
    const index = commands.findIndex(cmd => cmd.id.startsWith(id));

    if (index === -1) {
        console.log(chalk.red(`\n✗ Command with ID "${id}" not found\n`));
        return;
    }

    const command = commands[index];

    // Confirm deletion
    const { confirm } = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'confirm',
            message: `Are you sure you want to delete: "${command.command}"?`,
            default: false
        }
    ]);

    if (!confirm) {
        console.log(chalk.yellow('\nDeletion cancelled\n'));
        return;
    }

    const spinner = ora('Deleting command...').start();
    commands.splice(index, 1);

    if (writeCommands(commands)) {
        spinner.succeed(chalk.green('Command deleted successfully!'));
    } else {
        spinner.fail(chalk.red('Failed to delete command'));
    }
}

// Copy command to clipboard
function copyCommand(id) {
    const commands = readCommands();
    const command = commands.find(cmd => cmd.id.startsWith(id));

    if (!command) {
        console.log(chalk.red(`\n✗ Command with ID "${id}" not found\n`));
        return;
    }

    const spinner = ora('Copying to clipboard...').start();

    try {
        clipboardy.writeSync(command.command);
        spinner.succeed(chalk.green('Command copied to clipboard!'));
        console.log(chalk.yellow(`\n${command.command}\n`));
    } catch (error) {
        spinner.fail(chalk.red('Failed to copy to clipboard'));
        console.error(error.message);
    }
}

// Execute command
async function executeCommand(id) {
    const commands = readCommands();
    const command = commands.find(cmd => cmd.id.startsWith(id));

    if (!command) {
        console.log(chalk.red(`\n✗ Command with ID "${id}" not found\n`));
        return;
    }

    // Confirm execution
    const { confirm } = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'confirm',
            message: `Execute: "${chalk.yellow(command.command)}"?`,
            default: false
        }
    ]);

    if (!confirm) {
        console.log(chalk.yellow('\nExecution cancelled\n'));
        return;
    }

    console.log(chalk.cyan('\n⚡ Executing command...\n'));

    exec(command.command, (error, stdout, stderr) => {
        if (error) {
            console.error(chalk.red(`Error: ${error.message}`));
            return;
        }
        if (stderr) {
            console.error(chalk.yellow(`Warning: ${stderr}`));
        }
        if (stdout) {
            console.log(stdout);
        }
        console.log(chalk.green('\n✓ Command executed successfully\n'));
    });
}

module.exports = {
    addCommand,
    listCommands,
    searchCommands,
    deleteCommand,
    copyCommand,
    executeCommand,
    initializeStorage
};
