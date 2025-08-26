// [testimonial.routes.ts]: Testimonial API routes
import express from 'express';
import rateLimit from 'express-rate-limit';
import { validationResult } from 'express-validator';
import { list, submit } from '../controllers/testimonial.controller';
import { validateTestimonialListQuery, validateTestimonialSubmission } from '../validators/testimonial.validator';

const router = express.Router();

// Rate limiting for testimonial endpoints
const testimonialRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs for listing
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const testimonialSubmitRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 submissions per hour
  message: 'Too many testimonial submissions from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Validation error handler middleware
const handleValidationErrors = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// GET /api/testimonials - List approved testimonials with pagination
router.get(
  '/',
  testimonialRateLimit,
  validateTestimonialListQuery,
  handleValidationErrors,
  list
);

// POST /api/testimonials - Submit new testimonial
router.post(
  '/',
  testimonialSubmitRateLimit,
  validateTestimonialSubmission,
  handleValidationErrors,
  submit
);

export default router;