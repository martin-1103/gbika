// [rateLimiter.middleware.ts]: Rate limiting middleware
import rateLimit from 'express-rate-limit';

export const rateLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'), // default 1 minute
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '5'), // default 5 requests
  message: process.env.RATE_LIMIT_MESSAGE || 'Too many requests from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  skipFailedRequests: false,
});
