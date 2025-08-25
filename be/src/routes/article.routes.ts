// [article.routes.ts]: Article routes
import { Router } from 'express';
import { deleteArticle } from '../controllers/article.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
import { authorizeRoles } from '../middlewares/roles.middleware';

const articleRouter = Router();

// Apply middleware in correct order:
// 1. Authentication - verify token and set req.user
// 2. Authorization - check user role
// 3. Route handler - process the request
articleRouter
  .route('/:slug')
  .delete(
    authenticateToken,
    authorizeRoles('admin'),
    deleteArticle
  );

export { articleRouter };