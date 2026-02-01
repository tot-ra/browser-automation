#!/bin/bash
# Sync cookies and session data between real Firefox profile and automation profile

REAL_PROFILE="$HOME/.mozilla/firefox/1sn3zs0y.default-release"
AUTO_PROFILE="$HOME/.mozilla/firefox/ai-automation-profile"

# Function to sync from real profile to automation profile
sync_to_automation() {
    echo "📥 Syncing FROM real profile TO automation profile..."
    
    # Copy cookies
    if [ -f "$REAL_PROFILE/cookies.sqlite" ]; then
        cp "$REAL_PROFILE/cookies.sqlite" "$AUTO_PROFILE/"
        echo "  ✅ Cookies copied"
    fi
    
    # Copy storage
    if [ -f "$REAL_PROFILE/storage.sqlite" ]; then
        cp "$REAL_PROFILE/storage.sqlite" "$AUTO_PROFILE/"
        echo "  ✅ Storage database copied"
    fi
    
    # Copy storage directory
    if [ -d "$REAL_PROFILE/storage" ]; then
        rm -rf "$AUTO_PROFILE/storage"
        cp -r "$REAL_PROFILE/storage" "$AUTO_PROFILE/"
        echo "  ✅ Storage directory copied"
    fi
    
    # Copy webappsstore (localStorage)
    if [ -f "$REAL_PROFILE/webappsstore.sqlite" ]; then
        cp "$REAL_PROFILE/webappsstore.sqlite" "$AUTO_PROFILE/"
        echo "  ✅ LocalStorage copied"
    fi
    
    echo "✅ Sync to automation complete!"
}

# Function to sync from automation profile to real profile
sync_from_automation() {
    echo "📤 Syncing FROM automation profile TO real profile..."
    
    # Copy cookies
    if [ -f "$AUTO_PROFILE/cookies.sqlite" ]; then
        cp "$AUTO_PROFILE/cookies.sqlite" "$REAL_PROFILE/"
        echo "  ✅ Cookies copied back"
    fi
    
    # Copy storage
    if [ -f "$AUTO_PROFILE/storage.sqlite" ]; then
        cp "$AUTO_PROFILE/storage.sqlite" "$REAL_PROFILE/"
        echo "  ✅ Storage database copied back"
    fi
    
    # Copy storage directory
    if [ -d "$AUTO_PROFILE/storage" ]; then
        rm -rf "$REAL_PROFILE/storage"
        cp -r "$AUTO_PROFILE/storage" "$REAL_PROFILE/"
        echo "  ✅ Storage directory copied back"
    fi
    
    # Copy webappsstore
    if [ -f "$AUTO_PROFILE/webappsstore.sqlite" ]; then
        cp "$AUTO_PROFILE/webappsstore.sqlite" "$REAL_PROFILE/"
        echo "  ✅ LocalStorage copied back"
    fi
    
    echo "✅ Sync from automation complete!"
}

# Bidirectional sync
sync_both() {
    echo "🔄 Bidirectional sync..."
    echo ""
    
    # Determine which profile was modified more recently
    REAL_MODIFIED=$(stat -c %Y "$REAL_PROFILE/cookies.sqlite" 2>/dev/null || echo 0)
    AUTO_MODIFIED=$(stat -c %Y "$AUTO_PROFILE/cookies.sqlite" 2>/dev/null || echo 0)
    
    if [ $REAL_MODIFIED -gt $AUTO_MODIFIED ]; then
        echo "ℹ️  Real profile is newer, syncing TO automation..."
        sync_to_automation
    else
        echo "ℹ️  Automation profile is newer, syncing TO real profile..."
        sync_from_automation
    fi
    
    echo ""
    echo "✅ Bidirectional sync complete!"
}

# Main
case "${1:-both}" in
    "to-automation"|"to-auto"|"pull")
        sync_to_automation
        ;;
    "from-automation"|"from-auto"|"push")
        sync_from_automation
        ;;
    "both"|"bidirectional"|"sync")
        sync_both
        ;;
    *)
        echo "Usage: $0 [to-automation|from-automation|both]"
        echo ""
        echo "  to-automation   - Copy FROM real Firefox TO automation profile"
        echo "  from-automation - Copy FROM automation TO real Firefox"
        echo "  both           - Smart sync (default, syncs newer to older)"
        echo ""
        exit 1
        ;;
esac
