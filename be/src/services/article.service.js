"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.softDeleteArticle = void 0;
// [article.service.ts]: Article business logic
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Soft delete article by slug
const softDeleteArticle = async (slug) => {
    try {
        // First check if article exists and is not deleted
        const existingArticle = await prisma.article.findFirst({
            where: {
                slug,
                deleted_at: null
            }
        });
        if (!existingArticle) {
            return false;
        }
        // Perform soft delete
        await prisma.article.update({
            where: {
                id: existingArticle.id // Use ID instead of slug for more reliable updates
            },
            data: {
                deleted_at: new Date()
            }
        });
        return true;
    }
    catch (error) {
        if (error.code === 'P2025') { // Prisma's record not found error
            return false;
        }
        throw error;
    }
};
exports.softDeleteArticle = softDeleteArticle;
//# sourceMappingURL=article.service.js.map