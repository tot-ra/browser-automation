/**
 * Example usage script for Browser Helper
 * Run with: node browser-automation/example.js
 */

const BrowserHelper = require('./browser-helper');

async function main() {
  const browser = new BrowserHelper({
    headless: false, // Set to true for background mode
    slowMo: 100 // Slow down by 100ms for visibility
  });

  try {
    // Launch browser
    await browser.launch();

    // Navigate to a website
    await browser.goto('https://google.com');
    
    // Get page title
    const title = await browser.getTitle();
    console.log('Page title:', title);

    // Take screenshot
    await browser.screenshot('/home/gratheon/browser-automation/screenshot.png');

    // Get cookies
    const cookies = await browser.getCookies();
    console.log('Cookies count:', cookies.length);

    // Wait a bit to see the result
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Keep browser open (comment this out to auto-close)
    console.log('Browser is open. Press Ctrl+C to close.');
    // await browser.close();

  } catch (error) {
    console.error('Error:', error);
    await browser.close();
  }
}

main();
