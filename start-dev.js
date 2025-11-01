const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Cherish India E-commerce Platform...\n');

// Start backend
console.log('📦 Starting backend server...');
const backend = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, 'backend'),
  stdio: 'pipe',
  shell: true
});

backend.stdout.on('data', (data) => {
  console.log(`[Backend] ${data.toString().trim()}`);
});

backend.stderr.on('data', (data) => {
  console.error(`[Backend Error] ${data.toString().trim()}`);
});

// Start frontend after a short delay
setTimeout(() => {
  console.log('\n🎨 Starting frontend server...');
  const frontend = spawn('npm', ['start'], {
    cwd: path.join(__dirname, 'frontend'),
    stdio: 'pipe',
    shell: true
  });

  frontend.stdout.on('data', (data) => {
    console.log(`[Frontend] ${data.toString().trim()}`);
  });

  frontend.stderr.on('data', (data) => {
    console.error(`[Frontend Error] ${data.toString().trim()}`);
  });

  // Handle process termination
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down servers...');
    backend.kill();
    frontend.kill();
    process.exit(0);
  });

}, 3000);

console.log('\n✨ Both servers are starting up...');
console.log('📱 Frontend will be available at: http://localhost:3000');
console.log('🔧 Backend API will be available at: http://localhost:5000');
console.log('\nPress Ctrl+C to stop both servers');
