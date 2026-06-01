# CMDVault 🔐

A beautiful CLI tool to store, search, and manage your favorite terminal commands.

## Features

- ✨ **Add Commands**: Store commands with descriptions and tags
- 📋 **List All**: View all your saved commands in a beautiful table
- 🔍 **Search**: Find commands by keyword in command, description, or tags
- 📋 **Copy**: Copy commands to clipboard instantly
- ⚡ **Execute**: Run commands directly from the vault
- 🏷️ **Tags**: Organize commands with custom tags
- 💾 **Local Storage**: All data stored in a local JSON file

## Installation

1. Clone or download this project
2. Install dependencies:

```bash
npm install
```

3. (Optional) Link globally to use `cmdvault` from anywhere:

```bash
npm link
```

## Usage

### Add a new command

```bash
# Interactive mode
cmdvault add

# With options
cmdvault add -c "git log --oneline --graph" -d "Pretty git log" -t "git,log"
```

### List all commands

```bash
# List all
cmdvault list

# List with tag filter
cmdvault list -t git
```

### Search commands

```bash
cmdvault search docker
```

### Copy command to clipboard

```bash
cmdvault copy <id>
```

### Execute a command

```bash
cmdvault exec <id>
```

### Delete a command

```bash
cmdvault delete <id>
```

## Examples

```bash
# Add a Docker command
cmdvault add -c "docker ps -a" -d "List all containers" -t "docker,containers"

# Add a Git command
cmdvault add -c "git reset --hard HEAD" -d "Reset to last commit" -t "git,reset"

# Search for Docker commands
cmdvault search docker

# List all Git-related commands
cmdvault list -t git

# Copy a command (use partial ID)
cmdvault copy abc123

# Execute a command
cmdvault exec abc123
```

## Aliases

- `list` → `ls`
- `search` → `find`
- `delete` → `rm`
- `copy` → `cp`
- `exec` → `run`

## Storage

Commands are stored in `commands.json` in the project directory. You can back up this file to save your commands.

## License

MIT
