"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimiter = void 0;
// [rateLimiter.middleware.ts]: Rate limiting middleware
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
exports.rateLimiter = (0, express_rate_limit_1.default)({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'), // default 1 minute
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '5'), // default 5 requests
    message: process.env.RATE_LIMIT_MESSAGE || 'Too many requests from this IP, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    skipFailedRequests: false,
});
//# sourceMappingURL=rateLimiter.middleware.js.map