import {
  users,
  type User,
  type InsertUser,
  gameProgress,
  type GameProgress,
  type InsertGameProgress,
  highScores,
  type HighScore,
  type InsertHighScore
} from "@shared/schema";

// Interface for all storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Game progress operations
  getGameProgress(userId: number): Promise<GameProgress | undefined>;
  saveGameProgress(userId: number, progress: Omit<InsertGameProgress, "id">): Promise<GameProgress>;
  
  // High score operations
  getHighScores(levelId?: number, limit?: number): Promise<HighScore[]>;
  saveHighScore(score: InsertHighScore): Promise<HighScore>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private progressData: Map<number, GameProgress>;
  private scores: HighScore[];
  private currentUserId: number;
  private currentProgressId: number;
  private currentScoreId: number;

  constructor() {
    this.users = new Map();
    this.progressData = new Map();
    this.scores = [];
    this.currentUserId = 1;
    this.currentProgressId = 1;
    this.currentScoreId = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Game progress methods
  async getGameProgress(userId: number): Promise<GameProgress | undefined> {
    return Array.from(this.progressData.values()).find(
      (progress) => progress.userId === userId
    );
  }
  
  async saveGameProgress(userId: number, progress: Omit<InsertGameProgress, "id">): Promise<GameProgress> {
    // Check if progress already exists for this user
    const existingProgress = await this.getGameProgress(userId);
    
    if (existingProgress) {
      // Update existing progress
      const updatedProgress: GameProgress = {
        ...existingProgress,
        ...progress,
      };
      
      this.progressData.set(existingProgress.id, updatedProgress);
      return updatedProgress;
    } else {
      // Create new progress
      const id = this.currentProgressId++;
      const newProgress: GameProgress = {
        id,
        ...progress,
      } as GameProgress;
      
      this.progressData.set(id, newProgress);
      return newProgress;
    }
  }
  
  // High score methods
  async getHighScores(levelId?: number, limit: number = 10): Promise<HighScore[]> {
    let filteredScores = this.scores;
    
    if (levelId !== undefined) {
      filteredScores = filteredScores.filter(score => score.levelId === levelId);
    }
    
    // Sort by score descending
    return filteredScores
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }
  
  async saveHighScore(insertScore: InsertHighScore): Promise<HighScore> {
    const id = this.currentScoreId++;
    // Ensure userId is not undefined
    const userId = insertScore.userId ?? null;
    const newScore: HighScore = { 
      ...insertScore, 
      id,
      userId 
    };
    
    this.scores.push(newScore);
    return newScore;
  }
}

// Export a single instance of the storage
export const storage = new MemStorage();
