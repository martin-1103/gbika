"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBySlug = exports.softDeleteArticle = exports.findOneBySlug = exports.findLatest = exports.createArticle = exports.findAll = void 0;
// [article.service.ts]: Article business logic
const client_1 = require("@prisma/client");
const slugify_1 = __importDefault(require("slugify"));
const sanitizer_1 = require("../utils/sanitizer");
const prisma = new client_1.PrismaClient();
// Find all published articles with pagination, filtering, and sorting
const findAll = async (params = {}) => {
    try {
        const { page = 1, limit = 10, sortBy = 'published_at', sortOrder = 'desc' } = params;
        // Calculate offset for pagination
        const offset = (page - 1) * limit;
        // Build where clause
        const whereClause = {
            status: 'published',
            deleted_at: null
        };
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
    }
    catch (error) {
        console.error('Error in findAll:', error);
        throw error;
    }
};
exports.findAll = findAll;
// Create new article with slug generation and HTML sanitization
const createArticle = async (data) => {
    try {
        const { title, content, slug, status = 'draft' } = data;
        // Validate required fields
        if (!title || !title.trim()) {
            throw new Error('Title is required');
        }
        // Generate slug if not provided
        let articleSlug = slug;
        if (!articleSlug) {
            articleSlug = (0, slugify_1.default)(title, {
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
        const sanitizedContent = (0, sanitizer_1.sanitizeHtml)(content);
        // Prepare article data
        const articleData = {
            title: title.trim(),
            content: sanitizedContent,
            slug: articleSlug,
            status,
            published_at: status === 'published' ? new Date() : null
        };
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
    }
    catch (error) {
        console.error('Error in createArticle:', error);
        // Handle Prisma unique constraint violations
        if (error.code === 'P2002') {
            throw new Error('Article with this slug already exists');
        }
        throw error;
    }
};
exports.createArticle = createArticle;
// Find latest published articles
const findLatest = async (limit = 3) => {
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
    }
    catch (error) {
        console.error('Error in findLatest:', error);
        throw error;
    }
};
exports.findLatest = findLatest;
// Find one published article by slug
const findOneBySlug = async (slug) => {
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
        // Return null if article doesn't exist, is not published, or is soft deleted
        if (!article || article.status !== 'published' || article.deleted_at !== null) {
            return null;
        }
        // Remove deleted_at from the returned object since it's only used for filtering
        const { deleted_at, ...articleWithoutDeletedAt } = article;
        return articleWithoutDeletedAt;
    }
    catch (error) {
        console.error('Error in findOneBySlug:', error);
        throw error;
    }
};
exports.findOneBySlug = findOneBySlug;
// Soft delete article by slug
const softDeleteArticle = async (slug) => {
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
    }
    catch (error) {
        if (error.code === 'P2025') { // Prisma's record not found error
            return false;
        }
        throw error;
    }
};
exports.softDeleteArticle = softDeleteArticle;
// Update article by slug with proper validation
const updateBySlug = async (currentSlug, data) => {
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
        const updateData = {};
        // Handle title update
        if (data.title !== undefined) {
            if (!data.title.trim()) {
                throw new Error('Title cannot be empty');
            }
            updateData.title = data.title.trim();
            // Auto-generate slug from title if no custom slug provided
            if (data.slug === undefined) {
                const newSlug = (0, slugify_1.default)(updateData.title, {
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
                    }
                    else {
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
            updateData.content = (0, sanitizer_1.sanitizeHtml)(data.content);
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
            }
            else if (data.status === 'draft' && existingArticle.status === 'published') {
                updateData.published_at = null;
            }
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
    }
    catch (error) {
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
exports.updateBySlug = updateBySlug;
//# sourceMappingURL=article.service.js.map