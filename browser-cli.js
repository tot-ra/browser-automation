#!/usr/bin/env node
/**
 * Browser CLI - Command line interface for browser automation
 * Usage: ./browser-cli.js <command> [args...]
 */

const BrowserCommander = require('./commander');
const fs = require('fs');
const path = require('path');

const commands = {
  async start() {
    console.log('Starting browser session...');
    const commander = new BrowserCommander();
    await commander.init();
    console.log('✓ Browser started and ready!');
    console.log('Profile:', commander.browser.options.profilePath);
    return commander;
  },

  async goto(url) {
    const commander = new BrowserCommander();
    await commander.init();
    const result = await commander.executeCommand({
      action: 'goto',
      params: { url }
    });
    console.log('✓ Navigated to:', url);
    console.log('Current URL:', result.data.url);
    // Keep browser open
    console.log('\nBrowser is open. Press Ctrl+C to close.');
    return commander;
  },

  async screenshot(filepath) {
    filepath = filepath || `/home/gratheon/browser-automation/screenshot-${Date.now()}.png`;
    const commander = new BrowserCommander();
    await commander.init();
    const result = await commander.executeCommand({
      action: 'screenshot',
      params: { filepath }
    });
    console.log('✓ Screenshot saved:', result.data.filepath);
    await commander.close();
  },

  async run(commandJson) {
    const commander = new BrowserCommander();
    await commander.init();
    const command = JSON.parse(commandJson);
    const result = await commander.executeCommand(command);
    console.log('Result:', JSON.stringify(result, null, 2));
    return commander;
  },

  help() {
    console.log(`
Browser CLI - AI Browser Automation Tool

Usage:
  ./browser-cli.js <command> [args...]

Commands:
  start                   Start browser in interactive mode
  goto <url>             Navigate to URL and keep browser open
  screenshot [filepath]   Take screenshot and save it
  run '<json>'           Execute command from JSON

  help                   Show this help message

Examples:
  ./browser-cli.js start
  ./browser-cli.js goto https://google.com
  ./browser-cli.js screenshot /tmp/page.png
  ./browser-cli.js run '{"action":"getTitle"}'

For programmatic usage, use the BrowserHelper or BrowserCommander classes directly.
    `);
  }
};

// Main CLI handler
(async () => {
  const [,, command, ...args] = process.argv;

  if (!command || command === 'help' || command === '--help' || command === '-h') {
    commands.help();
    process.exit(0);
  }

  if (!commands[command]) {
    console.error(`Unknown command: ${command}`);
    console.error('Run "./browser-cli.js help" for usage information');
    process.exit(1);
  }

  try {
    await commands[command](...args);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
})();
