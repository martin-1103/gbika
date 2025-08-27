"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.articleRouter = void 0;
// [article.routes.ts]: Article routes
const express_1 = require("express");
const article_controller_1 = require("../controllers/article.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const roles_middleware_1 = require("../middlewares/roles.middleware");
const article_validation_1 = require("../middlewares/article.validation");
const articleRouter = (0, express_1.Router)();
exports.articleRouter = articleRouter;
console.log('=== Article router initialized ===');
console.log('validateListArticles:', typeof article_validation_1.validateListArticles, article_validation_1.validateListArticles);
console.log('listArticles:', typeof article_controller_1.listArticles, article_controller_1.listArticles);
// GET /articles - List published articles (public)
articleRouter.get('/', article_validation_1.validateListArticles, article_controller_1.listArticles);
// GET /articles/:slug - Get article detail by slug (public)
articleRouter.get('/:slug', article_controller_1.findBySlug);
console.log('=== Article routes registered ===');
// POST /articles - Create new article (authenticated, admin/editor only)
articleRouter.post('/', auth_middleware_1.authenticateToken, (0, roles_middleware_1.authorizeRoles)('admin', 'editor'), article_validation_1.validateCreateArticle, article_controller_1.createArticleController);
// Apply middleware in correct order:
// 1. Authentication - verify token and set req.user
// 2. Authorization - check user role
// 3. Validation - validate request data
// 4. Route handler - process the request
articleRouter
    .route('/:slug')
    .put(auth_middleware_1.authenticateToken, (0, roles_middleware_1.authorizeRoles)('admin', 'editor'), article_validation_1.validateUpdateArticle, article_controller_1.updateArticle)
    .delete(auth_middleware_1.authenticateToken, (0, roles_middleware_1.authorizeRoles)('admin'), article_controller_1.deleteArticle);
//# sourceMappingURL=article.routes.js.map