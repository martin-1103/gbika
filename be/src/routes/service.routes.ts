// [service.routes.ts]: Service routes
import { Router } from 'express';
import { submitPrayerRequest, submitSongRequest } from '../controllers/service.controller';
import { rateLimiter } from '../middlewares/rateLimiter.middleware';
import { validatePrayerRequest, validateSongRequest } from '../validators/service.validator';
import { handleValidationErrors } from '../middlewares/validation.middleware';

const serviceRouter = Router();

// POST /api/services/prayer - Submit prayer request
serviceRouter.post('/prayer', rateLimiter, validatePrayerRequest, handleValidationErrors, submitPrayerRequest);

// POST /api/services/song-request - Submit song request
serviceRouter.post('/song-request', rateLimiter, validateSongRequest, handleValidationErrors, submitSongRequest);

export { serviceRouter };
