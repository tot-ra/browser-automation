# AI Browser Automation Guide

## For AI Assistant: How to Use the Browser

### ⚠️ IMPORTANT: Don't Hang!

**Use quick launch without waiting:**
```bash
# This script will launch the browser and immediately return control
timeout 10 node quick-launch.js https://example.com &
```

**Or launch in background:**
```bash
node bg-launcher.js start
```

### Quick Start

1. **Quickly open browser (NON-BLOCKING):**
```bash
timeout 10 node quick-launch.js https://example.com &
```

2. **Execute command with timeout:**
```bash
timeout 15 node commander.js '{"action":"goto","params":{"url":"https://example.com"}}'
```

3. **Start in background and check status:**
```bash
node bg-launcher.js start
node bg-launcher.js status
```

### Main Usage Scenarios

#### Open site and take screenshot
```bash
# QUICK METHOD (non-blocking)
timeout 10 node quick-launch.js https://example.com &
```

```javascript
const BrowserHelper = require('./browser-helper');

const browser = new BrowserHelper({ headless: false });
await browser.launch();
await browser.goto('https://example.com');
await browser.screenshot('/path/to/screenshot.png');
// Browser will stay open until browser.close() is called
```

#### Fill out a form
```bash
timeout 15 node commander.js '{"action":"goto","params":{"url":"https://example.com/login"}}'
timeout 10 node commander.js '{"action":"type","params":{"selector":"#username","text":"user@example.com"}}'
timeout 10 node commander.js '{"action":"type","params":{"selector":"#password","text":"password123"}}'
timeout 10 node commander.js '{"action":"click","params":{"selector":"button[type=submit]"}}'
```

#### Get page text
```bash
timeout 10 node commander.js '{"action":"getPageText"}'
```

#### Get cookies
```bash
timeout 10 node commander.js '{"action":"getCookies"}'
```

### Available Actions

| Action | Parameters | Description |
|--------|------------|-------------|
| `goto` | `{url}` | Navigate to URL |
| `getTitle` | - | Get page title |
| `getUrl` | - | Get current URL |
| `click` | `{selector}` | Click element |
| `type` | `{selector, text}` | Enter text |
| `screenshot` | `{filepath?}` | Take screenshot |
| `getText` | `{selector}` | Get element text |
| `getPageText` | - | Get all text |
| `getCookies` | - | Get cookies |
| `getLocalStorage` | - | Get localStorage |
| `evaluate` | `{script}` | Execute JS |
| `waitForSelector` | `{selector, timeout?}` | Wait for element |
| `newPage` | - | Open new tab |
| `getHistory` | - | Get history path |

### Selectors

- By ID: `#myId`
- By class: `.myClass`
- By tag: `button`
- By attribute: `[name="username"]`
- By text: `text=Login`
- Combined: `button.primary[type="submit"]`

### Examples for Common Tasks

#### Google Search
```javascript
await browser.goto('https://google.com');
await browser.type('textarea[name="q"]', 'playwright automation');
await browser.click('input[name="btnK"]');
await browser.waitForSelector('#search');
const results = await browser.getPageText();
```

#### Check Authentication
```javascript
await browser.goto('https://github.com');
const cookies = await browser.getCookies();
const isLoggedIn = cookies.some(c => c.name === 'user_session');
```

#### Data Extraction
```javascript
await browser.goto('https://example.com/data');
const data = await browser.evaluate(() => {
  return Array.from(document.querySelectorAll('.item')).map(item => ({
    title: item.querySelector('.title').textContent,
    price: item.querySelector('.price').textContent
  }));
});
```

### Session Persistence

**Browser profile is saved automatically** at:
```
~/.mozilla/firefox/ai-automation-profile
```

All logins, passwords, cookies, and history are persisted between runs.

### Useful Tips for AI

1. **Always use headless: false** - user wants to see what's happening
2. **Add slowMo: 100-500** - for action visibility
3. **Take screenshots** - helps debug issues
4. **Use waitForSelector** - wait for elements to load
5. **Preserve session** - don't close browser unnecessarily
6. **Log actions** - console.log each step

### Debugging

If something doesn't work:
1. Check that browser is visible (headless: false)
2. Take screenshot of current state
3. Get HTML: `getContent()`
4. Check selector with evaluate
5. Increase timeout for slow sites

### Security

⚠️ **Important:**
- Profile contains real user passwords
- Don't log cookies/passwords to console
- Don't commit session.json
- Screenshots may contain private information
