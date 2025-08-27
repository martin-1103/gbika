// PageController: Page-related endpoints controller
import { Request, Response } from 'express';
import { getCachedHomepageData } from '../services/homepage.service';
import { findOneBySlug } from '../services/page.service';

interface PageParams {
  slug: string;
}

// Get homepage aggregated data
const getHomepageData = async (req: Request, res: Response): Promise<void> => {
  try {
    const homepageData = await getCachedHomepageData();
    
    res.status(200).json({
      success: true,
      data: homepageData,
      message: 'Homepage data retrieved successfully'
    });
  } catch (error) {
    console.error('Error in getHomepageData controller:', error);
    
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve homepage data',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Internal server error'
    });
  }
};

// Find page by slug
const findBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params as unknown as PageParams;
    
    if (!slug) {
      res.status(400).json({
        success: false,
        message: 'Page slug is required'
      });
      return;
    }
    
    const page = await findOneBySlug(slug);
    
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
  } catch (error) {
    console.error('Error in findBySlug controller:', error);
    
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve page',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Internal server error'
    });
  }
};

export {
  getHomepageData,
  findBySlug
};