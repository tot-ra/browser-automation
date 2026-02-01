#!/usr/bin/env node
/**
 * Configure browser to use real Firefox profile
 * Run this once to switch to your actual Firefox profile
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const sessionFile = path.join(__dirname, 'session.json');
const realProfile = path.join(os.homedir(), '.mozilla/firefox/1sn3zs0y.default-release');

console.log('🔧 Configuring browser to use your real Firefox profile...');
console.log('');
console.log('Real profile path:', realProfile);
console.log('');

// Check if profile exists
if (!fs.existsSync(realProfile)) {
  console.error('❌ Profile not found:', realProfile);
  console.log('');
  console.log('Available profiles:');
  const firefoxDir = path.join(os.homedir(), '.mozilla/firefox');
  if (fs.existsSync(firefoxDir)) {
    fs.readdirSync(firefoxDir).forEach(file => {
      const fullPath = path.join(firefoxDir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        console.log('  -', file);
      }
    });
  }
  process.exit(1);
}

// Create/update session.json
const session = {
  profilePath: realProfile,
  timestamp: new Date().toISOString(),
  active: false,
  note: "Using real Firefox profile - all sessions, passwords, and cookies are shared"
};

fs.writeFileSync(sessionFile, JSON.stringify(session, null, 2));
console.log('✅ Configuration updated!');
console.log('');
console.log('Session file:', sessionFile);
console.log('');
console.log('⚠️  IMPORTANT:');
console.log('   - This profile contains your real passwords and sessions');
console.log('   - Changes in automated browser will affect your regular Firefox');
console.log('   - Facebook login should now work automatically');
console.log('');
console.log('🚀 You can now run:');
console.log('   node facebook-events.js');
console.log('');
