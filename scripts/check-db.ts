import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    console.log("🔍 Checking database connection...");
    
    // Check if we can connect
    await prisma.$connect();
    console.log("✅ Database connection successful");
    
    // Check questions
    const questions = await prisma.question.findMany({
      where: { isActive: true }
    });
    
    console.log(`📊 Found ${questions.length} questions in database`);
    
    if (questions.length === 0) {
      console.log("❌ No questions found! Need to seed database");
    } else {
      console.log("✅ Questions found:");
      
      // Group by category
      const byCategory = questions.reduce((acc, q) => {
        if (!acc[q.category]) acc[q.category] = 0;
        acc[q.category] = (acc[q.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      Object.entries(byCategory).forEach(([category, count]) => {
        console.log(`   - ${category}: ${count} questions`);
      });
    }
    
  } catch (error) {
    console.error("❌ Database error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
