
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Build the app
console.log('Building application...');
execSync('npm run build', { stdio: 'inherit' });

// Create static-build directory if it doesn't exist
if (!fs.existsSync('static-build')) {
  fs.mkdirSync('static-build');
}

// Copy files from dist to static-build
console.log('Copying built files...');
const distPath = path.join(__dirname, 'dist', 'public');
const assetsPath = path.join(distPath, 'assets');
const files = fs.readdirSync(assetsPath);

// Copy index.html
fs.copyFileSync(
  path.join(distPath, 'index.html'),
  path.join('static-build', 'index.html')
);

// Copy and rename the main JS and CSS files
files.forEach(file => {
  if (file.endsWith('.js')) {
    fs.copyFileSync(
      path.join(distPath, 'assets', file),
      path.join('static-build', 'app.js')
    );
  } else if (file.endsWith('.css')) {
    fs.copyFileSync(
      path.join(distPath, 'assets', file),
      path.join('static-build', 'styles.css')
    );
  }
});

console.log('Static build complete! Check the static-build directory.');
