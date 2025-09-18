import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "~/server/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const questions = await db.question.findMany({
      where: { isActive: true },
      select: {
        id: true,
        category: true,
        text: true,
        isActive: true,
        createdAt: true,
      },
    });

    const byCategory = questions.reduce((acc, q) => {
      if (!acc[q.category]) acc[q.category] = 0;
      acc[q.category] = (acc[q.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return res.status(200).json({
      success: true,
      totalQuestions: questions.length,
      byCategory,
      sampleQuestions: questions.slice(0, 3).map(q => ({
        category: q.category,
        text: q.text.substring(0, 100) + "...",
        createdAt: q.createdAt,
      })),
    });
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({
      success: false,
      error: "Database connection failed",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
