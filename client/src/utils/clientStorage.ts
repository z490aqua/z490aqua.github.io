import { 
  User, InsertUser, 
  GameProgress, GameState, 
  InsertGameProgress, 
  HighScore, InsertHighScore 
} from '@shared/schema';

// Local storage keys
const USERS_KEY = 'bala_game_users';
const PROGRESS_KEY = 'bala_game_progress';
const SCORES_KEY = 'bala_game_scores';

// Helper to convert Map to and from JSON-compatible format
function mapToArray<K, V>(map: Map<K, V>): [K, V][] {
  const result: [K, V][] = [];
  map.forEach((value, key) => {
    result.push([key, value]);
  });
  return result;
}

// Client-side implementation of the storage interface
export class ClientStorage {
  private users: Map<number, User>;
  private progressData: Map<number, GameProgress>;
  private scores: HighScore[];
  private currentUserId: number;
  private currentProgressId: number;
  private currentScoreId: number;

  constructor() {
    try {
      // Initialize with data from localStorage if available
      const userEntries = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
      this.users = new Map(userEntries);
      
      const progressEntries = JSON.parse(localStorage.getItem(PROGRESS_KEY) || '[]');
      this.progressData = new Map(progressEntries);
      
      this.scores = JSON.parse(localStorage.getItem(SCORES_KEY) || '[]');
      
      // Initialize counters with safe fallbacks
      const userIds = Array.from(this.users.keys());
      this.currentUserId = userIds.length > 0 ? Math.max(0, ...userIds) + 1 : 1;
      
      const progressValues = Array.from(this.progressData.values());
      this.currentProgressId = progressValues.length > 0 
        ? Math.max(0, ...progressValues.map(p => p.id)) + 1 
        : 1;
      
      this.currentScoreId = this.scores.length > 0
        ? Math.max(0, ...this.scores.map(s => s.id)) + 1
        : 1;
    } catch (error) {
      // In case of any errors, initialize with empty data
      console.error("Error initializing client storage:", error);
      this.users = new Map();
      this.progressData = new Map();
      this.scores = [];
      this.currentUserId = 1;
      this.currentProgressId = 1;
      this.currentScoreId = 1;
    }
  }

  // Save all data to localStorage
  private saveToLocalStorage() {
    try {
      localStorage.setItem(USERS_KEY, JSON.stringify(mapToArray(this.users)));
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(mapToArray(this.progressData)));
      localStorage.setItem(SCORES_KEY, JSON.stringify(this.scores));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const userValues = Array.from(this.users.values());
    return userValues.find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    this.saveToLocalStorage();
    return user;
  }

  // Game progress operations
  async getGameProgress(userId: number): Promise<GameProgress | undefined> {
    const progressValues = Array.from(this.progressData.values());
    return progressValues.find(progress => progress.userId === userId);
  }

  async saveGameProgress(userId: number, progress: Omit<InsertGameProgress, "id">): Promise<GameProgress> {
    const progressValues = Array.from(this.progressData.values());
    const existingProgress = progressValues.find(p => p.userId === userId);
    
    // Ensure required fields are present with defaults
    const progressData = {
      ...{
        currentLevel: 1,
        collectedDocuments: [],
        completedLevels: [],
        playerLives: 3,
        lastSaved: new Date().toISOString()
      },
      ...progress // Override defaults with provided values
    };
    
    if (existingProgress) {
      const updatedProgress: GameProgress = {
        ...existingProgress,
        ...progressData,
        userId
      };
      this.progressData.set(existingProgress.id, updatedProgress);
      this.saveToLocalStorage();
      return updatedProgress;
    } else {
      const id = this.currentProgressId++;
      const newProgress: GameProgress = {
        id,
        userId,
        currentLevel: progressData.currentLevel,
        collectedDocuments: progressData.collectedDocuments,
        completedLevels: progressData.completedLevels,
        playerLives: progressData.playerLives,
        lastSaved: progressData.lastSaved
      };
      this.progressData.set(id, newProgress);
      this.saveToLocalStorage();
      return newProgress;
    }
  }

  // High score operations
  async getHighScores(levelId?: number, limit: number = 10): Promise<HighScore[]> {
    let filteredScores = levelId 
      ? this.scores.filter(score => score.levelId === levelId)
      : this.scores;
    
    return filteredScores
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  async saveHighScore(insertScore: InsertHighScore): Promise<HighScore> {
    const id = this.currentScoreId++;
    // Create a properly formatted high score object based on the schema
    const newScore: HighScore = { 
      id,
      userId: insertScore.userId || null, // Ensure userId is never undefined
      score: insertScore.score,
      levelId: insertScore.levelId,
      completionTime: insertScore.completionTime,
      documentCount: insertScore.documentCount
    };
    
    this.scores.push(newScore);
    this.scores.sort((a, b) => b.score - a.score);
    this.saveToLocalStorage();
    return newScore;
  }
}

// Create and export a singleton instance
export const clientStorage = new ClientStorage();