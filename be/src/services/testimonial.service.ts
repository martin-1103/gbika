// [testimonial.service.ts]: Testimonial business logic
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface PaginationOptions {
  page?: number;
  limit?: number;
}

interface TestimonialListResult {
  data: any[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Find all approved testimonials with pagination
export const findAllApproved = async (options: PaginationOptions = {}): Promise<TestimonialListResult> => {
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
  } catch (error) {
    console.error('Error in findAllApproved:', error);
    throw error;
  }
};

// Create a new testimonial (for submit endpoint)
export const createTestimonial = async (data: {
  name: string;
  email: string;
  city?: string;
  title: string;
  content: string;
}) => {
  try {
    const testimonial = await prisma.testimonial.create({
      data: {
        ...data,
        status: 'pending' // Default status for new testimonials
      }
    });

    return testimonial;
  } catch (error) {
    console.error('Error in createTestimonial:', error);
    throw error;
  }
};