import { createContext, useReducer, ReactNode, useEffect } from 'react';
import { levels, Level } from '@/constants/levelData';
import { documents, Document } from '@/constants/documentData';
import { useLocalStorage } from '@/hooks/useLocalStorage';

// Define the game state structure
export interface GameState {
  isPlaying: boolean;
  isPaused: boolean;
  currentLevelId: number;
  collectedDocuments: Set<string>;
  newlyCollectedDocuments: Set<string>;
  activePower: Document['power'] | null;
  levelsCompleted: Set<number>;
  playerLives: number;
  showLevelComplete: boolean;
  gameCompleted: boolean;
  gameStartTime: number;
  gameEndTime: number;
}

// Define the initial state
const initialState: GameState = {
  isPlaying: false,
  isPaused: false,
  currentLevelId: 1,
  collectedDocuments: new Set<string>(),
  newlyCollectedDocuments: new Set<string>(),
  activePower: null,
  levelsCompleted: new Set<number>(),
  playerLives: 3,
  showLevelComplete: false,
  gameCompleted: false,
  gameStartTime: 0,
  gameEndTime: 0,
};

// Define action types
type GameAction =
  | { type: 'START_NEW_GAME' }
  | { type: 'CONTINUE_GAME'; payload: GameState }
  | { type: 'TOGGLE_PAUSE'; payload: boolean }
  | { type: 'SET_LEVEL'; payload: number }
  | { type: 'COMPLETE_LEVEL'; payload: number }
  | { type: 'COMPLETE_GAME' }
  | { type: 'COLLECT_DOCUMENT'; payload: string }
  | { type: 'RESET_NEWLY_COLLECTED' }
  | { type: 'SET_ACTIVE_POWER'; payload: Document['power'] | null }
  | { type: 'LOSE_LIFE' }
  | { type: 'RESET_LIVES' }
  | { type: 'SET_LEVEL_COMPLETE'; payload: boolean };

// Create the reducer
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_NEW_GAME':
      // Initialize with tutorial document already collected and newly collected
      const tutorialCollected = new Set<string>(["tutorial"]);
      return {
        ...initialState,
        isPlaying: true,
        collectedDocuments: tutorialCollected,
        newlyCollectedDocuments: tutorialCollected,
        gameStartTime: Date.now(),
      };
    case 'CONTINUE_GAME':
      return {
        ...action.payload,
        isPlaying: true,
        isPaused: false,
      };
    case 'TOGGLE_PAUSE':
      return {
        ...state,
        isPaused: action.payload,
      };
    case 'SET_LEVEL':
      return {
        ...state,
        currentLevelId: action.payload,
      };
    case 'COMPLETE_LEVEL':
      const newLevelsCompleted = new Set(state.levelsCompleted);
      newLevelsCompleted.add(action.payload);
      return {
        ...state,
        levelsCompleted: newLevelsCompleted,
        showLevelComplete: true,
      };
    case 'COMPLETE_GAME':
      return {
        ...state,
        gameCompleted: true,
        gameEndTime: Date.now(),
        isPaused: true, // Pause the game when completed
      };
    case 'COLLECT_DOCUMENT':
      const newCollectedDocuments = new Set(state.collectedDocuments);
      newCollectedDocuments.add(action.payload);
      
      const newNewlyCollectedDocuments = new Set(state.newlyCollectedDocuments);
      newNewlyCollectedDocuments.add(action.payload);
      
      return {
        ...state,
        collectedDocuments: newCollectedDocuments,
        newlyCollectedDocuments: newNewlyCollectedDocuments,
      };
    case 'RESET_NEWLY_COLLECTED':
      return {
        ...state,
        newlyCollectedDocuments: new Set<string>(),
      };
    case 'SET_ACTIVE_POWER':
      return {
        ...state,
        activePower: action.payload,
      };
    case 'LOSE_LIFE':
      return {
        ...state,
        playerLives: Math.max(0, state.playerLives - 1),
      };
    case 'RESET_LIVES':
      return {
        ...state,
        playerLives: initialState.playerLives,
      };
    case 'SET_LEVEL_COMPLETE':
      return {
        ...state,
        showLevelComplete: action.payload,
      };
    default:
      return state;
  }
}

// Create the context
interface GameContextType {
  gameState: GameState;
  startNewGame: () => void;
  continueGame: () => void;
  setGamePaused: (isPaused: boolean) => void;
  setCurrentLevel: (levelId: number) => void;
  completeCurrentLevel: () => void;
  completeGame: () => void;
  advanceToNextLevel: () => void;
  restartLevel: () => void;
  updateCollectedDocuments: (documentId: string) => void;
  resetNewlyCollectedDocuments: () => void;
  setActivePower: (power: Document['power'] | null) => void;
  loseLife: () => void;
  resetLives: () => void;
  currentLevel: Level | null;
  isGamePaused: boolean;
  collectedDocuments: Set<string>;
  newlyCollectedDocuments: Set<string>;
  activePower: Document['power'] | null;
  playerPowers: Set<string>;
  setLevelComplete: (isComplete: boolean) => void;
  hasSavedGame: boolean;
  saveAndExitGame: () => void;
  gameCompleted: boolean;
  gameTime: number;
}

export const GameContext = createContext<GameContextType | undefined>(undefined);

// Create the provider component
interface GameProviderProps {
  children: ReactNode;
}

export function GameProvider({ children }: GameProviderProps) {
  const [gameState, dispatch] = useReducer(gameReducer, initialState);
  const { getItem, setItem, removeItem } = useLocalStorage();
  
  // Derive if we have a saved game
  const hasSavedGame = Boolean(getItem('gameState'));

  // Load saved game state from localStorage on mount
  useEffect(() => {
    const savedState = getItem('gameState') as any;
    if (savedState) {
      // Convert serialized Sets back to actual Sets
      const parsedState: GameState = {
        ...savedState,
        collectedDocuments: new Set(savedState.collectedDocuments || []),
        newlyCollectedDocuments: new Set(savedState.newlyCollectedDocuments || []),
        levelsCompleted: new Set(savedState.levelsCompleted || []),
      };
      
      // Don't automatically continue the game, just restore the state
      // Uncomment this line if you want to auto-load the game
      // dispatch({ type: 'CONTINUE_GAME', payload: parsedState });
    }
  }, [getItem]);

  // Save game state to localStorage whenever it changes
  useEffect(() => {
    if (gameState.isPlaying) {
      // Convert Sets to arrays for serialization
      const serializedState = {
        ...gameState,
        collectedDocuments: Array.from(gameState.collectedDocuments),
        newlyCollectedDocuments: Array.from(gameState.newlyCollectedDocuments),
        levelsCompleted: Array.from(gameState.levelsCompleted),
      };
      
      setItem('gameState', serializedState);
    }
  }, [gameState]);

  // Get the current level object
  const currentLevel = levels.find(level => level.id === gameState.currentLevelId) || null;
  
  // Get powers available to the player based on collected documents
  const playerPowers = new Set<string>(
    Array.from(gameState.collectedDocuments)
  );

  // Context actions
  const startNewGame = () => {
    removeItem('gameState');
    dispatch({ type: 'START_NEW_GAME' });
  };

  const continueGame = () => {
    const savedState = getItem('gameState') as any;
    if (savedState) {
      // Convert serialized Sets back to actual Sets
      const parsedState: GameState = {
        ...savedState,
        collectedDocuments: new Set(savedState.collectedDocuments || []),
        newlyCollectedDocuments: new Set(savedState.newlyCollectedDocuments || []),
        levelsCompleted: new Set(savedState.levelsCompleted || []),
      };
      
      dispatch({ type: 'CONTINUE_GAME', payload: parsedState });
    }
  };

  const setGamePaused = (isPaused: boolean) => {
    dispatch({ type: 'TOGGLE_PAUSE', payload: isPaused });
  };

  const setCurrentLevel = (levelId: number) => {
    dispatch({ type: 'SET_LEVEL', payload: levelId });
  };

  const completeCurrentLevel = () => {
    if (currentLevel) {
      dispatch({ type: 'COMPLETE_LEVEL', payload: currentLevel.id });
    }
  };

  const completeGame = () => {
    dispatch({ type: 'COMPLETE_GAME' });
  };
    
  const advanceToNextLevel = () => {
    if (currentLevel) {
      const nextLevelId = currentLevel.id + 1;
      const nextLevelExists = levels.some(level => level.id === nextLevelId);
      
      if (nextLevelExists) {
        dispatch({ type: 'SET_LEVEL', payload: nextLevelId });
      } else {
        // Game completed, mark it as complete
        completeGame();
      }
      
      dispatch({ type: 'SET_LEVEL_COMPLETE', payload: false });
    }
  };

  const restartLevel = () => {
    dispatch({ type: 'TOGGLE_PAUSE', payload: false });
    // Simply re-setting the same level will restart it
    if (currentLevel) {
      dispatch({ type: 'SET_LEVEL', payload: currentLevel.id });
    }
  };

  const updateCollectedDocuments = (documentId: string) => {
    dispatch({ type: 'COLLECT_DOCUMENT', payload: documentId });
    
    // Set the active power based on the collected document
    const document = documents.find(doc => doc.id === documentId);
    if (document) {
      dispatch({ type: 'SET_ACTIVE_POWER', payload: document.power });
    }
  };

  const resetNewlyCollectedDocuments = () => {
    dispatch({ type: 'RESET_NEWLY_COLLECTED' });
  };

  const setActivePower = (power: Document['power'] | null) => {
    dispatch({ type: 'SET_ACTIVE_POWER', payload: power });
  };

  const loseLife = () => {
    dispatch({ type: 'LOSE_LIFE' });
  };

  const resetLives = () => {
    dispatch({ type: 'RESET_LIVES' });
  };

  const setLevelComplete = (isComplete: boolean) => {
    if (isComplete) {
      completeCurrentLevel();
    } else {
      dispatch({ type: 'SET_LEVEL_COMPLETE', payload: isComplete });
    }
  };

  const saveAndExitGame = () => {
    // Game is already saved in the localStorage effect
    // Just ensure the game is paused
    setGamePaused(false);
  };

  // Calculate game time (either elapsed time or final time)
  const gameTime = gameState.gameCompleted
    ? gameState.gameEndTime - gameState.gameStartTime
    : gameState.gameStartTime > 0
      ? Date.now() - gameState.gameStartTime
      : 0;
      
  return (
    <GameContext.Provider
      value={{
        gameState,
        startNewGame,
        continueGame,
        setGamePaused,
        setCurrentLevel,
        completeCurrentLevel,
        completeGame,
        advanceToNextLevel,
        restartLevel,
        updateCollectedDocuments,
        resetNewlyCollectedDocuments,
        setActivePower,
        loseLife,
        resetLives,
        currentLevel,
        isGamePaused: gameState.isPaused,
        collectedDocuments: gameState.collectedDocuments,
        newlyCollectedDocuments: gameState.newlyCollectedDocuments,
        activePower: gameState.activePower,
        playerPowers,
        setLevelComplete,
        hasSavedGame,
        saveAndExitGame,
        gameCompleted: gameState.gameCompleted,
        gameTime,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}
