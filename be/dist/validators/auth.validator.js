"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidator = void 0;
// [auth.validator.ts]: Auth request validators
const express_validator_1 = require("express-validator");
exports.loginValidator = [
    (0, express_validator_1.body)('email').isEmail().withMessage('Email must be a valid email address'),
    (0, express_validator_1.body)('password').notEmpty().withMessage('Password is required'),
];
//# sourceMappingURL=auth.validator.js.map