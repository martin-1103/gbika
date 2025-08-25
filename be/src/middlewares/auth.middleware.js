"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_service_1 = require("../services/auth.service");
const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    if (!token) {
        return res.status(401).json({ message: 'Access token required.' });
    }
    try {
        // Check if token is blacklisted
        const isBlacklisted = await (0, auth_service_1.isTokenBlacklisted)(token);
        if (isBlacklisted) {
            return res.status(401).json({ message: 'Token has been revoked.' });
        }
        // Check if JWT secret exists
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: 'Server configuration error.' });
        }
        // Verify token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            return res.status(401).json({ message: 'Token has expired.' });
        }
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            return res.status(401).json({ message: 'Invalid token.' });
        }
        next(error);
    }
};
exports.authenticateToken = authenticateToken;
//# sourceMappingURL=auth.middleware.js.map