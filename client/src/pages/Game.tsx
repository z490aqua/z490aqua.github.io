import { useEffect, useState, useRef } from 'react';
import { initGameEngine, GameState } from '@/game/engine';
import MainMenu from '@/components/MainMenu';
import GameUI from '@/components/GameUI';
import PauseMenu from '@/components/PauseMenu';
import DocumentViewer from '@/components/DocumentViewer';
import LevelComplete from '@/components/LevelComplete';

export default function Game() {
  const [gameState, setGameState] = useState<GameState>('MAIN_MENU');
  const [currentLevel, setCurrentLevel] = useState(1);
  const [documentProgress, setDocumentProgress] = useState(0);
  const [totalDocuments, setTotalDocuments] = useState(9);
  const [currentPower, setCurrentPower] = useState('');
  const [unlockedDocuments, setUnlockedDocuments] = useState<string[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameEngineRef = useRef<ReturnType<typeof initGameEngine> | null>(null);
  const previousStateRef = useRef<GameState>('MAIN_MENU');

  // Initialize game engine
  useEffect(() => {
    if (canvasRef.current && gameState === 'PLAYING') {
      const engine = initGameEngine(canvasRef.current, {
        level: currentLevel,
        onDocumentCollected: (documentId) => {
          setDocumentProgress(prev => prev + 1);
          setUnlockedDocuments(prev => [...prev, documentId]);
          setCurrentPower(getDocumentPower(documentId));
        },
        onLevelComplete: () => {
          previousStateRef.current = gameState;
          setGameState('LEVEL_COMPLETE');
        }
      });
      
      gameEngineRef.current = engine;
      
      return () => {
        engine.destroy();
      };
    }
  }, [gameState, currentLevel]);

  // Check for saved game on initial load
  useEffect(() => {
    const savedGame = localStorage.getItem('balanceOfPowerSave');
    if (savedGame) {
      try {
        const { level, documents } = JSON.parse(savedGame);
        setCurrentLevel(level);
        setDocumentProgress(documents.length);
        setUnlockedDocuments(documents);
        if (documents.length > 0) {
          setCurrentPower(getDocumentPower(documents[documents.length - 1]));
        }
      } catch (e) {
        console.error('Failed to load saved game:', e);
      }
    }
  }, []);

  // Save game progress when documents are collected
  useEffect(() => {
    if (unlockedDocuments.length > 0) {
      localStorage.setItem('balanceOfPowerSave', JSON.stringify({
        level: currentLevel,
        documents: unlockedDocuments
      }));
    }
  }, [unlockedDocuments, currentLevel]);

  const getDocumentPower = (documentId: string): string => {
    const powers: Record<string, string> = {
      'constitution': 'BILL PASSAGE',
      'federalist-10': 'FILIBUSTER BLOCK',
      'federalist-51': 'CHECKS & BALANCES',
      'brutus-1': 'STATE POWER',
      'articles': 'CONFEDERATION',
      'bill-of-rights': 'CIVIL LIBERTIES',
      'declaration': 'INDEPENDENCE',
      'federalist-70': 'LEADERSHIP',
      'letter-birmingham': 'CIVIL DISOBEDIENCE'
    };
    
    return powers[documentId] || '';
  };

  const startNewGame = () => {
    setCurrentLevel(1);
    setDocumentProgress(0);
    setUnlockedDocuments([]);
    setCurrentPower('');
    localStorage.removeItem('balanceOfPowerSave');
    setGameState('PLAYING');
  };

  const continueGame = () => {
    setGameState('PLAYING');
  };

  const pauseGame = () => {
    previousStateRef.current = gameState;
    setGameState('PAUSED');
    if (gameEngineRef.current) {
      gameEngineRef.current.pause();
    }
  };

  const resumeGame = () => {
    setGameState('PLAYING');
    if (gameEngineRef.current) {
      gameEngineRef.current.resume();
    }
  };

  const restartLevel = () => {
    setGameState('PLAYING');
    if (gameEngineRef.current) {
      gameEngineRef.current.restart();
    }
  };

  const showDocuments = () => {
    previousStateRef.current = gameState;
    setGameState('DOCUMENTS');
  };

  const closeDocuments = () => {
    setGameState(previousStateRef.current);
  };

  const goToNextLevel = () => {
    setCurrentLevel(prev => prev + 1);
    setGameState('PLAYING');
  };

  const returnToMainMenu = () => {
    setGameState('MAIN_MENU');
    if (gameEngineRef.current) {
      gameEngineRef.current.pause();
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#1A2E55]">
      {/* Game Screen with Canvas */}
      <div className={`relative w-full h-screen ${gameState === 'PLAYING' ? 'block' : 'hidden'}`}>
        {/* Parallax Background Layers */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 parallax-layer-3" style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?q=80&w=1470&auto=format&fit=crop')",
            backgroundSize: "1920px 100%", 
            zIndex: 1, 
            opacity: 0.3
          }}></div>
          <div className="absolute inset-0 parallax-layer-2" style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1501594907352-04cda38ebc29?q=80&w=1632&auto=format&fit=crop')",
            backgroundSize: "1920px 100%", 
            zIndex: 2, 
            opacity: 0.2
          }}></div>
          <div className="absolute inset-0 parallax-layer-1" style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1578922746465-3a80a228f223?q=80&w=1470&auto=format&fit=crop')",
            backgroundSize: "1920px 100%", 
            zIndex: 3, 
            opacity: 0.15
          }}></div>
        </div>
        
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full bg-[#87CEEB]"
        />
        
        {/* Retro Screen Overlay Effect */}
        <div className="screen-overlay absolute inset-0 z-10 pointer-events-none"></div>
        
        {/* Game UI Overlay */}
        <GameUI 
          level={currentLevel}
          documentProgress={documentProgress}
          totalDocuments={totalDocuments}
          currentPower={currentPower}
          onPause={pauseGame}
        />
      </div>

      {/* Main Menu */}
      {gameState === 'MAIN_MENU' && (
        <MainMenu 
          onStartNewGame={startNewGame}
          onContinueGame={continueGame}
          onShowDocuments={showDocuments}
          hasSavedGame={unlockedDocuments.length > 0}
        />
      )}

      {/* Pause Menu */}
      {gameState === 'PAUSED' && (
        <PauseMenu 
          onResume={resumeGame}
          onRestart={restartLevel}
          onShowDocuments={showDocuments}
          onMainMenu={returnToMainMenu}
        />
      )}

      {/* Document Viewer */}
      {gameState === 'DOCUMENTS' && (
        <DocumentViewer
          unlockedDocuments={unlockedDocuments}
          onClose={closeDocuments}
          selectedDocument={selectedDocument}
          onSelectDocument={setSelectedDocument}
        />
      )}

      {/* Level Complete */}
      {gameState === 'LEVEL_COMPLETE' && (
        <LevelComplete
          level={currentLevel}
          unlockedDocument={unlockedDocuments[unlockedDocuments.length - 1]}
          onViewDocument={() => {
            setSelectedDocument(unlockedDocuments[unlockedDocuments.length - 1]);
            showDocuments();
          }}
          onNextLevel={goToNextLevel}
        />
      )}
      
      <style jsx>{`
        .screen-overlay {
          background: linear-gradient(
              rgba(0,0,0,0) 50%, 
              rgba(0,0,0,0.1) 50%
          ), linear-gradient(
              90deg,
              rgba(255,0,0,0.03),
              rgba(0,255,0,0.03),
              rgba(0,0,255,0.03)
          );
          background-size: 100% 2px, 3px 100%;
        }
        
        @keyframes parallaxScroll1 {
          0% { background-position: 0px 0px; }
          100% { background-position: -1920px 0px; }
        }
        @keyframes parallaxScroll2 {
          0% { background-position: 0px 0px; }
          100% { background-position: -1920px 0px; }
        }
        @keyframes parallaxScroll3 {
          0% { background-position: 0px 0px; }
          100% { background-position: -1920px 0px; }
        }
        
        .parallax-layer-1 {
          animation: parallaxScroll1 20s linear infinite;
        }
        .parallax-layer-2 {
          animation: parallaxScroll2 30s linear infinite;
        }
        .parallax-layer-3 {
          animation: parallaxScroll3 60s linear infinite;
        }
      `}</style>
    </div>
  );
}
