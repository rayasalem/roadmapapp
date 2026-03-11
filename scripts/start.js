#!/usr/bin/env node
/**
 * Single entry for "npm start". On Render (production + dist exists) serve dist; otherwise run Expo dev.
 */
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

const isProduction = process.env.NODE_ENV === 'production';
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const distExists = fs.existsSync(distDir) && fs.statSync(distDir).isDirectory();

if (isProduction && !distExists) {
  console.error('ERROR: In production, "dist" folder is missing. Run: npm install && npm run build');
  process.exit(1);
}

if (isProduction && distExists) {
  try {
    require(path.join(rootDir, 'server.js'));
  } catch (err) {
    console.error('ERROR starting server:', err && err.message ? err.message : err);
    process.exit(1);
  }
  return;
}

const expoCli = path.join(rootDir, 'node_modules', 'expo', 'bin', 'cli');
if (!fs.existsSync(expoCli)) {
  console.error('ERROR: Expo CLI not found. Run: npm install');
  process.exit(1);
}

const child = spawn('node', [expoCli, 'start'], {
  stdio: 'inherit',
  cwd: rootDir,
  shell: process.platform === 'win32',
});
child.on('error', (err) => {
  console.error('ERROR starting Expo:', err && err.message ? err.message : err);
  process.exit(1);
});
child.on('exit', (code, signal) => {
  process.exit(code != null ? code : signal ? 1 : 0);
});
