"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUserByEmail = void 0;
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
//# sourceMappingURL=user.service.js.map