import Matter from 'matter-js';
import { createPlayer } from './player';
import { loadLevel } from './levels';
import { setupControls } from './controls';
import { createObstacles } from './obstacles';
import { placeDocuments, checkDocumentCollision } from './documents';
import { setupAudio } from './audio';

export type GameState = 'MAIN_MENU' | 'PLAYING' | 'PAUSED' | 'DOCUMENTS' | 'LEVEL_COMPLETE';

export interface GameOptions {
  level: number;
  onDocumentCollected: (documentId: string) => void;
  onLevelComplete: () => void;
}

export const initGameEngine = (canvas: HTMLCanvasElement, options: GameOptions) => {
  // Initialize Matter.js engine
  const engine = Matter.Engine.create({ 
    gravity: { x: 0, y: 1, scale: 0.001 } 
  });
  const world = engine.world;
  const render = Matter.Render.create({
    canvas: canvas,
    engine: engine,
    options: {
      width: canvas.width,
      height: canvas.height,
      wireframes: false,
      background: 'transparent'
    }
  });

  // Setup game elements
  const { player, playerBody } = createPlayer(world, canvas.width, canvas.height);
  const { platforms, walls, exit } = loadLevel(world, options.level, canvas.width, canvas.height);
  const obstacles = createObstacles(world, options.level, canvas.width, canvas.height);
  const documents = placeDocuments(world, options.level, canvas.width, canvas.height);
  const controls = setupControls(player);
  const audio = setupAudio();

  // Game state
  let paused = false;
  let gameLoop: number;
  
  // Handle window resizing
  const handleResize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    render.options.width = canvas.width;
    render.options.height = canvas.height;
    
    // Reposition game elements
    Matter.Body.setPosition(walls.left, { 
      x: -50, 
      y: canvas.height / 2 
    });
    Matter.Body.setPosition(walls.right, { 
      x: canvas.width + 50, 
      y: canvas.height / 2 
    });
    Matter.Body.setPosition(walls.top, { 
      x: canvas.width / 2, 
      y: -50 
    });
    Matter.Body.setPosition(walls.bottom, { 
      x: canvas.width / 2, 
      y: canvas.height + 50 
    });
  };

  window.addEventListener('resize', handleResize);
  handleResize();

  // Start game loop
  const startGameLoop = () => {
    let lastTime = 0;
    
    const gameUpdate = (timestamp: number) => {
      if (paused) return;
      
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;
      
      // Update player
      player.update(deltaTime);
      
      // Check for document collisions
      documents.forEach((doc, index) => {
        if (doc.collected) return;
        
        if (checkDocumentCollision(playerBody, doc.body)) {
          doc.collected = true;
          Matter.World.remove(world, doc.body);
          audio.playCollect();
          options.onDocumentCollected(doc.id);
        }
      });
      
      // Check for level exit
      if (Matter.SAT.collides(playerBody, exit).collided) {
        options.onLevelComplete();
        pauseGame();
      }
      
      // Check for obstacle interactions
      obstacles.forEach(obstacle => {
        obstacle.update(playerBody, deltaTime);
      });
      
      // Update physics
      Matter.Engine.update(engine, deltaTime);
      
      // Render scene
      Matter.Render.world(render);
      
      // Request next frame
      gameLoop = requestAnimationFrame(gameUpdate);
    };
    
    gameLoop = requestAnimationFrame(gameUpdate);
  };

  // Start rendering and physics
  Matter.Render.run(render);
  startGameLoop();
  
  // Play background music
  audio.playMusic();

  // Public methods
  const pauseGame = () => {
    paused = true;
    audio.pauseMusic();
    cancelAnimationFrame(gameLoop);
  };
  
  const resumeGame = () => {
    paused = false;
    audio.resumeMusic();
    startGameLoop();
  };
  
  const restartLevel = () => {
    // Remove all bodies
    Matter.World.clear(world, false);
    
    // Reset level elements
    const { platforms: newPlatforms, walls: newWalls, exit: newExit } = 
      loadLevel(world, options.level, canvas.width, canvas.height);
    
    // Reset player
    const { player: newPlayer, playerBody: newPlayerBody } = 
      createPlayer(world, canvas.width, canvas.height);
    
    // Reset obstacles
    const newObstacles = createObstacles(world, options.level, canvas.width, canvas.height);
    
    // Reset documents
    const newDocuments = placeDocuments(world, options.level, canvas.width, canvas.height);
    
    // Update references
    Object.assign(player, newPlayer);
    Object.assign(playerBody, newPlayerBody);
    Object.assign(platforms, newPlatforms);
    Object.assign(walls, newWalls);
    Object.assign(exit, newExit);
    obstacles.length = 0;
    obstacles.push(...newObstacles);
    documents.length = 0;
    documents.push(...newDocuments);
    
    // Resume game
    resumeGame();
  };
  
  const destroy = () => {
    pauseGame();
    window.removeEventListener('resize', handleResize);
    controls.removeListeners();
    Matter.Render.stop(render);
    Matter.World.clear(world, false);
    Matter.Engine.clear(engine);
  };

  return {
    pause: pauseGame,
    resume: resumeGame,
    restart: restartLevel,
    destroy
  };
};
