"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.articleRouter = void 0;
// [article.routes.ts]: Article routes
const express_1 = require("express");
const article_controller_1 = require("../controllers/article.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const roles_middleware_1 = require("../middlewares/roles.middleware");
const articleRouter = (0, express_1.Router)();
exports.articleRouter = articleRouter;
// Apply middleware in correct order:
// 1. Authentication - verify token and set req.user
// 2. Authorization - check user role
// 3. Route handler - process the request
articleRouter
    .route('/:slug')
    .delete(auth_middleware_1.authenticateToken, (0, roles_middleware_1.authorizeRoles)('admin'), article_controller_1.deleteArticle);
//# sourceMappingURL=article.routes.js.map