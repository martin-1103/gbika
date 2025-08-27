"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleValidationErrors = void 0;
const express_validator_1 = require("express-validator");
// Handle validation errors from express-validator
const handleValidationErrors = (req, res, next) => {
    console.log('Validation middleware called for:', req.method, req.path);
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => ({
            path: error.type === 'field' ? error.path : 'unknown',
            msg: error.msg
        }));
        console.log('Validation errors:', errorMessages);
        return res.status(400).json({
            message: 'Validation failed',
            errors: errorMessages
        });
    }
    next();
};
exports.handleValidationErrors = handleValidationErrors;
//# sourceMappingURL=validation.middleware.js.map