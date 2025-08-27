// PageRoutes: Page-related routes
import express from 'express';
import { getHomepageData, findBySlug } from '../controllers/page.controller';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Rate limiting for homepage endpoint
const homepageRateLimit = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: process.env.NODE_ENV === 'test' ? 1000 : 30, // Higher limit for testing
  message: {
    success: false,
    message: 'Too many requests for homepage data, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Rate limiting for page content endpoint
const pageContentRateLimit = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: process.env.NODE_ENV === 'test' ? 1000 : 50, // Higher limit for testing
  message: {
    success: false,
    message: 'Too many requests for page content, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// GET /api/pages/homepage - Get aggregated homepage data
router.get('/homepage', homepageRateLimit, getHomepageData);

// GET /api/pages/{slug} - Get page content by slug
router.get('/:slug', pageContentRateLimit, findBySlug);

export default router;