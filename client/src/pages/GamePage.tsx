import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import GameCanvas from '@/components/game/GameCanvas';
import GameUI from '@/components/game/GameUI';
import GameControls from '@/components/game/GameControls';
import PauseMenu from '@/components/menus/PauseMenu';
import LevelComplete from '@/components/menus/LevelComplete';
import GameComplete from '@/components/menus/GameComplete';
import { useGameState } from '@/hooks/useGameState';

export default function GamePage() {
  const [location, navigate] = useLocation();
  const { gameState, isGamePaused, currentLevel, gameCompleted, gameTime, collectedDocuments } = useGameState();
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

  // Redirect to home if not playing
  useEffect(() => {
    if (!gameState.isPlaying) {
      navigate('/');
    }
  }, [gameState.isPlaying, navigate]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Handle escape key for pause
  const { setGamePaused } = useGameState();
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setGamePaused(!isGamePaused);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isGamePaused, setGamePaused]);

  if (!currentLevel) return null;

  return (
    <div id="game-screen" className="relative w-full h-screen">
      {/* Screen Overlay Effect */}
      <div className="screen-overlay absolute inset-0 z-10 pointer-events-none bg-blend-overlay" style={{
        background: `linear-gradient(rgba(0,0,0,0) 50%, rgba(0,0,0,0.1) 50%), 
          linear-gradient(90deg, rgba(255,0,0,0.03), rgba(0,255,0,0.03), rgba(0,0,255,0.03))`,
        backgroundSize: '100% 2px, 3px 100%'
      }}></div>
      
      {/* Game Canvas */}
      <GameCanvas
        width={dimensions.width}
        height={dimensions.height}
      />
      
      {/* Game UI Elements */}
      <GameUI />
      
      {/* Mobile Touch Controls */}
      <GameControls />
      
      {/* Pause Menu */}
      {isGamePaused && !gameCompleted && <PauseMenu />}
      
      {/* Level Complete Screen */}
      {gameState && gameState.showLevelComplete && !gameCompleted && <LevelComplete />}
      
      {/* Game Complete Screen */}
      {gameCompleted && <GameComplete gameTime={gameTime} collectedDocuments={collectedDocuments} />}
    </div>
  );
}
