#!/usr/bin/env node
/**
 * Facebook Events Extractor
 * Now with copied cookies from your real profile!
 */

process.env.DISPLAY = ':1';

const BrowserHelper = require('./browser-helper');

async function getFacebookEvents() {
  const browser = new BrowserHelper({
    headless: false,
    slowMo: 800
  });

  try {
    console.log('🔧 Using automation profile with your real cookies!');
    console.log('');
    
    console.log('🌐 Launching browser...');
    await browser.launch();
    
    console.log('🔗 Navigating to Facebook Events...');
    await browser.goto('https://www.facebook.com/events');
    
    // Wait for page to load
    console.log('⏳ Waiting for page to load (10 seconds)...');
    await new Promise(resolve => setTimeout(resolve, 10000));
    
    // Take initial screenshot
    const screenshot1 = '/home/gratheon/facebook-step1.png';
    await browser.screenshot(screenshot1);
    console.log(`📸 Screenshot 1: ${screenshot1}`);
    console.log('');
    
    // Check current URL and title
    const url = await browser.getUrl();
    const title = await browser.getTitle();
    
    console.log('📍 Current state:');
    console.log(`   URL: ${url}`);
    console.log(`   Title: ${title}`);
    console.log('');
    
    // Get page text
    const pageText = await browser.getPageText();
    
    // Check if we need to login
    if (pageText.includes('Log in to Facebook') || 
        pageText.includes('Email or phone') ||
        pageText.includes('Create new account') ||
        url.includes('/login')) {
      console.log('❌ NOT LOGGED IN - Need manual login');
      console.log('');
      console.log('Cookies were copied but session expired or invalid.');
      console.log('');
      console.log('📺 Browser is OPEN on VNC port 5901');
      console.log('');
      console.log('Please do this:');
      console.log('1. Connect to VNC viewer on localhost:5901');
      console.log('2. Log in to Facebook manually in the browser');
      console.log('3. After login, browser will stay open for 10 minutes');
      console.log('4. I\'ll try to extract events automatically');
      console.log('');
      console.log('Waiting 10 minutes for you to log in...');
      console.log('(Press Ctrl+C if you\'re done sooner)');
      console.log('');
      
      // Wait 10 minutes for user to login
      await new Promise(resolve => setTimeout(resolve, 600000));
      
      // After user logged in, try again
      console.log('');
      console.log('🔄 Checking again after your login...');
      await browser.goto('https://www.facebook.com/events');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
    
    const finalUrl = await browser.getUrl();
    const finalTitle = await browser.getTitle();
    const finalText = await browser.getPageText();
    
    console.log('');
    console.log('✅ Current page state:');
    console.log(`   URL: ${finalUrl}`);
    console.log(`   Title: ${finalTitle}`);
    console.log('');
    
    // Take final screenshot
    const screenshot2 = '/home/gratheon/facebook-step2.png';
    await browser.screenshot(screenshot2);
    console.log(`📸 Screenshot 2: ${screenshot2}`);
    console.log('');
    
    // Extract events
    console.log('🔍 Extracting events from page...');
    console.log('');
    
    const eventData = await browser.evaluate(() => {
      const events = [];
      
      // Method 1: Look for event links
      const eventLinks = document.querySelectorAll('a[href*="/events/"]');
      const seen = new Set();
      
      eventLinks.forEach(link => {
        const href = link.href;
        // Extract event ID from URL
        const match = href.match(/\/events\/(\d+)/);
        if (match && !seen.has(match[1])) {
          seen.add(match[1]);
          
          // Try to find parent container with more info
          let parent = link.closest('[role="article"]') || 
                       link.closest('div[class*="event"]') ||
                       link.parentElement;
          
          // Get text content
          let textContent = link.textContent?.trim() || '';
          if (parent && parent !== link) {
            textContent = parent.textContent?.trim() || textContent;
          }
          
          events.push({
            eventId: match[1],
            url: href,
            text: textContent.substring(0, 500),
            linkText: link.textContent?.trim()
          });
        }
      });
      
      return events;
    });
    
    console.log(`📊 Found ${eventData.length} unique events`);
    console.log('');
    
    if (eventData.length > 0) {
      console.log('═'.repeat(70));
      console.log('📅 EVENTS:');
      console.log('═'.repeat(70));
      
      eventData.slice(0, 15).forEach((event, i) => {
        console.log('');
        console.log(`${i + 1}. Event ID: ${event.eventId}`);
        console.log(`   Link: ${event.url}`);
        console.log(`   Preview: ${event.text.substring(0, 200)}`);
      });
      
      console.log('');
      console.log('═'.repeat(70));
      
      // Look for Tallinn events
      console.log('');
      console.log('🏙️  Filtering for Tallinn events...');
      const tallinnEvents = eventData.filter(e => 
        e.text.toLowerCase().includes('tallinn') ||
        e.text.toLowerCase().includes('таллин') ||
        e.text.toLowerCase().includes('estonia')
      );
      
      if (tallinnEvents.length > 0) {
        console.log('');
        console.log(`✅ Found ${tallinnEvents.length} Tallinn/Estonia related events!`);
        console.log('─'.repeat(70));
        tallinnEvents.forEach((event, i) => {
          console.log('');
          console.log(`${i + 1}. ${event.url}`);
          console.log(`   ${event.text.substring(0, 200)}`);
        });
        console.log('─'.repeat(70));
      } else {
        console.log('ℹ️  No Tallinn events found in extracted text');
        console.log('   (They might be there but not in text - check screenshots)');
      }
    } else {
      console.log('⚠️  No events extracted');
      console.log('   This might mean:');
      console.log('   - Not logged in');
      console.log('   - Different page structure');
      console.log('   - Need to scroll down');
      console.log('');
      console.log('   Check the screenshots to see what\'s visible');
    }
    
    console.log('');
    console.log('📋 Summary:');
    console.log(`   Screenshots: ${screenshot1}, ${screenshot2}`);
    console.log(`   Total events found: ${eventData.length}`);
    console.log(`   Browser: OPEN on VNC port 5901`);
    console.log('');
    console.log('🖥️  Browser staying open for 5 minutes for you to explore');
    console.log('   Connect to VNC to see the live page!');
    console.log('');
    
    // Keep browser open
    await new Promise(resolve => setTimeout(resolve, 300000));
    
  } catch (error) {
    console.error('');
    console.error('❌ Error:', error.message);
    console.error('');
    console.error('Browser will stay open. Check VNC on port 5901');
    await new Promise(resolve => setTimeout(resolve, 300000));
  }
}

getFacebookEvents();
