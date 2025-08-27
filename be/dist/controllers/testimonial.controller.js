"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.submit = exports.list = void 0;
const testimonial_service_1 = require("../services/testimonial.service");
// List approved testimonials with pagination
const list = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const result = await (0, testimonial_service_1.findAllApproved)({ page, limit });
        console.log(`Testimonials listed: page ${page}, limit ${limit}, total ${result.meta.total}`);
        res.status(200).json({
            success: true,
            message: 'Testimonials retrieved successfully',
            data: result.data,
            meta: result.meta
        });
    }
    catch (error) {
        console.error('Error listing testimonials:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
};
exports.list = list;
// Submit new testimonial
const submit = async (req, res) => {
    try {
        const { name, email, city, title, content } = req.body;
        const testimonial = await (0, testimonial_service_1.createTestimonial)({
            name,
            email,
            city,
            title,
            content
        });
        console.log('Testimonial created:', testimonial.id);
        // TODO: Send notification to admin for moderation
        res.status(201).json({
            success: true,
            message: 'Testimonial submitted successfully. It will be reviewed before being published.',
            data: {
                id: testimonial.id,
                name: testimonial.name,
                city: testimonial.city,
                title: testimonial.title,
                status: testimonial.status,
                createdAt: testimonial.createdAt
            }
        });
    }
    catch (error) {
        console.error('Error submitting testimonial:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
};
exports.submit = submit;
//# sourceMappingURL=testimonial.controller.js.map