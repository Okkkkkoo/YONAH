// Script to start the Yona Women's Fashion E-commerce platform
console.log('Starting Yona Women\'s Fashion E-commerce Platform...');
import { spawn } from 'child_process';

// Run the development server
const serverProcess = spawn('npx', ['tsx', 'server/index.ts'], {
  env: { 
    ...process.env, 
    NODE_ENV: 'development', 
    PORT: '3000',
    DEBUG: 'express:*'  // Add debugging for more detailed logs
  },
  stdio: 'inherit'
});

serverProcess.on('close', (code) => {
  console.log(`Yona server exited with code ${code}`);
});

// Keep the process running
serverProcess.on('error', (err) => {
  console.error('Failed to start Yona server:', err);
});