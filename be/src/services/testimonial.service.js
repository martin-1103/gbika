"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTestimonial = exports.findAllApproved = void 0;
// [testimonial.service.ts]: Testimonial business logic
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Find all approved testimonials with pagination
const findAllApproved = async (options = {}) => {
    try {
        const page = Math.max(1, options.page || 1);
        const limit = Math.min(50, Math.max(1, options.limit || 10));
        const skip = (page - 1) * limit;
        // Get total count of approved testimonials
        const total = await prisma.testimonial.count({
            where: {
                status: 'approved'
            }
        });
        // Get paginated testimonials
        const testimonials = await prisma.testimonial.findMany({
            where: {
                status: 'approved'
            },
            select: {
                id: true,
                name: true,
                city: true,
                title: true,
                content: true,
                createdAt: true
                // Exclude email and other sensitive fields
            },
            orderBy: {
                createdAt: 'desc'
            },
            skip,
            take: limit
        });
        const totalPages = Math.ceil(total / limit);
        return {
            data: testimonials,
            meta: {
                page,
                limit,
                total,
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        };
    }
    catch (error) {
        console.error('Error in findAllApproved:', error);
        throw error;
    }
};
exports.findAllApproved = findAllApproved;
// Create a new testimonial (for submit endpoint)
const createTestimonial = async (data) => {
    try {
        const testimonial = await prisma.testimonial.create({
            data: {
                ...data,
                status: 'pending' // Default status for new testimonials
            }
        });
        return testimonial;
    }
    catch (error) {
        console.error('Error in createTestimonial:', error);
        throw error;
    }
};
exports.createTestimonial = createTestimonial;
//# sourceMappingURL=testimonial.service.js.map