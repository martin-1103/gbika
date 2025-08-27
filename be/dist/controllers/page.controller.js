"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findBySlug = exports.getHomepageData = void 0;
const homepage_service_1 = require("../services/homepage.service");
const page_service_1 = require("../services/page.service");
// Get homepage aggregated data
const getHomepageData = async (req, res) => {
    try {
        const homepageData = await (0, homepage_service_1.getCachedHomepageData)();
        res.status(200).json({
            success: true,
            data: homepageData,
            message: 'Homepage data retrieved successfully'
        });
    }
    catch (error) {
        console.error('Error in getHomepageData controller:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve homepage data',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};
exports.getHomepageData = getHomepageData;
// Find page by slug
const findBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        if (!slug) {
            res.status(400).json({
                success: false,
                message: 'Page slug is required'
            });
            return;
        }
        const page = await (0, page_service_1.findOneBySlug)(slug);
        if (!page) {
            res.status(404).json({
                success: false,
                message: 'Page not found'
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: page,
            message: 'Page retrieved successfully'
        });
    }
    catch (error) {
        console.error('Error in findBySlug controller:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve page',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};
exports.findBySlug = findBySlug;
//# sourceMappingURL=page.controller.js.map