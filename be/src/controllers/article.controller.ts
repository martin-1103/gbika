// [article.controller.ts]: Article HTTP request handlers
import { Request, Response, NextFunction } from 'express';
import { softDeleteArticle } from '../services/article.service';

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
      return res.status(400).json({ message: 'Article slug is required.' });
    }

    const success = await softDeleteArticle(slug);

    // Log operation result
    console.log('Delete article result:', {
      slug,
      success
    });

    if (!success) {
      return res.status(404).json({ message: 'Article not found.' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error in deleteArticle:', error);
    next(error);
  }
};