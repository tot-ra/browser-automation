# 🌐 Browser Automation - Quick Start

## 🚀 For AI: How to Launch Browser WITHOUT HANGING

### ✅ CORRECT - Quick Launch
```bash
# Launch and immediately return control (NON-BLOCKING!)
timeout 10 node quick-launch.js https://google.com &
```

### ✅ CORRECT - Background Mode
```bash
node bg-launcher.js start
```

### ❌ WRONG - Blocking Launch
```bash
# DON'T USE! Will hang the terminal!
node commander.js
node example.js
```

## 📋 Available Commands

### Background Browser Management
```bash
# Start browser in background
node bg-launcher.js start

# Check status
node bg-launcher.js status

# Stop
node bg-launcher.js stop

# Restart
node bg-launcher.js restart
```

### Quick Launch (non-blocking)
```bash
# Open URL
timeout 10 node quick-launch.js https://example.com &

# Just open browser
timeout 10 node quick-launch.js &
```

### Status Checks
```bash
# Check if Firefox is running
ps aux | grep firefox | grep -v grep

# Check VNC
netstat -tlnp | grep 5901

# Kill all Firefox processes
pkill -f firefox
```

## 🖥️ VNC Information

- **Display:** :1
- **Port:** 5901
- **Connect:** VNC viewer -> localhost:5901
- **Profile:** `~/.mozilla/firefox/ai-automation-profile`

## 📝 Logs

When using background mode:
```bash
# Watch logs in real-time
tail -f /tmp/browser-automation.log

# Last 50 lines
tail -n 50 /tmp/browser-automation.log
```

## 🎯 Usage Examples for AI

### Open site and leave browser running
```bash
timeout 10 node quick-launch.js https://github.com &
```

### Start and notify user
```bash
node bg-launcher.js start
echo "✅ Browser started! Connect to VNC on port 5901"
```

### Close browser
```bash
pkill -f firefox
# or
node bg-launcher.js stop
```

## ⚙️ Configuration

All browsers launch with:
- **DISPLAY=:1** (VNC display)
- **headless=false** (visible mode)
- **slowMo=100-500** (slow down for visibility)
- **Persistent profile** (session persistence)

## 🔧 Troubleshooting

### Browser doesn't appear in VNC
```bash
# Check DISPLAY
echo $DISPLAY  # should be :1

# Check VNC
ps aux | grep vnc
```

### Process hung
```bash
# Kill all Firefox processes
pkill -9 -f firefox

# Kill Node browser processes
pkill -9 -f "node.*browser"
```

### No profile
```bash
# Create profile manually
mkdir -p ~/.mozilla/firefox/ai-automation-profile
```

## 💡 Tips for AI

1. **Always use `timeout` and `&`** for non-blocking launch
2. **Don't wait for completion** - browser should run independently
3. **Check processes** after launch with `ps aux | grep firefox`
4. **Use quick-launch.js** for simple tasks
5. **Use bg-launcher.js** for long-running operations
