const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🎮 The Bala - Build Process 🎮');
console.log('------------------------------');

// Determine if we're building for development or production
const isProduction = process.argv.includes('--production');
console.log(`Building for ${isProduction ? 'production' : 'development'}...\n`);

// Step 1: Build the frontend using Vite
console.log('📦 Building frontend with Vite...');
try {
  if (isProduction) {
    execSync('npx vite build', { stdio: 'inherit' });
  } else {
    execSync('npx vite build', { stdio: 'inherit' });
  }
  console.log('✅ Frontend build successful!');
} catch (error) {
  console.error('❌ Frontend build failed:', error);
  process.exit(1);
}

// Step 2: Create a production index.html if building for production
if (isProduction) {
  console.log('\n📄 Creating production index.html...');
  const distFolder = path.join(__dirname, 'dist');
  const indexPath = path.join(distFolder, 'index.html');
  
  const indexHtml = `<!DOCTYPE html>
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
      // Initialize static game data for production
      window.__GAME_DATA__ = {
        isStatic: true,
        created: "${new Date().toISOString()}"
      };
    </script>
    <script type="module" src="./assets/index.js"></script>
  </body>
</html>`;

  try {
    // Make sure the dist directory exists
    if (!fs.existsSync(distFolder)) {
      fs.mkdirSync(distFolder, { recursive: true });
    }
    fs.writeFileSync(indexPath, indexHtml);
    console.log('✅ Production index.html created!');
  } catch (error) {
    console.error('❌ Failed to create production index.html:', error);
  }

  // Step 3: Create a server.js file for easy deployment
  console.log('\n📄 Creating server.js for production deployment...');
  const serverJs = `const express = require('express');
const path = require('path');
const app = express();

// Serve static files from current directory
app.use(express.static(__dirname));

// For any other routes, serve the index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`The Bala game is running on port \${PORT}\`);
  console.log(\`Open your browser and navigate to http://localhost:\${PORT}\`);
});
`;

  const serverJsPath = path.join(distFolder, 'server.js');
  try {
    fs.writeFileSync(serverJsPath, serverJs);
    console.log('✅ Production server.js created!');
  } catch (error) {
    console.error('❌ Failed to create production server.js:', error);
  }

  // Step 4: Create a README file for deployment instructions
  console.log('\n📄 Creating README.md with deployment instructions...');
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
Created as an educational game about the US government's system of checks and balances.
`;

  const readmePath = path.join(distFolder, 'README.md');
  try {
    fs.writeFileSync(readmePath, readmeContent);
    console.log('✅ README.md created!');
  } catch (error) {
    console.error('❌ Failed to create README.md:', error);
  }
}

console.log('\n🎉 Build complete! 🎉');

if (isProduction) {
  console.log('\nYour game is ready for deployment in the dist/ folder.');
  console.log('To test locally:');
  console.log('1. cd dist');
  console.log('2. npm install express');
  console.log('3. node server.js');
} else {
  console.log('\nFor development:');
  console.log('1. Run "npm run dev" to start the development server');
  console.log('\nFor production:');
  console.log('1. Run "node build.js --production" to create a production build');
}

console.log('\nEnjoy your game!');