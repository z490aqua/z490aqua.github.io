import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Build location
const distDir = path.resolve(__dirname, 'dist/public');
const staticDir = path.resolve(__dirname, 'dist-static');

// Ensure dist-static directory exists
if (!fs.existsSync(staticDir)) {
  fs.mkdirSync(staticDir);
}

// Run the standard build first
console.log('Running standard Vite build...');
execSync('npm run build', { stdio: 'inherit' });

console.log('Creating optimized static build...');

// Create a single CSS file from all CSS
function combineCssFiles() {
  console.log('Combining CSS files...');
  
  // Get all CSS files in assets
  const cssDir = path.join(distDir, 'assets');
  const cssFiles = fs.readdirSync(cssDir)
    .filter(file => file.endsWith('.css'))
    .map(file => path.join(cssDir, file));
  
  // Combine all CSS files into one
  let combinedCSS = '';
  cssFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    combinedCSS += content + '\n';
  });
  
  // Write to output file
  fs.writeFileSync(path.join(staticDir, 'styles.css'), combinedCSS);
  console.log(`Created styles.css (${Math.round(combinedCSS.length / 1024)}KB)`);
}

// Combine all JS files into one
function combineJsFiles() {
  console.log('Combining JS files...');
  
  // Get the main JS file (the entry point)
  const jsDir = path.join(distDir, 'assets');
  const jsFiles = fs.readdirSync(jsDir)
    .filter(file => file.endsWith('.js'))
    .map(file => path.join(jsDir, file));
  
  // Combine all JS files into one
  let combinedJS = '';
  jsFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    combinedJS += content + '\n';
  });
  
  // Write to output file
  fs.writeFileSync(path.join(staticDir, 'app.js'), combinedJS);
  console.log(`Created app.js (${Math.round(combinedJS.length / 1024)}KB)`);
}

// Update HTML file to reference the new consolidated files
function updateHTML() {
  console.log('Creating optimized HTML...');
  
  const htmlPath = path.join(distDir, 'index.html');
  let html = fs.readFileSync(htmlPath, 'utf8');
  
  // Replace CSS link tags
  html = html.replace(
    /<link rel="stylesheet"[^>]+>/g,
    '<link rel="stylesheet" href="./styles.css">'
  );
  
  // Replace script tags
  html = html.replace(
    /<script[^>]+src="\/assets\/[^"]+\.js"[^>]*><\/script>/g,
    '<script src="./app.js"></script>'
  );
  
  // Remove prefetch/preload tags
  html = html.replace(/<link rel="modulepreload[^>]+>/g, '');
  
  // Write the updated HTML file
  fs.writeFileSync(path.join(staticDir, 'index.html'), html);
  console.log(`Created index.html (${Math.round(html.length / 1024)}KB)`);
}

// Run the build process
combineCssFiles();
combineJsFiles();
updateHTML();

// Add game data to the HTML file
function addGameData() {
  console.log('Adding game data to the HTML file...');
  
  const htmlPath = path.join(staticDir, 'index.html');
  let html = fs.readFileSync(htmlPath, 'utf8');
  
  // Add a script to load game data before the app.js script
  const gameDataScript = `
  <script>
    // Initialize game data for the static build
    window.__GAME_DATA__ = {
      isStatic: true,
      created: "${new Date().toISOString()}"
    };
  </script>
  `;
  
  // Insert the game data script before the app.js script
  html = html.replace(
    '<script src="./app.js"></script>',
    `${gameDataScript}\n    <script src="./app.js"></script>`
  );
  
  // Write the updated HTML file
  fs.writeFileSync(htmlPath, html);
  console.log('Game data added to index.html');
}

// Execute additional steps
addGameData();

console.log('\nStatic build complete! Files created in dist-static/');
console.log('- index.html');
console.log('- styles.css');
console.log('- app.js');