import { pgTable, text, serial, integer, boolean, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema for authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Game progress schema
export const gameProgress = pgTable("game_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  currentLevel: integer("current_level").notNull().default(1),
  collectedDocuments: text("collected_documents").array().notNull().default([]),
  completedLevels: integer("completed_levels").array().notNull().default([]),
  playerLives: integer("player_lives").notNull().default(3),
  lastSaved: text("last_saved").notNull(),
});

// High scores schema
export const highScores = pgTable("high_scores", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  score: integer("score").notNull(),
  levelId: integer("level_id").notNull(),
  completionTime: integer("completion_time").notNull(), // in seconds
  documentCount: integer("document_count").notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertGameProgressSchema = createInsertSchema(gameProgress).omit({
  id: true,
});

export const insertHighScoreSchema = createInsertSchema(highScores).omit({
  id: true,
});

// Type definitions
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertGameProgress = z.infer<typeof insertGameProgressSchema>;
export type GameProgress = typeof gameProgress.$inferSelect;

export type InsertHighScore = z.infer<typeof insertHighScoreSchema>;
export type HighScore = typeof highScores.$inferSelect;

// Game state interface (for client-side storage)
export interface GameState {
  isPlaying: boolean;
  isPaused: boolean;
  currentLevelId: number;
  collectedDocuments: string[];
  newlyCollectedDocuments: string[];
  activePower: {
    name: string;
    description: string;
  } | null;
  levelsCompleted: number[];
  playerLives: number;
  showLevelComplete: boolean;
}
