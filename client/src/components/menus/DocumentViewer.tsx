import { useState } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { documents } from '@/constants/documentData';
import { X } from 'lucide-react';

interface DocumentViewerProps {
  onClose: () => void;
}

export default function DocumentViewer({ onClose }: DocumentViewerProps) {
  const { collectedDocuments } = useGameState();
  // First check if tutorial is in collected documents
  const hasTutorial = collectedDocuments.has("tutorial");
  
  // Initialize with tutorial if available, otherwise first collected document
  const [selectedDocument, setSelectedDocument] = useState<string | null>(() => {
    if (hasTutorial) {
      return "tutorial";
    }
    return collectedDocuments.size > 0 ? Array.from(collectedDocuments)[0] : null;
  });

  const filteredDocuments = documents.map(doc => ({
    ...doc,
    unlocked: collectedDocuments.has(doc.id)
  }));

  const currentDocument = documents.find(doc => doc.id === selectedDocument);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A2E55]/90">
      <div className="bg-[#F5F0DC] max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col rounded-lg shadow-lg">
        <div className="bg-[#D9CEB6] p-4 flex justify-between items-center">
          <h2 className="font-[Lora] font-semibold text-[#1A2E55] text-xl">Historical Documents</h2>
          <button 
            onClick={onClose}
            className="text-[#1A2E55] hover:text-[#B22234]"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="flex flex-grow overflow-hidden">
          {/* Document List */}
          <div className="w-1/3 bg-[#D9CEB6]/50 p-4 overflow-y-auto">
            <div className="space-y-4">
              {filteredDocuments.map(doc => (
                <div 
                  key={doc.id}
                  className={`document-item flex items-center p-2 border-b border-[#D9CEB6] cursor-pointer hover:bg-[#D9CEB6]/30 transition-colors ${doc.unlocked ? '' : 'opacity-50'} ${selectedDocument === doc.id ? 'bg-[#D9CEB6]/30' : ''}`}
                  onClick={() => doc.unlocked && setSelectedDocument(doc.id)}
                >
                  <div className="w-12 h-12 mr-3 flex items-center justify-center bg-[#F5F0DC] border border-[#D9CEB6]">
                    <svg viewBox="0 0 24 24" width="24" height="24" className={`${doc.unlocked ? 'text-[#B22234]' : 'text-gray-400'}`}>
                      <path
                        fill="currentColor"
                        d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20M10,19L10.9,19.06L11.8,18.92L12.7,18.55L13.5,18L14.1,17.2L14.5,16.3L14.6,15.5L14.5,14.7L14.2,14L13.6,13.4L13,13L12.4,12.8L11.7,12.7L11,12.8L10.3,13L9.8,13.4L9.3,14L9,14.7L8.9,15.5L9,16.3L9.4,17.2L10,18L10.9,18.55L10,19M10,5H11V11H10V5M13,5H14V11H13V5Z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-[Lora] font-semibold text-[#1A2E55]">{doc.title}</h3>
                    <p className="text-sm text-[#1A2E55]/70">
                      {doc.unlocked ? `Unlocked - Level ${doc.level}` : 'Locked'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Document Content */}
          <div className="w-2/3 p-6 overflow-y-auto">
            {currentDocument && collectedDocuments.has(currentDocument.id) ? (
              <>
                <h3 className="font-[Lora] font-semibold text-[#1A2E55] text-2xl mb-4">{currentDocument.title}</h3>
                <div className="prose prose-lg font-[Lora] text-[#1A2E55]">
                  {currentDocument.content.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="mb-4">{paragraph}</p>
                  ))}
                  
                  <div className="bg-[#1A2E55]/10 p-4 my-4 border-l-4 border-[#B22234]">
                    <h4 className="font-semibold text-[#1A2E55] mb-2">Game Power Unlocked: {currentDocument.power.name}</h4>
                    <p className="text-[#1A2E55]/80">{currentDocument.power.description}</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-[#1A2E55]/70 text-lg font-[Lora] italic">
                  {collectedDocuments.size === 0 
                    ? "You haven't collected any documents yet. Play the game to unlock them!"
                    : "Select a document from the list to view its contents."
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
