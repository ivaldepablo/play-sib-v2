import { PrismaClient } from "@prisma/client";
import { env } from "~/env.js";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;

// Initialize database in production if using SQLite
if (env.NODE_ENV === "production" && env.DATABASE_URL.includes("file:")) {
  (async () => {
    try {
      await db.$executeRaw`CREATE TABLE IF NOT EXISTS "User" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "nickname" TEXT NOT NULL,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL
      );`;
      
      await db.$executeRaw`CREATE TABLE IF NOT EXISTS "Score" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "userId" TEXT NOT NULL,
        "score" INTEGER NOT NULL,
        "questionsAnswered" INTEGER NOT NULL,
        "correctAnswers" INTEGER NOT NULL,
        "gameMode" TEXT NOT NULL DEFAULT 'single',
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
      );`;
      
      await db.$executeRaw`CREATE TABLE IF NOT EXISTS "Question" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "text" TEXT NOT NULL,
        "options" TEXT NOT NULL,
        "correctAnswer" INTEGER NOT NULL,
        "category" TEXT NOT NULL,
        "difficulty" TEXT NOT NULL DEFAULT 'medium',
        "approved" BOOLEAN NOT NULL DEFAULT false,
        "submittedBy" TEXT,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL
      );`;
      
      console.log("✅ Database initialized successfully");
    } catch (error) {
      console.log("Database already exists or error:", error);
    }
  })();
}
