"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = exports.logout = exports.login = void 0;
const express_validator_1 = require("express-validator");
const auth_service_1 = require("../services/auth.service");
const user_service_1 = require("../services/user.service");
const login = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
        const user = await (0, auth_service_1.loginUser)(email, password);
        if (!user) {
            return res.status(401).json({ message: 'Email atau password salah.' });
        }
        const accessToken = (0, auth_service_1.generateToken)(user);
        res.status(200).json({
            accessToken,
            user: {
                id: user.id,
                name: user.name,
                role: user.role,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
const logout = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    if (!token) {
        return res.status(401).json({ message: 'Access token required.' });
    }
    try {
        const success = await (0, auth_service_1.blacklistToken)(token);
        if (!success) {
            return res.status(500).json({ message: 'Failed to logout.' });
        }
        res.status(200).json({
            message: 'Logout berhasil.',
        });
    }
    catch (error) {
        next(error);
    }
};
exports.logout = logout;
// Get current user profile from authenticated token
const getProfile = async (req, res, next) => {
    try {
        // user is guaranteed to exist here due to authenticateToken middleware
        if (!req.user || !req.user.sub) {
            return res.status(401).json({ message: 'Authentication required.' });
        }
        const userId = req.user.sub;
        // Retrieve user data without sensitive fields
        const user = await (0, user_service_1.findUserById)(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        // Return filtered user profile data
        res.status(200).json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        });
    }
    catch (error) {
        console.error('Error retrieving user profile:', error);
        next(error);
    }
};
exports.getProfile = getProfile;
//# sourceMappingURL=auth.controller.js.map