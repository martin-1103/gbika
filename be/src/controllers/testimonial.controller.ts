// [testimonial.controller.ts]: Testimonial HTTP request handlers
import { Request, Response } from 'express';
import { findAllApproved, createTestimonial } from '../services/testimonial.service';

// List approved testimonials with pagination
export const list = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await findAllApproved({ page, limit });

    console.log(`Testimonials listed: page ${page}, limit ${limit}, total ${result.meta.total}`);

    res.status(200).json({
      success: true,
      message: 'Testimonials retrieved successfully',
      data: result.data,
      meta: result.meta
    });
  } catch (error) {
    console.error('Error listing testimonials:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

// Submit new testimonial
export const submit = async (req: Request, res: Response) => {
  try {
    const { name, email, city, title, content } = req.body;
    
    const testimonial = await createTestimonial({
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
  } catch (error) {
    console.error('Error submitting testimonial:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};