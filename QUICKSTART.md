# Quick Start Guide

## Installation

```bash
npm install
```

## Make it globally available (Optional)

```bash
npm link
```

After linking, you can use `cmdvault` from anywhere in your terminal!

## Quick Examples

```bash
# Add a command (interactive)
cmdvault add

# Add a command (with flags)
cmdvault add -c "git log --oneline" -d "Show compact git log" -t "git,log"

# List all commands
cmdvault list

# List commands by tag
cmdvault list -t docker

# Search for commands
cmdvault search git

# Copy a command to clipboard (use first few chars of ID)
cmdvault copy mhbp

# Execute a command
cmdvault exec mhbp

# Delete a command
cmdvault delete mhbp
```

## Available Aliases

- `cmdvault ls` = `cmdvault list`
- `cmdvault find` = `cmdvault search`
- `cmdvault rm` = `cmdvault delete`
- `cmdvault cp` = `cmdvault copy`
- `cmdvault run` = `cmdvault exec`

## Features Demonstration

### Beautiful Table View

When you run `cmdvault list`, you'll see a nicely formatted table with all your commands.

### Smart Search

Search works across commands, descriptions, and tags!

### Clipboard Integration

Copy any command instantly with just the first few characters of its ID.

### Tag Organization

Use tags to organize related commands and filter them easily.

### Safe Execution

Commands require confirmation before execution to prevent accidents.

## Storage Location

All commands are stored in `commands.json` in the project directory.
Back this file up to preserve your command vault!

## Tips

1. Use short, memorable tags for easy filtering
2. Add detailed descriptions to find commands later
3. You only need the first few characters of an ID to copy/delete/execute
4. Use the interactive mode (`cmdvault add`) if you prefer prompts

Enjoy your Command Vault! 🔐
