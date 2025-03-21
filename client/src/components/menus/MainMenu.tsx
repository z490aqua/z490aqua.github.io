import { useEffect, useState } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { useLocation } from 'wouter';
import DocumentViewer from './DocumentViewer';

export default function MainMenu() {
  const [location, navigate] = useLocation();
  const { 
    gameState, 
    startNewGame, 
    continueGame, 
    hasSavedGame,
    collectedDocuments
  } = useGameState();
  
  const [showDocuments, setShowDocuments] = useState(false);
  // State to track if we should navigate to game after closing document viewer
  const [shouldNavigateToGame, setShouldNavigateToGame] = useState(false);

  const startGame = () => {
    startNewGame();
    // Show the tutorial document first before navigating to the game
    setShowDocuments(true);
    // Set flag to navigate to game after closing document
    setShouldNavigateToGame(true);
  };

  const loadSavedGame = () => {
    continueGame();
    navigate('/game');
  };

  const openDocuments = () => {
    setShowDocuments(true);
    // Make sure we don't navigate to game when closing regular document view
    setShouldNavigateToGame(false);
  };

  const closeDocuments = () => {
    setShowDocuments(false);
    // If we were showing the tutorial, navigate to game after closing
    if (shouldNavigateToGame) {
      navigate('/game');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#1A2E55]">
      <div className="relative mb-10">
        <h1 className="font-[Press_Start_2P] text-[#F0F0E8] text-3xl md:text-5xl text-center tracking-wider">
          THE BALANCE<br/>OF POWER
        </h1>
        <div className="absolute -bottom-4 w-full h-1 bg-[#B22234]"></div>
      </div>
      
      <div className="w-full max-w-md flex flex-col items-center space-y-4 mt-8">
        <button 
          onClick={startGame}
          className="bg-[#B22234] text-[#F0F0E8] font-[Press_Start_2P] py-3 px-8 hover:opacity-90 transition-opacity shadow-[0_-4px_0_0_#000,0_4px_0_0_#000,-4px_0_0_0_#000,4px_0_0_0_#000] w-64"
        >
          NEW GAME
        </button>
        
        <button 
          onClick={loadSavedGame}
          disabled={!hasSavedGame}
          className={`bg-[#1A2E55] border-2 border-[#F0F0E8] text-[#F0F0E8] font-[Press_Start_2P] py-3 px-8 transition-opacity w-64 ${hasSavedGame ? 'hover:opacity-90' : 'opacity-50 cursor-not-allowed'}`}
        >
          CONTINUE
        </button>
        
        <button 
          onClick={openDocuments}
          disabled={collectedDocuments.size === 0}
          className={`bg-[#1A2E55] border-2 border-[#F0F0E8] text-[#F0F0E8] font-[Press_Start_2P] py-3 px-8 transition-opacity w-64 ${collectedDocuments.size > 0 ? 'hover:opacity-90' : 'opacity-50 cursor-not-allowed'}`}
        >
          DOCUMENTS
        </button>
      </div>
      
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
        <div className="flex items-center space-x-4 text-[#F0F0E8] font-[Press_Start_2P] text-xs mb-4">
          <div className="flex items-center">
            <span className="bg-[#F0F0E8] text-[#1A2E55] px-2 py-1 mr-2">A</span>
            <span>LEFT</span>
          </div>
          <div className="flex items-center">
            <span className="bg-[#F0F0E8] text-[#1A2E55] px-2 py-1 mr-2">D</span>
            <span>RIGHT</span>
          </div>
          <div className="flex items-center">
            <span className="bg-[#F0F0E8] text-[#1A2E55] px-2 py-1 mr-2">SPACE</span>
            <span>JUMP</span>
          </div>
        </div>
        <p className="text-[#F0F0E8] text-xs font-[Press_Start_2P]">
          TOUCH CONTROLS AVAILABLE ON MOBILE
        </p>
      </div>
      
      <div className="absolute bottom-4 right-4 text-[#F0F0E8] font-[Press_Start_2P] text-xs">
        VERSION 1.0
      </div>

      {/* Document Viewer Modal */}
      {showDocuments && (
        <DocumentViewer onClose={closeDocuments} />
      )}
    </div>
  );
}
