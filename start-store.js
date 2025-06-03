// Script to start the Yona Women's Fashion E-commerce platform
console.log('Starting Yona Women\'s Fashion E-commerce Platform...');
const { spawn } = require('child_process');

// Run the development server
const process = spawn('npx', ['tsx', 'server/index.ts'], {
  env: { ...process.env, NODE_ENV: 'development', PORT: '3000' },
  stdio: 'inherit'
});

process.on('close', (code) => {
  console.log(`Yona server exited with code ${code}`);
});

// Keep the process running
process.on('error', (err) => {
  console.error('Failed to start Yona server:', err);
});