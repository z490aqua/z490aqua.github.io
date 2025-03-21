import { useEffect, useState } from 'react';
import { useGameState } from '@/hooks/useGameState';

export default function GameControls() {
  const [isMobile, setIsMobile] = useState(false);
  const { isGamePaused } = useGameState();

  // Detect if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Only render touch controls on mobile devices
  if (!isMobile) return null;

  // Handle mobile touch controls
  const handleTouchStart = (control: 'left' | 'right' | 'jump') => {
    if (window.gameControls && !isGamePaused) {
      if (control === 'left') window.gameControls.moveLeft(true);
      if (control === 'right') window.gameControls.moveRight(true);
      if (control === 'jump') window.gameControls.jump(true);
    }
  };

  const handleTouchEnd = (control: 'left' | 'right' | 'jump') => {
    if (window.gameControls) {
      if (control === 'left') window.gameControls.moveLeft(false);
      if (control === 'right') window.gameControls.moveRight(false);
      if (control === 'jump') window.gameControls.jump(false);
    }
  };

  return (
    <div className="md:hidden absolute bottom-4 left-4 right-4 flex justify-between pointer-events-auto">
      <div className="flex space-x-4">
        <button 
          id="left-btn" 
          className="bg-navy/80 w-16 h-16 flex items-center justify-center text-off-white rounded-full"
          onTouchStart={() => handleTouchStart('left')}
          onTouchEnd={() => handleTouchEnd('left')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button 
          id="right-btn" 
          className="bg-navy/80 w-16 h-16 flex items-center justify-center text-off-white rounded-full"
          onTouchStart={() => handleTouchStart('right')}
          onTouchEnd={() => handleTouchEnd('right')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      <button 
        id="jump-btn" 
        className="bg-[#B22234]/80 w-16 h-16 flex items-center justify-center text-off-white rounded-full"
        onTouchStart={() => handleTouchStart('jump')}
        onTouchEnd={() => handleTouchEnd('jump')}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
        </svg>
      </button>
    </div>
  );
}
