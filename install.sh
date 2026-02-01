#!/bin/bash
# Installation script for browser automation
# Run this after cloning the repository

set -e

echo "🚀 Installing Browser Automation..."
echo ""

# Check if running from correct directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run from browser-automation directory."
    exit 1
fi

# Install Node.js dependencies
echo "1️⃣ Installing Node.js dependencies..."
npm install

# Install Playwright Firefox
echo ""
echo "2️⃣ Installing Playwright Firefox..."
npx playwright install firefox

# Create .opencode directories if they don't exist
echo ""
echo "3️⃣ Setting up OpenCode integration..."
mkdir -p ~/.opencode/bin
mkdir -p ~/.opencode/skill

# Copy skill files
cp -v browser-skill.md ~/.opencode/skill/browser-automation.md 2>/dev/null || echo "   ⚠️  browser-skill.md not found, skipping"
cp -v browser-quick-skill.md ~/.opencode/skill/browser-quick.md 2>/dev/null || echo "   ⚠️  browser-quick-skill.md not found, skipping"
cp -v browser-cli.sh ~/.opencode/bin/browser 2>/dev/null || echo "   ⚠️  browser-cli.sh not found, skipping"

# Make browser CLI executable
if [ -f ~/.opencode/bin/browser ]; then
    chmod +x ~/.opencode/bin/browser
    echo "   ✅ Browser CLI tool installed"
fi

# Add to PATH if not already there
echo ""
echo "4️⃣ Checking PATH configuration..."
if ! grep -q '.opencode/bin' ~/.bashrc; then
    echo 'export PATH="$HOME/.opencode/bin:$PATH"' >> ~/.bashrc
    echo "   ✅ Added .opencode/bin to PATH in ~/.bashrc"
    echo "   Run: source ~/.bashrc (or restart terminal)"
else
    echo "   ✅ .opencode/bin already in PATH"
fi

# Create automation profile directory
echo ""
echo "5️⃣ Creating automation profile directory..."
mkdir -p ~/.mozilla/firefox/ai-automation-profile
echo "   ✅ Automation profile directory created"

# Start profile sync watcher
echo ""
echo "6️⃣ Starting profile sync watcher..."
if [ -f "./watch-sync.sh" ]; then
    ./watch-sync.sh start
    echo "   ✅ Profile sync watcher started"
else
    echo "   ⚠️  watch-sync.sh not found, skipping"
fi

# Run setup test
echo ""
echo "7️⃣ Running setup verification..."
if [ -f "./test-setup.sh" ]; then
    ./test-setup.sh
else
    echo "   ⚠️  test-setup.sh not found, skipping verification"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Installation complete!"
echo ""
echo "Next steps:"
echo "  1. Source your bashrc: source ~/.bashrc"
echo "  2. Try: browser status"
echo "  3. Read: cat QUICKSTART.md"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
