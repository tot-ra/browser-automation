#!/bin/bash
# VNC Browser Launcher
# Runs browser on VNC display :1 (port 5901)

export DISPLAY=:1

echo "🖥️  Setting DISPLAY to :1 for VNC on port 5901"
echo "📍 VNC Connection: localhost:5901"
echo ""

# Check if VNC is running
if ! pgrep -f "rfbport 5901" > /dev/null; then
    echo "⚠️  Warning: VNC server might not be running on port 5901"
    echo "   Check with: ps aux | grep vnc"
    echo ""
fi

# Run the browser command
exec "$@"
