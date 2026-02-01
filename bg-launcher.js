#!/usr/bin/env node
/**
 * Background Browser Launcher
 * Launches browser in background without blocking the terminal
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const SCRIPT_DIR = __dirname;
const LOG_FILE = '/tmp/browser-automation.log';
const PID_FILE = '/tmp/browser-automation.pid';

function startBackground(scriptName = 'commander.js', args = []) {
  console.log('🚀 Starting browser in background...');
  console.log(`📄 Script: ${scriptName}`);
  console.log(`📝 Log file: ${LOG_FILE}`);
  console.log(`🆔 PID file: ${PID_FILE}`);
  
  const scriptPath = path.join(SCRIPT_DIR, scriptName);
  
  // Spawn detached process
  const child = spawn('node', [scriptPath, ...args], {
    detached: true,
    stdio: ['ignore', 'pipe', 'pipe'],
    env: {
      ...process.env,
      DISPLAY: ':1'
    },
    cwd: SCRIPT_DIR
  });

  // Save PID
  fs.writeFileSync(PID_FILE, child.pid.toString());
  
  // Pipe output to log file
  const logStream = fs.createWriteStream(LOG_FILE, { flags: 'a' });
  child.stdout.pipe(logStream);
  child.stderr.pipe(logStream);
  
  child.unref(); // Allow parent to exit independently
  
  console.log(`✅ Browser started with PID: ${child.pid}`);
  console.log('');
  console.log('📋 Useful commands:');
  console.log(`   View logs: tail -f ${LOG_FILE}`);
  console.log(`   Check status: ps -p $(cat ${PID_FILE})`);
  console.log(`   Kill process: kill $(cat ${PID_FILE})`);
  console.log('');
  console.log('🎉 Browser is running in background!');
  
  // Give it a moment to start
  setTimeout(() => {
    process.exit(0);
  }, 1000);
}

function stopBackground() {
  if (!fs.existsSync(PID_FILE)) {
    console.log('⚠️  No PID file found. Browser may not be running.');
    return;
  }
  
  const pid = fs.readFileSync(PID_FILE, 'utf8').trim();
  console.log(`🛑 Stopping browser (PID: ${pid})...`);
  
  try {
    process.kill(pid, 'SIGTERM');
    fs.unlinkSync(PID_FILE);
    console.log('✅ Browser stopped');
  } catch (error) {
    console.error('❌ Error stopping browser:', error.message);
    console.log('💡 Try: pkill -f "node.*commander.js"');
  }
}

function status() {
  if (!fs.existsSync(PID_FILE)) {
    console.log('❌ Browser is not running (no PID file)');
    return;
  }
  
  const pid = fs.readFileSync(PID_FILE, 'utf8').trim();
  
  try {
    process.kill(pid, 0); // Check if process exists
    console.log(`✅ Browser is running (PID: ${pid})`);
    console.log(`📝 Log file: ${LOG_FILE}`);
    console.log('');
    console.log('Recent logs:');
    console.log('─'.repeat(60));
    if (fs.existsSync(LOG_FILE)) {
      const { execSync } = require('child_process');
      const logs = execSync(`tail -n 20 ${LOG_FILE}`).toString();
      console.log(logs);
    }
  } catch (error) {
    console.log(`⚠️  PID ${pid} exists but process is not running`);
    fs.unlinkSync(PID_FILE);
  }
}

// CLI
const command = process.argv[2] || 'start';

switch (command) {
  case 'start':
    startBackground('commander.js', process.argv.slice(3));
    break;
  case 'stop':
    stopBackground();
    break;
  case 'status':
    status();
    break;
  case 'restart':
    stopBackground();
    setTimeout(() => startBackground('commander.js'), 1000);
    break;
  case 'vnc-test':
    startBackground('vnc-test.js');
    break;
  default:
    console.log('Usage: node bg-launcher.js [start|stop|status|restart|vnc-test]');
}
