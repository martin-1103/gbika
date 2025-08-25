// [auth.routes.ts]: Auth routes
import { Router } from 'express';
import { login, logout, getProfile } from '../controllers/auth.controller';
import { loginValidator } from '../validators/auth.validator';
import { rateLimiter } from '../middlewares/rateLimiter.middleware';
import { authenticateToken } from '../middlewares/auth.middleware';

const authRouter = Router();

authRouter.post('/login', rateLimiter, loginValidator, login);
authRouter.post('/logout', authenticateToken, logout);
authRouter.get('/me', authenticateToken, getProfile);

export { authRouter };
