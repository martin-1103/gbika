"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteArticle = void 0;
const article_service_1 = require("../services/article.service");
const deleteArticle = async (req, res, next) => {
    try {
        // Log request details
        console.log('Delete article request:', {
            slug: req.params.slug,
            user: req.user
        });
        const { slug } = req.params;
        // Ensure slug is provided
        if (!slug) {
            return res.status(400).json({ message: 'Article slug is required.' });
        }
        const success = await (0, article_service_1.softDeleteArticle)(slug);
        // Log operation result
        console.log('Delete article result:', {
            slug,
            success
        });
        if (!success) {
            return res.status(404).json({ message: 'Article not found.' });
        }
        res.status(204).send();
    }
    catch (error) {
        console.error('Error in deleteArticle:', error);
        next(error);
    }
};
exports.deleteArticle = deleteArticle;
//# sourceMappingURL=article.controller.js.map