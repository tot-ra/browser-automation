#!/bin/bash
# Quick test script to verify browser automation setup

echo "🧪 Testing Browser Automation Setup..."
echo ""

# Test 1: Check if dependencies are installed
echo "1️⃣ Checking dependencies..."
if command -v node >/dev/null 2>&1; then
    echo "   ✅ Node.js installed: $(node --version)"
else
    echo "   ❌ Node.js not found"
    exit 1
fi

if [ -d "node_modules/playwright" ]; then
    echo "   ✅ Playwright installed"
else
    echo "   ❌ Playwright not installed - run: npm install"
    exit 1
fi

# Test 2: Check VNC display
echo ""
echo "2️⃣ Checking VNC display..."
if [ -f "/tmp/.X1-lock" ]; then
    echo "   ✅ Display :1 is running"
else
    echo "   ⚠️  Display :1 not found - browser may not be visible"
fi

# Test 3: Check profile sync watcher
echo ""
echo "3️⃣ Checking profile sync watcher..."
if [ -f "/tmp/profile-sync-watcher.pid" ]; then
    PID=$(cat /tmp/profile-sync-watcher.pid)
    if ps -p "$PID" > /dev/null 2>&1; then
        echo "   ✅ Profile sync watcher running (PID: $PID)"
    else
        echo "   ⚠️  Profile sync watcher PID file exists but process not running"
        echo "   Run: ./watch-sync.sh start"
    fi
else
    echo "   ⚠️  Profile sync watcher not running"
    echo "   Run: ./watch-sync.sh start"
fi

# Test 4: Check browser CLI tool
echo ""
echo "4️⃣ Checking browser CLI tool..."
if [ -x "$HOME/.opencode/bin/browser" ]; then
    echo "   ✅ Browser CLI tool installed and executable"
    if echo "$PATH" | grep -q ".opencode/bin"; then
        echo "   ✅ Browser CLI tool in PATH"
    else
        echo "   ⚠️  Browser CLI tool not in PATH"
        echo "   Add to ~/.bashrc: export PATH=\"\$HOME/.opencode/bin:\$PATH\""
    fi
else
    echo "   ⚠️  Browser CLI tool not found or not executable"
    echo "   Run: chmod +x ~/.opencode/bin/browser"
fi

# Test 5: Check profiles
echo ""
echo "5️⃣ Checking Firefox profiles..."
REAL_PROFILE="$HOME/.mozilla/firefox/1sn3zs0y.default-release"
AUTO_PROFILE="$HOME/.mozilla/firefox/ai-automation-profile"

if [ -d "$REAL_PROFILE" ]; then
    echo "   ✅ Real Firefox profile found"
else
    echo "   ⚠️  Real Firefox profile not found at: $REAL_PROFILE"
fi

if [ -d "$AUTO_PROFILE" ]; then
    echo "   ✅ Automation profile found"
else
    echo "   ⚠️  Automation profile not found - will be created on first run"
fi

# Summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Setup Status: READY"
echo ""
echo "Quick commands to try:"
echo "  browser status"
echo "  timeout 15 node quick-launch.js https://example.com &"
echo "  ./cheatsheet.sh"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
