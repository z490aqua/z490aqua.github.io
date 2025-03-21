# The Bala - Balance of Powers Game

A web-based educational platformer game about the balance of power between US government branches.

## Project Overview

"The Bala" is an educational platformer game where players navigate through levels collecting documents while avoiding obstacles. Each document contains information about the US government's system of checks and balances.

## Features

- Multiple game levels with increasing difficulty
- Document collection system with educational content
- Special powers that unlock as players progress
- Responsive controls for desktop and mobile devices
- Save game progress and high scores
- Pause menu with document viewer

## Game Controls

- **Move Left**: Left Arrow or A
- **Move Right**: Right Arrow or D
- **Jump**: Space bar or W or Up Arrow
- **Pause Game**: Escape key

## Development Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

The game uses:
- React with TypeScript for UI
- Vite for bundling and development
- Express server for backend
- In-memory storage for game data

## Building for Production

### Static Site Build (No Backend Required)

To build a standalone version of the game that can be deployed to any static hosting:

```bash
node build.js --production
```

This will:
1. Build the frontend using Vite
2. Create a static version that works without a backend 
3. Generate files in the `dist/` folder ready for deployment

### Deployment Options

The static build can be deployed to:

- **Netlify**: Drag and drop the `dist/` folder
- **Vercel**: Use the Vercel CLI or connect your GitHub repository 
- **GitHub Pages**: Copy the `dist/` contents to your gh-pages branch
- **Any Static Host**: Upload the files to any static web hosting

To test locally after building:

```bash
cd dist
npm install express
node server.js
```

Then open http://localhost:3000 in your browser.

## Project Structure

- `client/`: Frontend React application
  - `src/components/`: UI components
  - `src/game/`: Game engine and mechanics
  - `src/context/`: React context providers
  - `src/hooks/`: Custom React hooks
  - `src/utils/`: Utility functions
- `server/`: Backend Express server
- `shared/`: Shared code (schemas, types)
- `build.js`: Build script for production
- `static-build.js`: Alternative build script for static deployment

## Credits

Created as an educational game about the US government's system of checks and balances.