// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
var MemStorage = class {
  users;
  progressData;
  scores;
  currentUserId;
  currentProgressId;
  currentScoreId;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.progressData = /* @__PURE__ */ new Map();
    this.scores = [];
    this.currentUserId = 1;
    this.currentProgressId = 1;
    this.currentScoreId = 1;
  }
  // User methods
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async createUser(insertUser) {
    const id = this.currentUserId++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  // Game progress methods
  async getGameProgress(userId) {
    return Array.from(this.progressData.values()).find(
      (progress) => progress.userId === userId
    );
  }
  async saveGameProgress(userId, progress) {
    const existingProgress = await this.getGameProgress(userId);
    if (existingProgress) {
      const updatedProgress = {
        ...existingProgress,
        ...progress
      };
      this.progressData.set(existingProgress.id, updatedProgress);
      return updatedProgress;
    } else {
      const id = this.currentProgressId++;
      const newProgress = {
        id,
        ...progress
      };
      this.progressData.set(id, newProgress);
      return newProgress;
    }
  }
  // High score methods
  async getHighScores(levelId, limit = 10) {
    let filteredScores = this.scores;
    if (levelId !== void 0) {
      filteredScores = filteredScores.filter((score) => score.levelId === levelId);
    }
    return filteredScores.sort((a, b) => b.score - a.score).slice(0, limit);
  }
  async saveHighScore(insertScore) {
    const id = this.currentScoreId++;
    const userId = insertScore.userId ?? null;
    const newScore = {
      ...insertScore,
      id,
      userId
    };
    this.scores.push(newScore);
    return newScore;
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull()
});
var gameProgress = pgTable("game_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  currentLevel: integer("current_level").notNull().default(1),
  collectedDocuments: text("collected_documents").array().notNull().default([]),
  completedLevels: integer("completed_levels").array().notNull().default([]),
  playerLives: integer("player_lives").notNull().default(3),
  lastSaved: text("last_saved").notNull()
});
var highScores = pgTable("high_scores", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  score: integer("score").notNull(),
  levelId: integer("level_id").notNull(),
  completionTime: integer("completion_time").notNull(),
  // in seconds
  documentCount: integer("document_count").notNull()
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true
});
var insertGameProgressSchema = createInsertSchema(gameProgress).omit({
  id: true
});
var insertHighScoreSchema = createInsertSchema(highScores).omit({
  id: true
});

// server/routes.ts
import { z, ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
async function registerRoutes(app2) {
  app2.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const newUser = await storage.createUser(userData);
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
  app2.get("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving user" });
    }
  });
  app2.post("/api/progress", async (req, res) => {
    try {
      const userId = z.number().parse(req.body.userId);
      const gameState = req.body.gameState;
      const gameProgress2 = {
        userId,
        currentLevel: gameState.currentLevelId,
        collectedDocuments: Array.from(gameState.collectedDocuments).map((doc) => String(doc)),
        completedLevels: Array.from(gameState.levelsCompleted).map((level) => Number(level)),
        playerLives: gameState.playerLives,
        lastSaved: (/* @__PURE__ */ new Date()).toISOString()
      };
      const savedProgress = await storage.saveGameProgress(userId, gameProgress2);
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
  app2.get("/api/progress/:userId", async (req, res) => {
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
  app2.post("/api/highscores", async (req, res) => {
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
  app2.get("/api/highscores", async (req, res) => {
    try {
      const levelId = req.query.levelId ? parseInt(req.query.levelId) : void 0;
      const limit = req.query.limit ? parseInt(req.query.limit) : 10;
      const highScores2 = await storage.getHighScores(levelId, limit);
      res.json(highScores2);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving high scores" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2, { dirname as dirname2 } from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path, { dirname } from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared")
    }
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = dirname2(__filename2);
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        __dirname2,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(__dirname2, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
