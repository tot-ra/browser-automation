/**
 * Quick test to verify browser automation is working
 */

const BrowserHelper = require('./browser-helper');

async function test() {
  console.log('🧪 Testing Browser Automation Setup...\n');

  const browser = new BrowserHelper({
    headless: false,
    slowMo: 200
  });

  try {
    // Test 1: Launch
    console.log('✓ Test 1: Launching browser...');
    await browser.launch();
    console.log('  ✓ Browser launched successfully');
    console.log('  Profile:', browser.options.profilePath);

    // Test 2: Navigation
    console.log('\n✓ Test 2: Navigation...');
    await browser.goto('https://example.com');
    const url = await browser.getUrl();
    console.log('  ✓ Navigated to:', url);

    // Test 3: Get title
    console.log('\n✓ Test 3: Get page title...');
    const title = await browser.getTitle();
    console.log('  ✓ Title:', title);

    // Test 4: Screenshot
    console.log('\n✓ Test 4: Taking screenshot...');
    const screenshotPath = '/home/gratheon/browser-automation/test-screenshot.png';
    await browser.screenshot(screenshotPath);
    console.log('  ✓ Screenshot saved:', screenshotPath);

    // Test 5: Cookies
    console.log('\n✓ Test 5: Getting cookies...');
    const cookies = await browser.getCookies();
    console.log('  ✓ Cookies count:', cookies.length);

    // Test 6: Page text
    console.log('\n✓ Test 6: Getting page text...');
    const text = await browser.getPageText();
    console.log('  ✓ Text preview:', text.substring(0, 100) + '...');

    // Test 7: Evaluate JavaScript
    console.log('\n✓ Test 7: Evaluating JavaScript...');
    const result = await browser.evaluate(() => {
      return {
        userAgent: navigator.userAgent,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      };
    });
    console.log('  ✓ Viewport:', result.viewport);

    console.log('\n✅ All tests passed!');
    console.log('\n📋 Summary:');
    console.log('  - Browser: Firefox (Playwright)');
    console.log('  - Profile:', browser.options.profilePath);
    console.log('  - Headless:', browser.options.headless);
    console.log('  - Session saved: Yes');
    console.log('\n🎉 Browser automation is ready to use!');
    console.log('\nBrowser will stay open. Press Ctrl+C to close.');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error(error.stack);
    await browser.close();
    process.exit(1);
  }
}

test();
