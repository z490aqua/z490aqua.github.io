const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🎮 The Bala - Static Build Generator 🎮');
console.log('-------------------------------------');

// Step 1: Build the frontend
console.log('\n📦 Building the frontend...');
try {
  execSync('npx vite build', { stdio: 'inherit' });
  console.log('✅ Frontend build successful!');
} catch (error) {
  console.error('❌ Frontend build failed:', error.message);
  process.exit(1);
}

// Step 2: Create a custom index.html that loads the bundled JavaScript
console.log('\n📄 Creating static index.html...');
const indexHtmlPath = path.join(__dirname, 'dist', 'index.html');
const staticIndexHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>The Bala - Balance of Powers Game</title>
    <meta name="description" content="An educational platformer game about the balance of power between US government branches">
    <link rel="stylesheet" href="./assets/index.css">
  </head>
  <body>
    <div id="root"></div>
    <script>
      // Initialize static game data
      window.__GAME_DATA__ = {
        isStatic: true,
        created: "${new Date().toISOString()}"
      };
    </script>
    <script type="module" src="./assets/index.js"></script>
  </body>
</html>`;

try {
  fs.writeFileSync(indexHtmlPath, staticIndexHtml);
  console.log('✅ Static index.html created!');
} catch (error) {
  console.error('❌ Failed to create static index.html:', error.message);
}

// Step 3: Create a README.md with deployment instructions
console.log('\n📝 Creating README.md with deployment instructions...');
const readmePath = path.join(__dirname, 'dist', 'README.md');
const readmeContent = `# The Bala - Balance of Powers Game

## About
This is a web-based educational platformer game about the balance of power between US government branches.

## How to Deploy

### Local Deployment
1. Install [Node.js](https://nodejs.org/)
2. Run \`npm install express\` to install the server dependency
3. Run \`node server.js\` to start the local server
4. Open your browser and navigate to \`http://localhost:3000\`

### Online Deployment
You can deploy this game to any static web hosting service:

- **Netlify**: Drag and drop this folder to deploy
- **Vercel**: Use the Vercel CLI or connect your GitHub repository
- **GitHub Pages**: Copy these files to your gh-pages branch

## Game Controls
- Arrow keys or WASD to move
- Space bar to jump
- ESC to pause the game
- Collect documents to unlock special powers

## Credits
Created as an educational game about the US government's system of checks and balances.`;

try {
  fs.writeFileSync(readmePath, readmeContent);
  console.log('✅ README.md created!');
} catch (error) {
  console.error('❌ Failed to create README.md:', error.message);
}

// Step 4: Copy the server.js to the dist folder
console.log('\n📂 Copying server.js to dist folder...');
const serverJsPath = path.join(__dirname, 'server.js');
const distServerJsPath = path.join(__dirname, 'dist', 'server.js');

try {
  const serverJs = fs.readFileSync(serverJsPath, 'utf8');
  // Adjust paths for the dist folder
  const modifiedServerJs = serverJs
    .replace('dist/public', '.')
    .replace('dist/public/index.html', './index.html');
  fs.writeFileSync(distServerJsPath, modifiedServerJs);
  console.log('✅ server.js copied to dist folder!');
} catch (error) {
  console.error('❌ Failed to copy server.js:', error.message);
}

console.log('\n🎉 Static build completed successfully! 🎉');
console.log('\nYour game is ready for deployment in the dist/ folder.');
console.log('To test locally:');
console.log('1. cd dist');
console.log('2. npm install express');
console.log('3. node server.js');
console.log('\nEnjoy your game!');