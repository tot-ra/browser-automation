#!/usr/bin/env node
/**
 * Quick Browser - Non-blocking browser launcher for AI
 * Launches browser and immediately returns control
 */

const { spawn } = require('child_process');
const fs = require('fs');

async function quickLaunch(url = null) {
  const logFile = '/tmp/browser-quick.log';
  
  console.log('🚀 Quick launching browser...');
  
  const BrowserHelper = require('./browser-helper');
  
  // Set DISPLAY
  process.env.DISPLAY = ':1';
  
  const browser = new BrowserHelper({
    headless: false,
    slowMo: 100
  });
  
  await browser.launch();
  
  if (url) {
    console.log(`🌐 Navigating to: ${url}`);
    await browser.goto(url);
  }
  
  console.log('✅ Browser is open on VNC display :1');
  console.log('📺 Connect to VNC port 5901 to see it');
  console.log('');
  console.log('💡 Browser will stay open. To close:');
  console.log('   - Use VNC to close Firefox manually');
  console.log('   - Or run: pkill -f firefox');
  console.log('');
  console.log('🎉 Done! Browser is running.');
  
  // Don't close browser - let it run
  // Just exit the script
}

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  console.log('\n👋 Exiting script (browser will keep running)');
  process.exit(0);
});

const url = process.argv[2];
quickLaunch(url).catch(error => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});
