/**
 * AI Command Interface for Browser Automation
 * This script allows executing browser commands via simple JSON interface
 */

const BrowserHelper = require('./browser-helper');
const fs = require('fs');

class BrowserCommander {
  constructor() {
    this.browser = null;
    this.sessionFile = '/home/gratheon/browser-automation/session.json';
  }

  async init() {
    this.browser = new BrowserHelper({
      headless: false,
      slowMo: 100
    });
    await this.browser.launch();
    this.saveSession();
    return this;
  }

  saveSession() {
    const session = {
      profilePath: this.browser.options.profilePath,
      timestamp: new Date().toISOString(),
      active: true
    };
    fs.writeFileSync(this.sessionFile, JSON.stringify(session, null, 2));
  }

  async loadSession() {
    if (fs.existsSync(this.sessionFile)) {
      return JSON.parse(fs.readFileSync(this.sessionFile, 'utf8'));
    }
    return null;
  }

  /**
   * Execute command from JSON
   * Example: { "action": "goto", "params": { "url": "https://example.com" } }
   */
  async executeCommand(command) {
    const { action, params } = command;
    const result = { action, success: false, data: null, error: null };

    try {
      switch (action) {
        case 'goto':
          await this.browser.goto(params.url);
          result.data = { url: await this.browser.getUrl() };
          break;

        case 'getTitle':
          result.data = await this.browser.getTitle();
          break;

        case 'getUrl':
          result.data = await this.browser.getUrl();
          break;

        case 'click':
          await this.browser.click(params.selector);
          result.data = { clicked: params.selector };
          break;

        case 'type':
          await this.browser.type(params.selector, params.text);
          result.data = { typed: params.text };
          break;

        case 'screenshot':
          const filepath = params.filepath || '/home/gratheon/browser-automation/screenshot.png';
          await this.browser.screenshot(filepath);
          result.data = { filepath };
          break;

        case 'getText':
          result.data = await this.browser.getText(params.selector);
          break;

        case 'getPageText':
          result.data = await this.browser.getPageText();
          break;

        case 'getCookies':
          result.data = await this.browser.getCookies();
          break;

        case 'getLocalStorage':
          result.data = await this.browser.getLocalStorage();
          break;

        case 'evaluate':
          result.data = await this.browser.evaluate(params.script);
          break;

        case 'waitForSelector':
          await this.browser.waitForSelector(params.selector, params.timeout);
          result.data = { found: params.selector };
          break;

        case 'newPage':
          await this.browser.newPage();
          result.data = { pagesCount: this.browser.getPages().length };
          break;

        case 'getHistory':
          result.data = await this.browser.getHistory();
          break;

        default:
          throw new Error(`Unknown action: ${action}`);
      }

      result.success = true;
    } catch (error) {
      result.error = error.message;
    }

    return result;
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      const session = await this.loadSession();
      if (session) {
        session.active = false;
        fs.writeFileSync(this.sessionFile, JSON.stringify(session, null, 2));
      }
    }
  }
}

// CLI interface
if (require.main === module) {
  const commander = new BrowserCommander();
  
  (async () => {
    await commander.init();
    console.log('Browser Commander initialized!');
    console.log('Session saved to:', commander.sessionFile);
    console.log('\nExample commands:');
    console.log('  node browser-automation/commander.js \'{"action":"goto","params":{"url":"https://google.com"}}\'');
    console.log('  node browser-automation/commander.js \'{"action":"getTitle"}\'');
    console.log('  node browser-automation/commander.js \'{"action":"screenshot"}\'');
    
    // Process command if provided as argument
    if (process.argv[2]) {
      try {
        const command = JSON.parse(process.argv[2]);
        const result = await commander.executeCommand(command);
        console.log('\nResult:', JSON.stringify(result, null, 2));
      } catch (error) {
        console.error('Error executing command:', error.message);
      }
    } else {
      // Keep browser open for interactive use
      console.log('\nBrowser is running. Press Ctrl+C to close.');
    }
  })();
}

module.exports = BrowserCommander;
