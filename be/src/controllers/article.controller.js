"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createArticleController = exports.deleteArticle = exports.findBySlug = exports.updateArticle = exports.listArticles = void 0;
const article_service_1 = require("../services/article.service");
// List articles with pagination, filtering, and sorting
const listArticles = async (req, res, next) => {
    try {
        console.log('=== ENTERING listArticles controller ===');
        // Log request details
        console.log('List articles request:', {
            query: req.query,
            user: req.user
        });
        const { page = 1, limit = 10, sort_by = 'published_at', sort_order = 'desc' } = req.query;
        // Convert query params to proper types
        const params = {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            sortBy: sort_by,
            sortOrder: sort_order
        };
        const result = await (0, article_service_1.findAll)(params);
        // Log operation result
        console.log('List articles result:', {
            total: result.meta.total,
            page: result.meta.page,
            totalPages: result.meta.totalPages
        });
        res.status(200).json({
            success: true,
            data: result.data,
            meta: result.meta,
            message: 'Articles retrieved successfully'
        });
    }
    catch (error) {
        console.error('Error in listArticles:', error);
        next(error);
    }
};
exports.listArticles = listArticles;
// Update article by slug
const updateArticle = async (req, res, next) => {
    try {
        console.log('=== ENTERING updateArticle controller ===');
        // Log request details
        console.log('Update article request:', {
            slug: req.params.slug,
            body: req.body,
            user: req.user
        });
        const { slug } = req.params;
        const { title, content, slug: newSlug, status } = req.body;
        // Ensure slug is provided
        if (!slug) {
            return res.status(400).json({
                success: false,
                message: 'Article slug is required.'
            });
        }
        // Update article using service
        const updatedArticle = await (0, article_service_1.updateBySlug)(slug, {
            title,
            content,
            slug: newSlug,
            status
        });
        // Log operation result
        console.log('Update article result:', {
            id: updatedArticle.id,
            slug: updatedArticle.slug,
            status: updatedArticle.status
        });
        res.status(200).json({
            success: true,
            data: updatedArticle,
            message: 'Article updated successfully'
        });
    }
    catch (error) {
        console.error('Error in updateArticle:', error);
        // Handle specific error types
        if (error.message === 'Article not found') {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
        if (error.message === 'Article with this slug already exists') {
            return res.status(409).json({
                success: false,
                message: error.message
            });
        }
        if (error.message.includes('cannot be empty') || error.message.includes('must be provided')) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
        next(error);
    }
};
exports.updateArticle = updateArticle;
// Get article detail by slug
const findBySlug = async (req, res, next) => {
    try {
        console.log('=== ENTERING findBySlug controller ===');
        // Log request details
        console.log('Get article detail request:', {
            slug: req.params.slug
        });
        const { slug } = req.params;
        // Ensure slug is provided
        if (!slug) {
            return res.status(400).json({
                success: false,
                message: 'Article slug is required.'
            });
        }
        const article = await (0, article_service_1.findOneBySlug)(slug);
        // Log operation result
        console.log('Get article detail result:', {
            slug,
            found: !!article
        });
        if (!article) {
            return res.status(404).json({
                success: false,
                message: 'Article not found.'
            });
        }
        res.status(200).json({
            success: true,
            data: article,
            message: 'Article retrieved successfully'
        });
    }
    catch (error) {
        console.error('Error in findBySlug:', error);
        next(error);
    }
};
exports.findBySlug = findBySlug;
const deleteArticle = async (req, res, next) => {
    try {
        // Log request details
        console.log('Delete article request:', {
            slug: req.params.slug,
            user: req.user
        });
        const { slug } = req.params;
        // Ensure slug is provided
        if (!slug) {
            return res.status(400).json({
                success: false,
                message: 'Article slug is required.'
            });
        }
        const result = await (0, article_service_1.softDeleteArticle)(slug);
        // Log operation result
        console.log('Delete article result:', {
            slug,
            success: result
        });
        if (!result) {
            return res.status(404).json({
                success: false,
                message: 'Article not found.'
            });
        }
        res.status(204).send();
    }
    catch (error) {
        console.error('Error in deleteArticle:', error);
        next(error);
    }
};
exports.deleteArticle = deleteArticle;
// Create new article
const createArticleController = async (req, res, next) => {
    try {
        console.log('=== ENTERING createArticle controller ===');
        // Log request details
        console.log('Create article request:', {
            body: req.body,
            user: req.user
        });
        const { title, content, slug, status } = req.body;
        // Validate required fields (additional validation beyond middleware)
        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: 'Title and content are required'
            });
        }
        // Create article using service
        const article = await (0, article_service_1.createArticle)({
            title,
            content,
            slug,
            status
        });
        // Log operation result
        console.log('Create article result:', {
            id: article.id,
            slug: article.slug,
            status: article.status
        });
        res.status(201).json({
            success: true,
            data: article,
            message: 'Article created successfully'
        });
    }
    catch (error) {
        console.error('Error in createArticle:', error);
        // Handle specific error types
        if (error.message === 'Article with this slug already exists') {
            return res.status(409).json({
                success: false,
                message: error.message
            });
        }
        if (error.message === 'Invalid author_id or category_id provided') {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
        next(error);
    }
};
exports.createArticleController = createArticleController;
//# sourceMappingURL=article.controller.js.map