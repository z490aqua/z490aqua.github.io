import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertHighScoreSchema } from "@shared/schema";
import { z, ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const newUser = await storage.createUser(userData);
      
      // Remove password from response
      const { password, ...userWithoutPassword } = newUser;
      
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        res.status(500).json({ message: "Error creating user" });
      }
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving user" });
    }
  });

  // Game progress routes
  app.post("/api/progress", async (req, res) => {
    try {
      const userId = z.number().parse(req.body.userId);
      const gameState = req.body.gameState;
      
      // Convert client-side Set to array for storage
      const gameProgress = {
        userId,
        currentLevel: gameState.currentLevelId,
        collectedDocuments: Array.from(gameState.collectedDocuments).map(doc => String(doc)),
        completedLevels: Array.from(gameState.levelsCompleted).map(level => Number(level)),
        playerLives: gameState.playerLives,
        lastSaved: new Date().toISOString()
      };
      
      const savedProgress = await storage.saveGameProgress(userId, gameProgress);
      res.status(201).json(savedProgress);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        res.status(500).json({ message: "Error saving game progress" });
      }
    }
  });

  app.get("/api/progress/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const progress = await storage.getGameProgress(userId);
      
      if (!progress) {
        return res.status(404).json({ message: "No saved progress found" });
      }
      
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving game progress" });
    }
  });

  // High scores routes
  app.post("/api/highscores", async (req, res) => {
    try {
      const scoreData = insertHighScoreSchema.parse(req.body);
      const newScore = await storage.saveHighScore(scoreData);
      res.status(201).json(newScore);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        res.status(500).json({ message: "Error saving high score" });
      }
    }
  });

  app.get("/api/highscores", async (req, res) => {
    try {
      const levelId = req.query.levelId ? parseInt(req.query.levelId as string) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      
      const highScores = await storage.getHighScores(levelId, limit);
      res.json(highScores);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving high scores" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
