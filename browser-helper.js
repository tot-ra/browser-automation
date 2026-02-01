/**
 * Browser Helper - Playwright wrapper for AI automation
 * Provides persistent Firefox session with profile support
 */

const { firefox } = require('playwright');
const fs = require('fs');
const path = require('path');
const os = require('os');

class BrowserHelper {
  constructor(options = {}) {
    this.options = {
      headless: options.headless || false,
      profilePath: options.profilePath || this.getDefaultProfilePath(),
      slowMo: options.slowMo || 100, // Slow down operations for visibility
      ...options
    };
    this.browser = null;
    this.context = null;
    this.page = null;
  }

  /**
   * Get default Firefox profile path based on OS
   */
  getDefaultProfilePath() {
    const homeDir = os.homedir();
    let basePath;
    
    if (process.platform === 'darwin') {
      basePath = path.join(homeDir, 'Library/Application Support/Firefox/Profiles');
    } else if (process.platform === 'win32') {
      basePath = path.join(homeDir, 'AppData/Roaming/Mozilla/Firefox/Profiles');
    } else {
      basePath = path.join(homeDir, '.mozilla/firefox');
    }

    // Create profile directory if it doesn't exist
    const profileDir = path.join(basePath, 'ai-automation-profile');
    if (!fs.existsSync(profileDir)) {
      fs.mkdirSync(profileDir, { recursive: true });
      console.log(`Created new Firefox profile at: ${profileDir}`);
    }

    return profileDir;
  }

  /**
   * Launch browser with persistent profile
   */
  async launch() {
    // Set DISPLAY for VNC
    if (!process.env.DISPLAY) {
      process.env.DISPLAY = ':1';
    }
    
    console.log('Launching Firefox...');
    console.log('Profile path:', this.options.profilePath);
    console.log('Headless mode:', this.options.headless);
    console.log('DISPLAY:', process.env.DISPLAY);

    this.browser = await firefox.launchPersistentContext(this.options.profilePath, {
      headless: this.options.headless,
      slowMo: this.options.slowMo,
      viewport: { width: 1280, height: 720 },
      acceptDownloads: true,
      // Firefox specific options
      firefoxUserPrefs: {
        'privacy.trackingprotection.enabled': false,
        'dom.webdriver.enabled': false,
        'useAutomationExtension': false
      },
      env: {
        ...process.env,
        DISPLAY: process.env.DISPLAY
      }
    });

    // Get the first page or create new one
    const pages = this.browser.pages();
    this.page = pages.length > 0 ? pages[0] : await this.browser.newPage();

    console.log('Browser launched successfully!');
    return this;
  }

  /**
   * Navigate to URL
   */
  async goto(url) {
    if (!this.page) {
      throw new Error('Browser not launched. Call launch() first.');
    }
    console.log(`Navigating to: ${url}`);
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
    return this;
  }

  /**
   * Get current page title
   */
  async getTitle() {
    return await this.page.title();
  }

  /**
   * Get current URL
   */
  async getUrl() {
    return this.page.url();
  }

  /**
   * Take screenshot
   */
  async screenshot(filepath) {
    await this.page.screenshot({ path: filepath, fullPage: true });
    console.log(`Screenshot saved to: ${filepath}`);
    return filepath;
  }

  /**
   * Get cookies
   */
  async getCookies() {
    return await this.browser.cookies();
  }

  /**
   * Get local storage
   */
  async getLocalStorage() {
    return await this.page.evaluate(() => {
      return JSON.stringify(localStorage);
    });
  }

  /**
   * Execute JavaScript in page
   */
  async evaluate(script) {
    return await this.page.evaluate(script);
  }

  /**
   * Click element
   */
  async click(selector) {
    await this.page.click(selector);
    return this;
  }

  /**
   * Type text
   */
  async type(selector, text) {
    await this.page.fill(selector, text);
    return this;
  }

  /**
   * Wait for selector
   */
  async waitForSelector(selector, timeout = 30000) {
    await this.page.waitForSelector(selector, { timeout });
    return this;
  }

  /**
   * Get page content
   */
  async getContent() {
    return await this.page.content();
  }

  /**
   * Get text content
   */
  async getText(selector) {
    return await this.page.textContent(selector);
  }

  /**
   * Get all text from page
   */
  async getPageText() {
    return await this.page.evaluate(() => document.body.innerText);
  }

  /**
   * Wait for navigation
   */
  async waitForNavigation() {
    await this.page.waitForLoadState('domcontentloaded');
    return this;
  }

  /**
   * Get saved passwords (requires Firefox profile with saved passwords)
   */
  async getSavedCredentials() {
    // Note: This is a simplified version. Actual password extraction
    // requires accessing Firefox's logins.json with master password
    const loginData = path.join(this.options.profilePath, 'logins.json');
    if (fs.existsSync(loginData)) {
      return fs.readFileSync(loginData, 'utf8');
    }
    return null;
  }

  /**
   * Get browser history
   */
  async getHistory() {
    // Access places.sqlite for history
    const historyDb = path.join(this.options.profilePath, 'places.sqlite');
    if (fs.existsSync(historyDb)) {
      console.log('History database found at:', historyDb);
      return historyDb;
    }
    return null;
  }

  /**
   * Close browser
   */
  async close() {
    if (this.browser) {
      await this.browser.close();
      console.log('Browser closed');
    }
  }

  /**
   * Create new page/tab
   */
  async newPage() {
    this.page = await this.browser.newPage();
    return this.page;
  }

  /**
   * Get all pages
   */
  getPages() {
    return this.browser.pages();
  }
}

module.exports = BrowserHelper;
