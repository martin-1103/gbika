"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceRouter = void 0;
// [service.routes.ts]: Service routes
const express_1 = require("express");
const service_controller_1 = require("../controllers/service.controller");
const rateLimiter_middleware_1 = require("../middlewares/rateLimiter.middleware");
const service_validator_1 = require("../validators/service.validator");
const validation_middleware_1 = require("../middlewares/validation.middleware");
const serviceRouter = (0, express_1.Router)();
exports.serviceRouter = serviceRouter;
// POST /api/services/prayer - Submit prayer request
serviceRouter.post('/prayer', rateLimiter_middleware_1.rateLimiter, service_validator_1.validatePrayerRequest, validation_middleware_1.handleValidationErrors, service_controller_1.submitPrayerRequest);
// POST /api/services/song-request - Submit song request
serviceRouter.post('/song-request', rateLimiter_middleware_1.rateLimiter, service_validator_1.validateSongRequest, validation_middleware_1.handleValidationErrors, service_controller_1.submitSongRequest);
//# sourceMappingURL=service.routes.js.map