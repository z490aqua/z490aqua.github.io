import React, { useState } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { Link, useLocation } from 'wouter';
import { documents } from '@/constants/documentData';
import DocumentViewer from './DocumentViewer';

interface GameCompleteProps {
  gameTime: number; // Time in milliseconds
  collectedDocuments: Set<string>;
}

export default function GameComplete({ gameTime, collectedDocuments }: GameCompleteProps) {
  const { startNewGame } = useGameState();
  const [showDocuments, setShowDocuments] = useState(false);
  const [_, navigate] = useLocation();
  
  // Convert milliseconds to minutes and seconds
  const minutes = Math.floor(gameTime / 60000);
  const seconds = Math.floor((gameTime % 60000) / 1000);
  
  // Get the collected document data
  const collectedDocumentData = documents.filter(doc => 
    collectedDocuments.has(doc.id)
  );
  
  const handleViewDocument = () => {
    setShowDocuments(true);
  };

  const handleCloseDocuments = () => {
    setShowDocuments(false);
  };
  
  const handlePlayAgain = () => {
    startNewGame();
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A2E55]/90">
      <div className="bg-[#1A2E55] border-4 border-[#B22234] p-8 max-w-md w-full text-center">
        <h2 className="font-[Press_Start_2P] text-[#F0F0E8] text-3xl mb-4">YOU WIN!</h2>
        <p className="font-[Press_Start_2P] text-[#F0F0E8] mb-6">
          You've mastered The Balance of Power!
        </p>
        
        <div className="bg-[#1A2E55]/50 p-4 mb-6">
          <h3 className="font-[Press_Start_2P] text-[#B22234] text-lg mb-2">COMPLETION TIME:</h3>
          <p className="font-[Press_Start_2P] text-[#F0F0E8] text-xl">
            {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
          </p>
        </div>
        
        <div className="bg-[#1A2E55]/50 p-4 mb-6">
          <h3 className="font-[Press_Start_2P] text-[#B22234] text-lg mb-2">DOCUMENTS COLLECTED:</h3>
          <p className="font-[Press_Start_2P] text-[#F0F0E8] text-xl">
            {collectedDocumentData.length} / {documents.length}
          </p>
        </div>
        
        <div className="flex justify-center space-x-4">
          <button 
            onClick={handleViewDocument}
            className="bg-[#1A2E55] border-2 border-[#F0F0E8] text-[#F0F0E8] font-[Press_Start_2P] py-2 px-4 hover:opacity-90 transition-opacity"
          >
            VIEW DOCUMENTS
          </button>
          <Link href="/">
            <button 
              className="bg-[#B22234] text-[#F0F0E8] font-[Press_Start_2P] py-2 px-4 hover:opacity-90 transition-opacity"
            >
              HOME
            </button>
          </Link>
          <button 
            onClick={handlePlayAgain}
            className="bg-[#3C5E93] text-[#F0F0E8] font-[Press_Start_2P] py-2 px-4 hover:opacity-90 transition-opacity"
          >
            PLAY AGAIN
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