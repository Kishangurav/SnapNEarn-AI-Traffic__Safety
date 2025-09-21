const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Building SnapNEarn for Web...');

try {
  // Build for web
  console.log('📦 Building Expo web bundle...');
  execSync('npx expo export:web', { stdio: 'inherit', cwd: __dirname });
  
  console.log('✅ Build completed successfully!');
  console.log('🌐 You can now serve the web-build directory');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
