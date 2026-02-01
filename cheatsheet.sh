#!/bin/bash
# Browser Automation - Quick Commands Cheatsheet

cat << 'EOF'
╔═══════════════════════════════════════════════════════════════╗
║         🌐 Browser Automation - Quick Commands                ║
╚═══════════════════════════════════════════════════════════════╝

📍 Location: /home/gratheon/git/browser-automation/

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ QUICK LAUNCH (Recommended for AI - doesn't hang!)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# Open browser with URL
timeout 10 node ~/git/browser-automation/quick-launch.js https://google.com &

# Just open browser
timeout 10 node ~/git/browser-automation/quick-launch.js &

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎛️  BACKGROUND MODE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

cd ~/git/browser-automation

# Start browser in background
node bg-launcher.js start

# Check status
node bg-launcher.js status

# Stop browser
node bg-launcher.js stop

# Restart
node bg-launcher.js restart

# View logs
tail -f /tmp/browser-automation.log

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 STATUS & CONTROL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# Check if Firefox is running
ps aux | grep firefox | grep -v grep

# Kill all Firefox processes
pkill -f firefox

# Check VNC status (should show port 5901)
netstat -tlnp | grep 5901

# Check DISPLAY
echo $DISPLAY  # should be :1

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧪 TESTING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

cd ~/git/browser-automation

# Full VNC test (30 seconds demo)
DISPLAY=:1 node vnc-test.js

# Quick test
npm run test

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🖥️  VNC INFO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Display:  :1
Port:     5901
Profile:  ~/.mozilla/firefox/ai-automation-profile

Connect:  vnc://localhost:5901

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 DOCUMENTATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Quick Start:  cat ~/git/browser-automation/QUICKSTART.md
AI Guide:     cat ~/git/browser-automation/AI-GUIDE.md
Full README:  cat ~/git/browser-automation/README.md

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EOF
