---
name: browser-automation
description: Interact with web applications using Playwright-powered Firefox automation. Click buttons, fill forms, extract data with persistent sessions.
license: ISC
compatibility: opencode
metadata:
  author: gratheon
  version: 1.0.0
  technology: Playwright
---

# Browser Automation Skill (Playwright)

## What I do
- **Click and interact** with web applications (buttons, links, forms) using Playwright
- **Fill forms** and type into input fields
- **Take screenshots** of web pages (full page or specific elements)
- **Extract data** from websites (scraping, reading text, getting cookies)
- **Execute JavaScript** in the browser context
- **Wait for elements** to load before interacting
- **Navigate** between pages and wait for page loads
- Use **persistent Firefox sessions** (logged-in state preserved across runs)
- **Share sessions** with user's regular Firefox browser via profile sync
- Run visible via **VNC** on display :1 (port 5901)

## When to use me
Use this skill when you need to:
- **Click buttons** or links on websites
- **Fill out and submit forms** (login, search, data entry)
- **Interact with web applications** (not just view them)
- Take a screenshot of a website
- Visit a website and see what's on it
- Extract data from web pages (Facebook, LinkedIn, etc.)
- Test if a website is accessible
- Interact with websites that require login (sessions are synced)

## How to use me

### Quick screenshot
```bash
cd ~/git/browser-automation
timeout 20 node -e "
const BrowserHelper = require('./browser-helper');
(async () => {
  const b = new BrowserHelper({ slowMo: 300 });
  await b.launch();
  await b.goto('https://example.com');
  await new Promise(r => setTimeout(r, 3000));
  await b.screenshot('/tmp/screenshot.png');
  console.log('✅ Screenshot saved to /tmp/screenshot.png');
  await b.close();
})();
" &
```

### Open a website (quick)
```bash
cd ~/git/browser-automation
timeout 15 node quick-launch.js https://example.com &
```

### Click and interact with elements
```bash
cd ~/git/browser-automation
timeout 20 node -e "
const BrowserHelper = require('./browser-helper');
(async () => {
  const b = new BrowserHelper({ slowMo: 500 });
  await b.launch();
  await b.goto('https://example.com');
  
  // Click a button
  await b.click('button.login');
  
  // Fill a form
  await b.type('input[name=\"email\"]', 'user@example.com');
  await b.type('input[name=\"password\"]', 'password123');
  
  // Submit
  await b.click('button[type=\"submit\"]');
  
  // Wait for page to load
  await b.waitForSelector('.dashboard');
  
  // Take screenshot
  await b.screenshot('/tmp/result.png');
  await b.close();
})();
" &
```

### Using the CLI tool
```bash
browser open https://example.com
browser screenshot /tmp/output.png
browser status
```

### Extract data from a page
```bash
cd ~/git/browser-automation
# Create a new script using browser-helper.js
# See facebook-events-final.js for example
```

## Playwright Methods Available

### Navigation & Page Control
- `await b.goto(url)` - Navigate to URL
- `await b.waitForNavigation()` - Wait for page to load
- `await b.newPage()` - Open new tab

### Element Interaction
- `await b.click(selector)` - Click element (button, link, etc.)
- `await b.type(selector, text)` - Type into input field (uses fill)
- `await b.waitForSelector(selector, timeout)` - Wait for element to appear

### Data Extraction
- `await b.getText(selector)` - Get text from specific element
- `await b.getPageText()` - Get all visible text from page
- `await b.getContent()` - Get full HTML content
- `await b.getTitle()` - Get page title
- `await b.getUrl()` - Get current URL

### Session & State
- `await b.getCookies()` - Get all cookies
- `await b.getLocalStorage()` - Get localStorage data
- `await b.evaluate(script)` - Execute custom JavaScript

### Screenshots
- `await b.screenshot(filepath)` - Take full-page screenshot

## Selector Examples
```javascript
// By ID
await b.click('#submit-button');

// By class
await b.type('.search-input', 'query');

// By attribute
await b.click('[data-testid="login-btn"]');

// By tag
await b.click('button');

// Complex selectors
await b.click('button.primary[type="submit"]');
await b.type('input[name="email"][type="email"]', 'test@example.com');
```

## Important rules
1. **ALWAYS use `timeout` and `&`** - This prevents AI from hanging
2. **Wait 3-5 seconds** before taking screenshots (let page load)
3. **Sessions are automatic** - User's logins are already synced
4. **Browser runs on VNC** - User can see it on display :1, port 5901
5. **Save screenshots to /tmp/** - Easy to access and share
6. **Use slowMo: 300-500** - Makes clicks and typing visible
7. **Wait for selectors** - Use `waitForSelector()` before clicking
8. **Playwright-powered** - Full browser automation capabilities (not just viewing)

## Example: Take screenshot
```bash
cd ~/git/browser-automation && timeout 20 node -e "const BrowserHelper = require('./browser-helper'); (async () => { const b = new BrowserHelper({ slowMo: 300 }); await b.launch(); await b.goto('URL_HERE'); await new Promise(r => setTimeout(r, 5000)); await b.screenshot('/tmp/screenshot.png'); await b.close(); })();" &
```

Replace `URL_HERE` with the actual URL.

## Available files
- `browser-helper.js` - Main automation class
- `quick-launch.js` - Fast browser launch
- `facebook-events-final.js` - Example scraper
- `sync-profiles.sh` - Profile sync tool
- `cheatsheet.sh` - All commands reference

## Profile sync
- Real Firefox: `~/.mozilla/firefox/1sn3zs0y.default-release`
- Automation: `~/.mozilla/firefox/ai-automation-profile`
- Auto-sync runs every 60 seconds in background
- Cookies, localStorage, sessions are shared automatically

## Troubleshooting
```bash
# Check status
browser status

# View sync logs
tail -f /tmp/profile-sync-watcher.log

# Manual sync
cd ~/git/browser-automation && ./sync-profiles.sh both

# See all commands
cd ~/git/browser-automation && ./cheatsheet.sh
```

## Notes for AI
- **Playwright automation** - Can click, type, fill forms, not just view pages
- User's sessions persist between runs
- Facebook, GitHub, etc. are already logged in
- Don't ask user to login - it's automatic
- Always use non-blocking mode (timeout + &)
- VNC port 5901 - user can watch browser in real-time
- **Technology stack**: Playwright + Firefox + VNC
- **Full interaction**: Can automate complex workflows (multi-step forms, navigation, clicks)
