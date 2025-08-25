"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
// [auth.routes.ts]: Auth routes
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_validator_1 = require("../validators/auth.validator");
const rateLimiter_middleware_1 = require("../middlewares/rateLimiter.middleware");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const authRouter = (0, express_1.Router)();
exports.authRouter = authRouter;
authRouter.post('/login', rateLimiter_middleware_1.rateLimiter, auth_validator_1.loginValidator, auth_controller_1.login);
authRouter.post('/logout', auth_middleware_1.authenticateToken, auth_controller_1.logout);
//# sourceMappingURL=auth.routes.js.map