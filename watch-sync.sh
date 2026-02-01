#!/bin/bash
# Profile Sync Watcher - автоматически синхронизирует профили каждые N секунд

INTERVAL=${1:-30}  # Default 30 seconds
REAL_PROFILE="$HOME/.mozilla/firefox/1sn3zs0y.default-release"
AUTO_PROFILE="$HOME/.mozilla/firefox/ai-automation-profile"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SYNC_SCRIPT="$SCRIPT_DIR/sync-profiles.sh"

echo "🔄 Profile Sync Watcher started"
echo "   Interval: ${INTERVAL} seconds"
echo "   Real profile: $REAL_PROFILE"
echo "   Auto profile: $AUTO_PROFILE"
echo ""
echo "Press Ctrl+C to stop"
echo ""

while true; do
    # Check if either Firefox is running
    REAL_RUNNING=$(pgrep -f "firefox.*1sn3zs0y.default-release" | wc -l)
    AUTO_RUNNING=$(pgrep -f "firefox.*ai-automation-profile" | wc -l)
    
    if [ $REAL_RUNNING -eq 0 ] && [ $AUTO_RUNNING -eq 0 ]; then
        # Neither is running - safe to sync bidirectionally
        echo "[$(date '+%H:%M:%S')] Both profiles idle - bidirectional sync"
        bash "$SYNC_SCRIPT" both > /dev/null 2>&1
    elif [ $REAL_RUNNING -gt 0 ] && [ $AUTO_RUNNING -eq 0 ]; then
        # Only real Firefox running - sync TO automation
        echo "[$(date '+%H:%M:%S')] Real Firefox active - sync to automation"
        bash "$SYNC_SCRIPT" to-automation > /dev/null 2>&1
    elif [ $REAL_RUNNING -eq 0 ] && [ $AUTO_RUNNING -gt 0 ]; then
        # Only automation running - sync FROM automation
        echo "[$(date '+%H:%M:%S')] Automation Firefox active - sync from automation"
        bash "$SYNC_SCRIPT" from-automation > /dev/null 2>&1
    else
        # Both running - skip to avoid corruption
        echo "[$(date '+%H:%M:%S')] Both running - skipping sync (unsafe)"
    fi
    
    sleep $INTERVAL
done
