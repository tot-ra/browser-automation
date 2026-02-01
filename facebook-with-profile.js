#!/usr/bin/env node
/**
 * Facebook Events with User Profile
 * Uses your real Firefox profile to maintain login sessions
 */

process.env.DISPLAY = ':1';

const BrowserHelper = require('./browser-helper');
const path = require('path');
const os = require('os');

async function checkFacebookWithRealProfile() {
  // Use your actual Firefox profile
  const userProfile = path.join(os.homedir(), '.mozilla/firefox/1sn3zs0y.default-release');
  
  const browser = new BrowserHelper({
    headless: false,
    slowMo: 500,
    profilePath: userProfile  // Use real profile!
  });

  try {
    console.log('🔧 Using your real Firefox profile:');
    console.log('   ' + userProfile);
    console.log('');
    console.log('⚠️  This will use your actual Facebook session!');
    console.log('');
    
    console.log('🌐 Launching browser...');
    await browser.launch();
    
    console.log('🔗 Navigating to Facebook Events...');
    await browser.goto('https://www.facebook.com/events');
    
    // Wait for page to load
    console.log('⏳ Waiting for page to load...');
    await new Promise(resolve => setTimeout(resolve, 7000));
    
    // Take screenshot
    const screenshotPath = '/home/gratheon/git/browser-automation/facebook-events-logged.png';
    await browser.screenshot(screenshotPath);
    console.log(`📸 Screenshot saved: ${screenshotPath}`);
    
    // Check login status
    console.log('');
    console.log('🔍 Checking login status...');
    const url = await browser.getUrl();
    const title = await browser.getTitle();
    
    console.log('Current URL:', url);
    console.log('Page Title:', title);
    console.log('');
    
    // Get page text to check
    const pageText = await browser.getPageText();
    
    // Check if we're on login page
    if (pageText.includes('Log in to Facebook') || 
        pageText.includes('Email or phone') ||
        url.includes('/login')) {
      console.log('❌ NOT LOGGED IN');
      console.log('');
      console.log('📺 Browser is open in VNC (port 5901)');
      console.log('Please:');
      console.log('1. Connect to VNC');
      console.log('2. Log in to Facebook manually');
      console.log('3. Browser will stay open for 5 minutes');
      console.log('');
      await new Promise(resolve => setTimeout(resolve, 300000));
      return;
    }
    
    console.log('✅ LOGGED IN!');
    console.log('');
    
    // Look for events
    console.log('📅 Searching for events...');
    console.log('');
    
    // Extract event information
    const events = await browser.evaluate(() => {
      const eventData = [];
      
      // Try to find event cards/links
      const eventLinks = document.querySelectorAll('a[href*="/events/"]');
      
      eventLinks.forEach((link, index) => {
        if (index < 20) { // First 20 events
          const parent = link.closest('[role="article"]') || link.parentElement;
          eventData.push({
            url: link.href,
            text: link.textContent?.trim().substring(0, 200),
            html: parent?.innerHTML.substring(0, 300)
          });
        }
      });
      
      return eventData;
    });
    
    console.log(`Found ${events.length} event elements`);
    console.log('');
    
    if (events.length > 0) {
      console.log('📋 Events found:');
      console.log('═'.repeat(60));
      events.forEach((event, i) => {
        console.log(`\n${i + 1}. ${event.text}`);
        console.log(`   URL: ${event.url}`);
      });
      console.log('═'.repeat(60));
    }
    
    // Try to find Tallinn-related events
    console.log('');
    console.log('🔎 Looking for Tallinn events...');
    const tallinnEvents = events.filter(e => 
      e.text?.toLowerCase().includes('tallinn') ||
      e.text?.toLowerCase().includes('таллин')
    );
    
    if (tallinnEvents.length > 0) {
      console.log(`✅ Found ${tallinnEvents.length} Tallinn events!`);
      tallinnEvents.forEach((event, i) => {
        console.log(`\n${i + 1}. ${event.text}`);
        console.log(`   ${event.url}`);
      });
    } else {
      console.log('ℹ️  No Tallinn events in first 20 results');
      console.log('   Check the screenshot and VNC for full view');
    }
    
    console.log('');
    console.log('📊 Summary:');
    console.log(`  - Login Status: LOGGED IN ✅`);
    console.log(`  - Total Events Found: ${events.length}`);
    console.log(`  - Tallinn Events: ${tallinnEvents.length}`);
    console.log(`  - Screenshot: ${screenshotPath}`);
    console.log('');
    console.log('🖥️  Browser is open on VNC port 5901');
    console.log('Browser will stay open for 5 minutes for you to explore...');
    console.log('');
    
    // Keep browser open
    await new Promise(resolve => setTimeout(resolve, 300000));
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    
    console.log('');
    console.log('Browser staying open for debugging. Check VNC on port 5901');
    await new Promise(resolve => setTimeout(resolve, 300000));
  }
}

checkFacebookWithRealProfile();
