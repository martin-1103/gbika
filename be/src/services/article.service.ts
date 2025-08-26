// [article.service.ts]: Article business logic
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Soft delete article by slug
export const softDeleteArticle = async (slug: string): Promise<boolean> => {
  try {
    // First check if article exists and is not deleted
    const existingArticle = await prisma.article.findFirst({
      where: {
        slug,
        deleted_at: null
      }
    });

    if (!existingArticle) {
      return false;
    }

    // Perform soft delete
    await prisma.article.update({
      where: { 
        id: existingArticle.id // Use ID instead of slug for more reliable updates
      },
      data: {
        deleted_at: new Date()
      }
    });

    return true;
  } catch (error: any) {
    if (error.code === 'P2025') { // Prisma's record not found error
      return false;
    }
    throw error;
  }
};