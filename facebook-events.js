#!/usr/bin/env node
/**
 * Facebook Events Scraper
 * Checks login status and extracts events
 */

process.env.DISPLAY = ':1';

const BrowserHelper = require('./browser-helper');

async function checkFacebookEvents() {
  const browser = new BrowserHelper({
    headless: false,
    slowMo: 500
  });

  try {
    console.log('🌐 Launching browser...');
    await browser.launch();
    
    console.log('🔗 Navigating to Facebook Events...');
    await browser.goto('https://www.facebook.com/events?source=46&action_history=null');
    
    // Wait for page to load
    console.log('⏳ Waiting for page to load...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Take screenshot
    const screenshotPath = '/home/gratheon/git/browser-automation/facebook-events.png';
    await browser.screenshot(screenshotPath);
    console.log(`📸 Screenshot saved: ${screenshotPath}`);
    
    // Check if logged in by looking for common FB elements
    console.log('🔍 Checking login status...');
    const pageText = await browser.getPageText();
    const url = await browser.getUrl();
    
    console.log('Current URL:', url);
    console.log('');
    
    // Check for login indicators
    const isLoggedIn = !pageText.includes('Log In') || 
                       !pageText.includes('Create New Account') ||
                       url.includes('/events');
    
    if (pageText.includes('Log in to Facebook') || pageText.includes('Email or phone')) {
      console.log('❌ NOT LOGGED IN - Login page detected');
      console.log('');
      console.log('You need to:');
      console.log('1. Connect to VNC on port 5901');
      console.log('2. Manually log in to Facebook');
      console.log('3. Run this script again');
      console.log('');
      console.log('Browser will stay open for 60 seconds for you to log in...');
      await new Promise(resolve => setTimeout(resolve, 60000));
      return;
    }
    
    console.log('✅ Appears to be logged in!');
    console.log('');
    
    // Try to find events
    console.log('📅 Looking for events...');
    
    // Get all text content to analyze
    const fullText = pageText.substring(0, 3000); // First 3000 chars
    console.log('Page preview:');
    console.log('─'.repeat(60));
    console.log(fullText);
    console.log('─'.repeat(60));
    console.log('');
    
    // Try to extract events using JavaScript
    console.log('🔎 Extracting events data...');
    const events = await browser.evaluate(() => {
      const results = [];
      
      // Try different selectors for events
      const eventSelectors = [
        '[role="article"]',
        '[data-testid="event-card"]',
        'a[href*="/events/"]',
        'div[class*="event"]',
      ];
      
      for (const selector of eventSelectors) {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
          results.push({
            selector: selector,
            count: elements.length,
            samples: Array.from(elements).slice(0, 3).map(el => ({
              text: el.textContent?.substring(0, 200),
              href: el.href || el.querySelector('a')?.href,
              innerHTML: el.innerHTML.substring(0, 200)
            }))
          });
        }
      }
      
      return results;
    });
    
    console.log('Found elements:');
    console.log(JSON.stringify(events, null, 2));
    console.log('');
    
    // Get all links that might be events
    const links = await browser.evaluate(() => {
      return Array.from(document.querySelectorAll('a[href*="/events/"]'))
        .map(a => ({
          href: a.href,
          text: a.textContent?.trim().substring(0, 100)
        }))
        .filter(l => l.href && l.text)
        .slice(0, 20); // First 20 event links
    });
    
    console.log('📋 Event links found:');
    console.log(JSON.stringify(links, null, 2));
    console.log('');
    
    console.log('🎯 Summary:');
    console.log(`  - URL: ${url}`);
    console.log(`  - Event links found: ${links.length}`);
    console.log(`  - Screenshot: ${screenshotPath}`);
    console.log('');
    console.log('Browser will stay open. Check VNC on port 5901 to see the page!');
    console.log('Press Ctrl+C to close.');
    
    // Keep browser open
    await new Promise(resolve => setTimeout(resolve, 300000)); // 5 minutes
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
  } finally {
    // Don't close - let user see the result
  }
}

checkFacebookEvents();
