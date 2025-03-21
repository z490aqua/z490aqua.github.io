import { useRef, useEffect } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { GameEngine } from './GameEngine';

interface GameCanvasProps {
  width: number;
  height: number;
}

export default function GameCanvas({ width, height }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameEngineRef = useRef<GameEngine | null>(null);
  const { 
    gameState,
    currentLevel,
    isGamePaused,
    setLevelComplete,
    playerPowers,
    collectedDocuments,
    updateCollectedDocuments
  } = useGameState();

  // Initialize game engine
  useEffect(() => {
    if (!canvasRef.current || !currentLevel) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Create and store the game engine instance
    gameEngineRef.current = new GameEngine(
      canvas, 
      ctx, 
      currentLevel, 
      playerPowers,
      collectedDocuments,
      (documentId) => {
        updateCollectedDocuments(documentId);
      },
      () => {
        setLevelComplete(true);
      }
    );
    
    // Expose game engine instance globally
    window.gameEngine = gameEngineRef.current;

    // Reset the game engine timer when re-creating the game engine
    if (gameEngineRef.current) {
      gameEngineRef.current.resetTimer();
    }
    
    // Start the game loop with a single animation frame request ID
    let animationFrameId: number;
    
    const gameLoop = () => {
      if (gameEngineRef.current && !isGamePaused) {
        gameEngineRef.current.update();
        gameEngineRef.current.render();
      }
      animationFrameId = requestAnimationFrame(gameLoop);
    };
    
    animationFrameId = requestAnimationFrame(gameLoop);

    // Clean up
    return () => {
      // Cancel the animation frame to prevent multiple loops
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (gameEngineRef.current) {
        gameEngineRef.current.cleanup();
      }
    };
  }, [currentLevel, isGamePaused]);

  // Resize the canvas when the window size changes
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && gameEngineRef.current) {
        canvasRef.current.width = width;
        canvasRef.current.height = height;
        gameEngineRef.current.handleResize(width, height);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [width, height]);

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameEngineRef.current && !isGamePaused) {
        switch (e.key) {
          case 'ArrowLeft':
          case 'a':
          case 'A':
            gameEngineRef.current.setPlayerMovement('left', true);
            break;
          case 'ArrowRight':
          case 'd':
          case 'D':
            gameEngineRef.current.setPlayerMovement('right', true);
            break;
          case 'ArrowUp':
          case 'w':
          case 'W':
          case ' ':
            gameEngineRef.current.setPlayerMovement('jump', true);
            break;
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (gameEngineRef.current) {
        switch (e.key) {
          case 'ArrowLeft':
          case 'a':
          case 'A':
            gameEngineRef.current.setPlayerMovement('left', false);
            break;
          case 'ArrowRight':
          case 'd':
          case 'D':
            gameEngineRef.current.setPlayerMovement('right', false);
            break;
          case 'ArrowUp':
          case 'w':
          case 'W':
          case ' ':
            gameEngineRef.current.setPlayerMovement('jump', false);
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isGamePaused]);

  // Expose methods to control the player from external components (like touch controls)
  useEffect(() => {
    if (gameEngineRef.current) {
      window.gameControls = {
        moveLeft: (active: boolean) => {
          if (gameEngineRef.current && !isGamePaused) {
            gameEngineRef.current.setPlayerMovement('left', active);
          }
        },
        moveRight: (active: boolean) => {
          if (gameEngineRef.current && !isGamePaused) {
            gameEngineRef.current.setPlayerMovement('right', active);
          }
        },
        jump: (active: boolean) => {
          if (gameEngineRef.current && !isGamePaused) {
            gameEngineRef.current.setPlayerMovement('jump', active);
          }
        }
      };
    }

    return () => {
      window.gameControls = undefined;
    };
  }, [isGamePaused]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="w-full h-full bg-[#87CEEB]"
    />
  );
}

// This declaration is now handled in queryClient.ts where we already declare the global Window interface
// Kept here for reference but the actual types are in queryClient.ts
/*
declare global {
  interface Window {
    // These declarations are now in queryClient.ts to avoid duplicate declarations
    // gameControls?: {
    //   moveLeft: (active: boolean) => void;
    //   moveRight: (active: boolean) => void;
    //   jump: (active: boolean) => void;
    // };
    // gameEngine?: GameEngine;
  }
}
*/
