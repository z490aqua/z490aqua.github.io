import { useGameState } from '@/hooks/useGameState';
import { useLocation } from 'wouter';
import DocumentViewer from './DocumentViewer';
import { useState, useCallback } from 'react';

export default function PauseMenu() {
  const [location, navigate] = useLocation();
  const { 
    restartLevel, 
    setGamePaused, 
    saveAndExitGame 
  } = useGameState();
  
  const [showDocuments, setShowDocuments] = useState(false);

  // Make sure to wrap handlers in useCallback to avoid function recreation on each render
  const handleResume = useCallback(() => {
    setGamePaused(false);
  }, [setGamePaused]);

  const handleRestart = useCallback(() => {
    // First pause the game, then reset timer flag in GameEngine to prevent double speed
    setGamePaused(false);
    
    // Call the game engine's resetTimer method
    if (typeof window !== 'undefined' && window.gameEngine) {
      window.gameEngine.resetTimer();
    }
    
    // Use setTimeout to ensure state updates before restarting
    setTimeout(() => {
      restartLevel();
    }, 50);
  }, [restartLevel, setGamePaused]);

  const handleViewDocuments = useCallback(() => {
    setShowDocuments(true);
  }, []);

  const handleMainMenu = useCallback(() => {
    saveAndExitGame();
    setGamePaused(false);
    navigate('/');
  }, [saveAndExitGame, setGamePaused, navigate]);

  const handleCloseDocuments = useCallback(() => {
    setShowDocuments(false);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A2E55]/80">
      <div className="bg-[#1A2E55] p-8 max-w-md w-full">
        <h2 className="font-[Press_Start_2P] text-[#F0F0E8] text-2xl mb-8 text-center">GAME PAUSED</h2>
        <div className="flex flex-col space-y-4">
          <button 
            onClick={handleResume}
            className="bg-[#B22234] text-[#F0F0E8] font-[Press_Start_2P] py-3 px-8 hover:opacity-90 transition-opacity"
          >
            RESUME
          </button>
          <button 
            onClick={handleRestart}
            className="bg-[#1A2E55] border-2 border-[#F0F0E8] text-[#F0F0E8] font-[Press_Start_2P] py-3 px-8 hover:opacity-90 transition-opacity"
          >
            RESTART LEVEL
          </button>
          <button 
            onClick={handleViewDocuments}
            className="bg-[#1A2E55] border-2 border-[#F0F0E8] text-[#F0F0E8] font-[Press_Start_2P] py-3 px-8 hover:opacity-90 transition-opacity"
          >
            DOCUMENTS
          </button>
          <button 
            onClick={handleMainMenu}
            className="bg-[#1A2E55] border-2 border-[#F0F0E8] text-[#F0F0E8] font-[Press_Start_2P] py-3 px-8 hover:opacity-90 transition-opacity"
          >
            MAIN MENU
          </button>
        </div>
      </div>

      {/* Document Viewer Modal */}
      {showDocuments && (
        <DocumentViewer onClose={handleCloseDocuments} />
      )}
    </div>
  );
}
