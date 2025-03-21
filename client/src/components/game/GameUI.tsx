import { Pause } from 'lucide-react';
import { useGameState } from '@/hooks/useGameState';
import { documents } from '@/constants/documentData';

export default function GameUI() {
  const { 
    gameState, 
    setGamePaused, 
    currentLevel, 
    activePower, 
    collectedDocuments 
  } = useGameState();
  
  const documentCount = collectedDocuments.size;
  const totalDocuments = documents.length;
  const currentActivePower = activePower || { name: "None" };

  if (!currentLevel) return null;

  return (
    <div className="game-ui absolute inset-0 z-20 pointer-events-none">
      {/* Top UI Bar */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center pointer-events-auto">
        <div className="bg-[#1A2E55]/80 p-3 font-[Press_Start_2P] text-xs text-[#F0F0E8]">
          <span>LEVEL {currentLevel.id}: {currentLevel.title.toUpperCase()}</span>
        </div>
        <div className="flex space-x-2">
          <div className="bg-[#1A2E55]/80 p-3 font-[Press_Start_2P] text-xs text-[#F0F0E8] flex items-center">
            <span className="mr-2">DOCUMENTS:</span>
            <span className="text-[#B22234]">{documentCount}/{totalDocuments}</span>
          </div>
          <button 
            id="pause-btn" 
            className="bg-[#1A2E55]/80 px-3 py-3 text-[#F0F0E8]"
            onClick={() => setGamePaused(true)}
          >
            <Pause className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      {/* Power-up Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-[#1A2E55]/80 px-4 py-2 font-[Press_Start_2P] text-xs text-[#F0F0E8]">
        <div className="flex items-center">
          <span className="mr-2">POWER:</span>
          <span className="text-[#B22234]">{currentActivePower.name.toUpperCase()}</span>
        </div>
      </div>
    </div>
  );
}
