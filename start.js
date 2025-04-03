const { spawn } = require('child_process');
const fs = require('fs');

// Function to start the bot
function startBot() {
  console.log('Starting Queen Anju Bot...');
  
  // Create a child process to run the main bot script
  const bot = spawn('node', ['queen.js'], {
    stdio: 'inherit'
  });
  
  // Handle bot process exit
  bot.on('exit', (code, signal) => {
    if (code === 1 || signal) {
      console.log(`Bot process exited with code ${code} and signal ${signal}`);
      console.log('Waiting 10 seconds before restarting...');
      
      // Clear session if it exists to prevent repeated auth failures
      try {
        if (fs.existsSync('./session')) {
          console.log('Clearing session directory...');
          fs.rmSync('./session', { recursive: true, force: true });
        }
      } catch (err) {
        console.error('Error clearing session:', err);
      }
      
      // Wait 10 seconds before restarting to avoid rapid restart loops
      setTimeout(startBot, 10000);
    }
  });
  
  // Handle unexpected errors
  bot.on('error', (err) => {
    console.error('Failed to start bot process:', err);
    console.log('Waiting 10 seconds before restarting...');
    setTimeout(startBot, 10000);
  });
}

// Start the bot initially
startBot();
