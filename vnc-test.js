#!/usr/bin/env node
/**
 * VNC Browser Test - Quick visual test for VNC display
 * This will open Firefox on VNC display :1 (port 5901)
 */

// Set DISPLAY for VNC
process.env.DISPLAY = ':1';

const BrowserHelper = require('./browser-helper');

async function vncTest() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('🖥️  VNC Browser Test');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');
  console.log('📺 VNC Display: :1');
  console.log('🔌 VNC Port: 5901');
  console.log('🌐 Connect with VNC viewer to see the browser');
  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');

  const browser = new BrowserHelper({
    headless: false,  // Must be false to see in VNC
    slowMo: 500       // Slow down for visibility
  });

  try {
    console.log('🚀 Launching Firefox on VNC display...');
    await browser.launch();
    console.log('✅ Browser launched!');
    console.log('');

    console.log('🌐 Navigating to example.com...');
    await browser.goto('https://example.com');
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('✅ Navigation complete');
    console.log('');

    console.log('📸 Taking screenshot...');
    const screenshot = '/home/gratheon/browser-automation/vnc-test-screenshot.png';
    await browser.screenshot(screenshot);
    console.log(`✅ Screenshot saved: ${screenshot}`);
    console.log('');

    console.log('📊 Getting page info...');
    const title = await browser.getTitle();
    const url = await browser.getUrl();
    console.log(`   Title: ${title}`);
    console.log(`   URL: ${url}`);
    console.log('');

    console.log('🔄 Navigating to Google...');
    await browser.goto('https://google.com');
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log('✅ Navigation complete');
    console.log('');

    console.log('📸 Taking final screenshot...');
    await browser.screenshot('/home/gratheon/browser-automation/vnc-test-google.png');
    console.log('✅ Screenshot saved');
    console.log('');

    console.log('═══════════════════════════════════════════════════════════');
    console.log('✅ VNC TEST SUCCESSFUL!');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('');
    console.log('📋 You should see:');
    console.log('   1. Firefox window open in your VNC viewer');
    console.log('   2. Google.com loaded in the browser');
    console.log('   3. Two screenshots saved in browser-automation/');
    console.log('');
    console.log('🎮 Browser will stay open for 30 seconds...');
    console.log('   You can interact with it in VNC viewer!');
    console.log('');

    // Keep browser open for 30 seconds
    for (let i = 30; i > 0; i--) {
      process.stdout.write(`\r⏱️  Closing in ${i} seconds... (Press Ctrl+C to keep open)`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    console.log('\n');

    console.log('🔒 Closing browser...');
    await browser.close();
    console.log('✅ Browser closed');
    console.log('');
    console.log('👋 Test complete!');

  } catch (error) {
    console.error('');
    console.error('❌ Error:', error.message);
    console.error('');
    console.error('💡 Troubleshooting:');
    console.error('   1. Check VNC is running: ps aux | grep vnc');
    console.error('   2. Check port 5901: netstat -tlnp | grep 5901');
    console.error('   3. Verify DISPLAY: echo $DISPLAY');
    console.error('   4. Try: export DISPLAY=:1');
    console.error('');
    console.error(error.stack);
    
    if (browser.browser) {
      await browser.close();
    }
    process.exit(1);
  }
}

vncTest();
