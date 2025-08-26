// [article.controller.ts]: Article HTTP request handlers
import { Request, Response, NextFunction } from 'express';
import { findAll, findOneBySlug, softDeleteArticle, createArticle, updateBySlug } from '../services/article.service';

// List articles with pagination, filtering, and sorting
export const listArticles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('=== ENTERING listArticles controller ===');
    // Log request details
    console.log('List articles request:', {
      query: req.query,
      user: req.user
    });

    const {
      page = 1,
      limit = 10,
      sort_by = 'published_at',
      sort_order = 'desc'
    } = req.query;

    // Convert query params to proper types
    const params = {
      page: parseInt(page as string, 10),
      limit: parseInt(limit as string, 10),
      sortBy: sort_by as 'published_at' | 'createdAt',
      sortOrder: sort_order as 'asc' | 'desc'
    };

    const result = await findAll(params);

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
  } catch (error) {
    console.error('Error in listArticles:', error);
    next(error);
  }
};

// Update article by slug
export const updateArticle = async (req: Request, res: Response, next: NextFunction) => {
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
    const updatedArticle = await updateBySlug(slug, {
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
  } catch (error: any) {
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

// Get article detail by slug
export const findBySlug = async (req: Request, res: Response, next: NextFunction) => {
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

    const article = await findOneBySlug(slug);

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
  } catch (error) {
    console.error('Error in findBySlug:', error);
    next(error);
  }
};

export const deleteArticle = async (req: Request, res: Response, next: NextFunction) => {
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

    const result = await softDeleteArticle(slug);

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
  } catch (error) {
    console.error('Error in deleteArticle:', error);
    next(error);
  }
};

// Create new article
export const createArticleController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('=== ENTERING createArticle controller ===');
    // Log request details
    console.log('Create article request:', {
      body: req.body,
      user: req.user
    });

    const {
      title,
      content,
      slug,
      status
    } = req.body;

    // Validate required fields (additional validation beyond middleware)
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required'
      });
    }

    // Create article using service
    const article = await createArticle({
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
  } catch (error: any) {
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