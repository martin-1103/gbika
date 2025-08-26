"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUserById = exports.findUserByEmail = void 0;
// [user.service.ts]: User database operations
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const findUserByEmail = async (email) => {
    return await prisma.user.findUnique({
        where: {
            email,
        },
    });
};
exports.findUserByEmail = findUserByEmail;
// Find user by ID and return safe profile data (excluding sensitive fields)
const findUserById = async (id) => {
    const user = await prisma.user.findUnique({
        where: {
            id,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
            // Explicitly exclude password field for security
        },
    });
    return user;
};
exports.findUserById = findUserById;
//# sourceMappingURL=user.service.js.map