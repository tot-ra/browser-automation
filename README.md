# Browser Automation for AI

Firefox automation using Playwright for VNC with persistent sessions.

## ⚠️ Security

**IMPORTANT:** This project uses a persistent Firefox profile which may contain:
- 🔐 Saved passwords
- 🍪 Cookies and sessions
- 📜 Browser history

**Files that should NOT be committed to git:**
- `session.json` - contains profile paths
- `*.png`, `*.jpg` - screenshots may contain private data
- Firefox profile (`.mozilla/`) - contains passwords!

These files are already added to `.gitignore`. Use `session.json.example` as a template.

## 🖥️ VNC Integration

**Browser automatically launches on VNC display :1 (port 5901)**

### Connecting via VNC
1. Connect to VNC server on port **5901**
2. Run any browser script
3. You'll see the Firefox window in your VNC viewer

### ⚡ Quick Launch (for AI - non-blocking!)
```bash
# Open browser and immediately return control
timeout 10 node quick-launch.js https://google.com &

# Or start in background mode
node bg-launcher.js start
```

### VNC Quick Test
```bash
# Full visual test with automatic demonstration
DISPLAY=:1 node vnc-test.js

# Or via npm
npm run vnc-test
```

### Launching Browser for VNC
```bash
# Via npm (DISPLAY already configured)
npm run browser
npm run test

# Or directly
DISPLAY=:1 node example.js
DISPLAY=:1 node commander.js
```

### VNC Verification
```bash
# Check that VNC is running on port 5901
netstat -tlnp | grep 5901

# Check VNC process
ps aux | grep vnc

# Check current DISPLAY
echo $DISPLAY
```

## Installation

```bash
git clone git@github.com:tot-ra/browser-automation.git
cd browser-automation
npm install
npx playwright install firefox
```

## Usage

### 1. Quick Launch (recommended for AI)
```bash
# Non-blocking terminal
timeout 10 node quick-launch.js https://example.com &
```

### 2. Background Mode
```bash
# Start
node bg-launcher.js start

# Check status
node bg-launcher.js status

# Stop
node bg-launcher.js stop
```

### 3. Simple Example (may block)
```bash
timeout 30 node example.js
```

### 4. Command Interface
```bash
# Start browser
node commander.js

# Execute command
node commander.js '{"action":"goto","params":{"url":"https://google.com"}}'
node commander.js '{"action":"screenshot"}'
node commander.js '{"action":"getTitle"}'
```

### 5. Programmatic Usage
```javascript
const BrowserHelper = require('./browser-helper');

const browser = new BrowserHelper({
  headless: false, // visible mode
  slowMo: 100 // slow down for visibility
});

await browser.launch();
await browser.goto('https://example.com');
const title = await browser.getTitle();
await browser.screenshot('/path/to/screenshot.png');
```

## Available Commands

- `goto` - navigate to URL
- `getTitle` - get page title
- `getUrl` - get current URL
- `click` - click element
- `type` - enter text
- `screenshot` - take screenshot
- `getText` - get element text
- `getPageText` - get all page text
- `getCookies` - get cookies
- `getLocalStorage` - get localStorage
- `evaluate` - execute JavaScript
- `waitForSelector` - wait for element
- `newPage` - open new tab
- `getHistory` - get browser history

## Firefox Profile

The browser uses a separate profile located at:
- Linux: `~/.mozilla/firefox/ai-automation-profile`
- macOS: `~/Library/Application Support/Firefox/Profiles/ai-automation-profile`
- Windows: `%APPDATA%/Mozilla/Firefox/Profiles/ai-automation-profile`

All logins, passwords, cookies, and history are persisted between runs.

## Sessions

Session information is saved in `session.json`:
```json
{
  "profilePath": "/path/to/profile",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "active": true
}
```

## Security Notes

⚠️ **Important**: The profile contains your passwords and cookies. Make sure:
- The profile directory doesn't get pushed to public repositories
- You have `.gitignore` configured to exclude `session.json` and screenshots
- The profile is protected by file system permissions

## Features

- ✅ Firefox with Playwright
- ✅ Automatic launch on VNC display :1
- ✅ Session, cookie, and password persistence
- ✅ Non-blocking launch mode
- ✅ Background mode with logging
- ✅ Full documentation
- ✅ Multiple execution modes

## Troubleshooting

**Problem:** AI hangs when launching browser  
**Solution:** Use quick-launch.js with timeout and &

**Problem:** Browser not visible in VNC  
**Solution:** Check DISPLAY=:1 and VNC on port 5901

**Problem:** Sessions not persisting  
**Solution:** Profile is automatically at ~/.mozilla/firefox/ai-automation-profile

## License

ISC
