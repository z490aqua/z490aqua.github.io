import { useGameState } from '@/hooks/useGameState';
import { useLocation } from 'wouter';
import { documents } from '@/constants/documentData';
import { useState } from 'react';
import DocumentViewer from './DocumentViewer';

export default function LevelComplete() {
  const [location, navigate] = useLocation();
  const { 
    currentLevel, 
    advanceToNextLevel, 
    collectedDocuments, 
    newlyCollectedDocuments,
    resetNewlyCollectedDocuments
  } = useGameState();
  
  const [showDocuments, setShowDocuments] = useState(false);

  if (!currentLevel) return null;

  const handleNextLevel = () => {
    advanceToNextLevel();
    resetNewlyCollectedDocuments();
  };

  const handleViewDocument = () => {
    setShowDocuments(true);
  };

  const handleCloseDocuments = () => {
    setShowDocuments(false);
  };

  // Get the document that was unlocked in this level
  const unlockedDocuments = Array.from(newlyCollectedDocuments)
    .map(id => documents.find(doc => doc.id === id))
    .filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A2E55]/90">
      <div className="bg-[#1A2E55] border-4 border-[#B22234] p-8 max-w-md w-full text-center">
        <h2 className="font-[Press_Start_2P] text-[#F0F0E8] text-3xl mb-4">LEVEL COMPLETE!</h2>
        <p className="font-[Press_Start_2P] text-[#F0F0E8] mb-6">
          You've mastered {currentLevel.title}!
        </p>
        
        {unlockedDocuments.length > 0 && (
          <div className="bg-[#1A2E55]/50 p-4 mb-6">
            <h3 className="font-[Press_Start_2P] text-[#B22234] text-lg mb-2">UNLOCKED:</h3>
            {unlockedDocuments.map(doc => doc && (
              <div key={doc.id} className="flex justify-center items-center">
                <div className="w-16 h-20 bg-[#F5F0DC] flex items-center justify-center mr-3">
                  <svg viewBox="0 0 24 24" width="36" height="36" className="text-[#B22234]">
                    <path
                      fill="currentColor"
                      d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20M10,19L10.9,19.06L11.8,18.92L12.7,18.55L13.5,18L14.1,17.2L14.5,16.3L14.6,15.5L14.5,14.7L14.2,14L13.6,13.4L13,13L12.4,12.8L11.7,12.7L11,12.8L10.3,13L9.8,13.4L9.3,14L9,14.7L8.9,15.5L9,16.3L9.4,17.2L10,18L10.9,18.55L10,19M10,5H11V11H10V5M13,5H14V11H13V5Z"
                    />
                  </svg>
                </div>
                <div className="text-left">
                  <h4 className="font-[Press_Start_2P] text-[#F0F0E8]">{doc.title}</h4>
                  <p className="text-xs text-[#F0F0E8]/70">New power: {doc.power.name}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="flex justify-center space-x-4">
          <button 
            onClick={handleViewDocument}
            className="bg-[#1A2E55] border-2 border-[#F0F0E8] text-[#F0F0E8] font-[Press_Start_2P] py-2 px-4 hover:opacity-90 transition-opacity"
          >
            VIEW DOCUMENT
          </button>
          <button 
            onClick={handleNextLevel}
            className="bg-[#B22234] text-[#F0F0E8] font-[Press_Start_2P] py-2 px-4 hover:opacity-90 transition-opacity"
          >
            NEXT LEVEL
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
