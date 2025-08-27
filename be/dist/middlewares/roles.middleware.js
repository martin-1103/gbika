"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = void 0;
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        // Log authorization attempt
        console.log('Authorization check - User:', req.user);
        if (!req.user) {
            console.log('Authorization failed - No user object');
            return res.status(401).json({ message: 'Unauthorized access.' });
        }
        if (!req.user.role) {
            console.log('Authorization failed - No role specified');
            return res.status(401).json({ message: 'Unauthorized access.' });
        }
        if (!roles.includes(req.user.role)) {
            console.log(`Authorization failed - Role ${req.user.role} not in`, roles);
            return res.status(403).json({ message: 'Forbidden access.' });
        }
        console.log(`Authorization successful - Role ${req.user.role} authorized for`, roles);
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
//# sourceMappingURL=roles.middleware.js.map