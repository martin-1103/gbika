// [article.service.ts]: Article business logic
import { PrismaClient } from '@prisma/client';
import slugify from 'slugify';
import { sanitizeHtml } from '../utils/sanitizer';

const prisma = new PrismaClient();

// Interface for findAll parameters
interface FindAllParams {
  page?: number;
  limit?: number;
  sortBy?: 'published_at' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  admin?: boolean; // Include drafts and scheduled articles for admin
}

// Interface for findAll response
interface FindAllResponse {
  data: any[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Find all published articles with pagination, filtering, and sorting
export const findAll = async (params: FindAllParams = {}): Promise<FindAllResponse> => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = 'published_at',
      sortOrder = 'desc',
      admin = false
    } = params;

    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Build where clause
    const whereClause: any = {
      deleted_at: null
    }

    // For non-admin users, only show published articles
    if (!admin) {
      whereClause.status = 'published'
    }

    // Get total count for pagination
    const total = await prisma.article.count({
      where: whereClause
    });

    // Get articles with pagination and sorting
    const articles = await prisma.article.findMany({
      where: whereClause,
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        status: true,
        published_at: true,
        createdAt: true
      },
      orderBy: {
        [sortBy]: sortOrder
      },
      take: limit,
      skip: offset
    });

    // Calculate total pages
    const totalPages = Math.ceil(total / limit);

    return {
      data: articles,
      meta: {
        total,
        page,
        limit,
        totalPages
      }
    };
  } catch (error) {
    console.error('Error in findAll:', error);
    throw error;
  }
};

// Interface for creating article
interface CreateArticleData {
  title: string;
  content: string;
  slug?: string;
  status?: 'draft' | 'published' | 'scheduled';
  published_at?: string; // ISO string for scheduled posts
}

// Create new article with slug generation and HTML sanitization
export const createArticle = async (data: CreateArticleData) => {
  try {
    const {
      title,
      content,
      slug,
      status = 'draft',
      published_at
    } = data;

    // Validate required fields
    if (!title || !title.trim()) {
      throw new Error('Title is required');
    }

    // Generate slug if not provided
    let articleSlug = slug;
    if (!articleSlug) {
      articleSlug = slugify(title, {
        lower: true,
        strict: true,
        remove: /[*+~.()'`"!:@]/g
      });
    }

    // Check if slug already exists
    const existingArticle = await prisma.article.findUnique({
      where: { slug: articleSlug }
    });

    if (existingArticle) {
      // Add timestamp to make slug unique
      const timestamp = Date.now();
      articleSlug = `${articleSlug}-${timestamp}`;
    }

    // Sanitize HTML content
    const sanitizedContent = sanitizeHtml(content);

    // Prepare article data
    const articleData: any = {
      title: title.trim(),
      content: sanitizedContent,
      slug: articleSlug,
      status
    };

    // Handle published_at based on status
    if (status === 'published') {
      articleData.published_at = new Date();
    } else if (status === 'scheduled') {
      if (!published_at) {
        throw new Error('Published date is required for scheduled articles');
      }
      const scheduledDate = new Date(published_at);
      if (scheduledDate <= new Date()) {
        throw new Error('Scheduled date must be in the future');
      }
      articleData.published_at = scheduledDate;
    } else {
      articleData.published_at = null;
    }

    // Create article
    const article = await prisma.article.create({
      data: articleData,
      select: {
        id: true,
        title: true,
        content: true,
        slug: true,
        status: true,
        published_at: true,
        createdAt: true,
        updatedAt: true
      }
    });

    console.log('Article created successfully:', article.id);
    return article;
  } catch (error: any) {
    console.error('Error in createArticle:', error);
    
    // Handle Prisma unique constraint violations
    if (error.code === 'P2002') {
      throw new Error('Article with this slug already exists');
    }
    
    throw error;
  }
};

// Find latest published articles
export const findLatest = async (limit: number = 3) => {
  try {
    const articles = await prisma.article.findMany({
      where: {
        status: 'published',
        deleted_at: null
      },
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        status: true,
        published_at: true,
        createdAt: true
      },
      orderBy: {
        published_at: 'desc'
      },
      take: limit
    });
    
    return articles;
  } catch (error) {
    console.error('Error in findLatest:', error);
    throw error;
  }
};

// Find one published article by slug
export const findOneBySlug = async (slug: string, admin: boolean = false) => {
  try {
    const article = await prisma.article.findUnique({
      where: {
        slug
      },
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        status: true,
        published_at: true,
        createdAt: true,
        updatedAt: true,
        deleted_at: true
      }
    });

    // Return null if article doesn't exist or is soft deleted
    if (!article || article.deleted_at !== null) {
      return null;
    }

    // For non-admin users, only return published articles
    if (!admin && article.status !== 'published') {
      return null;
    }

    // Remove deleted_at from the returned object since it's only used for filtering
    const { deleted_at, ...articleWithoutDeletedAt } = article;
    return articleWithoutDeletedAt;
  } catch (error) {
    console.error('Error in findOneBySlug:', error);
    throw error;
  }
};

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

// Interface for updating article
interface UpdateArticleData {
  title?: string;
  content?: string;
  slug?: string;
  status?: 'draft' | 'published' | 'scheduled';
  published_at?: string; // ISO string for scheduled posts
}

// Update article by slug with proper validation
export const updateBySlug = async (currentSlug: string, data: UpdateArticleData) => {
  try {
    
    // First check if article exists and is not deleted
    const existingArticle = await prisma.article.findFirst({
      where: {
        slug: currentSlug,
        deleted_at: null
      }
    });
    
    if (!existingArticle) {
      throw new Error('Article not found');
    }

    // Prepare update data
    const updateData: any = {};

    // Handle title update
    if (data.title !== undefined) {
      if (!data.title.trim()) {
        throw new Error('Title cannot be empty');
      }
      updateData.title = data.title.trim();
      
      // Auto-generate slug from title if no custom slug provided
      if (data.slug === undefined) {
        const newSlug = slugify(updateData.title, {
          lower: true,
          strict: true,
          remove: /[*+~.()'`"!:@]/g
        });
        
        // Check if the generated slug is different from current slug
        if (newSlug !== currentSlug) {
          // Check for uniqueness
          const existingSlugArticle = await prisma.article.findFirst({
            where: {
              slug: newSlug,
              deleted_at: null,
              id: { not: existingArticle.id }
            }
          });
          
          if (existingSlugArticle) {
            // If slug exists, add timestamp
            updateData.slug = `${newSlug}-${Date.now()}`;
          } else {
            updateData.slug = newSlug;
          }
        }
      }
    }

    // Handle content update with sanitization
    if (data.content !== undefined) {
      if (!data.content.trim()) {
        throw new Error('Content cannot be empty');
      }
      updateData.content = sanitizeHtml(data.content);
    }

    // Handle slug update with uniqueness check
    if (data.slug !== undefined) {
      if (!data.slug.trim()) {
        throw new Error('Slug cannot be empty');
      }
      
      const newSlug = data.slug.trim();
      
      // Only check for uniqueness if slug is actually changing
      if (newSlug !== currentSlug) {
        const existingSlugArticle = await prisma.article.findFirst({
          where: {
            slug: newSlug,
            deleted_at: null,
            id: { not: existingArticle.id } // Exclude current article
          }
        });

        if (existingSlugArticle) {
          throw new Error('Article with this slug already exists');
        }
      }
      
      updateData.slug = newSlug;
    }

    // Handle status update
    if (data.status !== undefined) {
      updateData.status = data.status;
      
      // Update published_at based on status change
      if (data.status === 'published' && existingArticle.status !== 'published') {
        updateData.published_at = new Date();
      } else if (data.status === 'draft') {
        updateData.published_at = null;
      } else if (data.status === 'scheduled') {
        if (!data.published_at) {
          throw new Error('Published date is required for scheduled articles');
        }
        const scheduledDate = new Date(data.published_at);
        // For updates, allow existing scheduled dates even if they're in the past
        // This allows editing existing scheduled articles without changing the date
        if (scheduledDate <= new Date()) {
          console.log(`Warning: Scheduled date ${data.published_at} is in the past, but allowing for update`);
        }
        updateData.published_at = scheduledDate;
      }
    }

    // Handle published_at update for scheduled posts
    if (data.published_at !== undefined && data.status === 'scheduled') {
      const scheduledDate = new Date(data.published_at);
      // For updates, allow existing scheduled dates even if they're in the past
      if (scheduledDate <= new Date()) {
        console.log(`Warning: Scheduled date ${data.published_at} is in the past, but allowing for update`);
      }
      updateData.published_at = scheduledDate;
    }

    // Ensure at least one field is being updated
    if (Object.keys(updateData).length === 0) {
      throw new Error('At least one field must be provided for update');
    }

    // Perform the update
    const updatedArticle = await prisma.article.update({
      where: {
        id: existingArticle.id
      },
      data: updateData,
      select: {
        id: true,
        title: true,
        content: true,
        slug: true,
        status: true,
        published_at: true,
        createdAt: true,
        updatedAt: true
      }
    });

    console.log('Article updated successfully:', updatedArticle.id);
    return updatedArticle;
  } catch (error: any) {
    console.error('Error in updateBySlug:', error);
    
    // Handle Prisma unique constraint violations
    if (error.code === 'P2002') {
      throw new Error('Article with this slug already exists');
    }
    
    // Handle Prisma record not found error
    if (error.code === 'P2025') {
      throw new Error('Article not found');
    }
    
    throw error;
   }
 };

// Find scheduled articles that are ready to be published
export const findScheduledArticlesReadyToPublish = async () => {
  try {
    const now = new Date();
    
    const articles = await prisma.article.findMany({
      where: {
        status: 'scheduled',
        published_at: {
          lte: now // published_at is less than or equal to now
        },
        deleted_at: null
      },
      select: {
        id: true,
        title: true,
        slug: true,
        published_at: true
      }
    });
    
    return articles;
  } catch (error) {
    console.error('Error in findScheduledArticlesReadyToPublish:', error);
    throw error;
  }
};

// Publish a scheduled article by ID
export const publishScheduledArticle = async (articleId: string) => {
  try {
    const updatedArticle = await prisma.article.update({
      where: {
        id: articleId,
        status: 'scheduled', // Ensure it's still scheduled
        deleted_at: null
      },
      data: {
        status: 'published'
        // Keep the original published_at date
      },
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        published_at: true
      }
    });
    
    console.log(`Article published: ${updatedArticle.title} (${updatedArticle.id})`);
    return updatedArticle;
  } catch (error: any) {
    console.error('Error in publishScheduledArticle:', error);
    
    if (error.code === 'P2025') {
      throw new Error('Scheduled article not found or already published');
    }
    
    throw error;
  }
};