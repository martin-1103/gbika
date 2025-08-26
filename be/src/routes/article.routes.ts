// [article.routes.ts]: Article routes
import { Router } from 'express';
import { listArticles, findBySlug, deleteArticle, createArticleController, updateArticle } from '../controllers/article.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
import { authorizeRoles } from '../middlewares/roles.middleware';
import { validateListArticles, validateCreateArticle, validateUpdateArticle } from '../middlewares/article.validation';

const articleRouter = Router();

console.log('=== Article router initialized ===');
console.log('validateListArticles:', typeof validateListArticles, validateListArticles);
console.log('listArticles:', typeof listArticles, listArticles);

// GET /articles - List published articles (public)
articleRouter.get('/', validateListArticles, listArticles);

// GET /articles/:slug - Get article detail by slug (public)
articleRouter.get('/:slug', findBySlug);

console.log('=== Article routes registered ===');

// POST /articles - Create new article (authenticated, admin/editor only)
articleRouter.post('/',
  authenticateToken,
  authorizeRoles('admin', 'editor'),
  validateCreateArticle,
  createArticleController
);

// Apply middleware in correct order:
// 1. Authentication - verify token and set req.user
// 2. Authorization - check user role
// 3. Validation - validate request data
// 4. Route handler - process the request
articleRouter
  .route('/:slug')
  .put(
    authenticateToken,
    authorizeRoles('admin', 'editor'),
    validateUpdateArticle,
    updateArticle
  )
  .delete(
    authenticateToken,
    authorizeRoles('admin'),
    deleteArticle
  );

export { articleRouter };