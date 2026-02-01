---
name: browser-automation
description: Open websites in Firefox, take screenshots, extract data with persistent sessions
license: ISC
compatibility: opencode
metadata:
  author: gratheon
  version: 1.0.0
---

# Browser Automation Skill

## What I do
- Open websites in Firefox browser visible via VNC
- Take screenshots of web pages
- Extract data from websites (scraping)
- Use persistent sessions (logged-in state preserved)
- Share sessions with user's regular Firefox browser

## When to use me
Use this skill when you need to:
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

### Open a website
```bash
cd ~/git/browser-automation
timeout 15 node quick-launch.js https://example.com &
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

## Important rules
1. **ALWAYS use `timeout` and `&`** - This prevents AI from hanging
2. **Wait 3-5 seconds** before taking screenshots (let page load)
3. **Sessions are automatic** - User's logins are already synced
4. **Browser runs on VNC** - User can see it on display :1, port 5901
5. **Save screenshots to /tmp/** - Easy to access and share

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
- User's sessions persist between runs
- Facebook, GitHub, etc. are already logged in
- Don't ask user to login - it's automatic
- Always use non-blocking mode (timeout + &)
- VNC port 5901 - user can watch browser in real-time
