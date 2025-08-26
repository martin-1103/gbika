// [page.controller.js]: Page-related endpoints controller
const { getCachedHomepageData } = require('../services/homepage.service.js');
const { findOneBySlug } = require('../services/page.service.js');

// Get homepage aggregated data
const getHomepageData = async (req, res) => {
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
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Find page by slug
const findBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    
    if (!slug) {
      return res.status(400).json({
        success: false,
        message: 'Page slug is required'
      });
    }
    
    const page = await findOneBySlug(slug);
    
    if (!page) {
      return res.status(404).json({
        success: false,
        message: 'Page not found'
      });
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
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

module.exports = {
  getHomepageData,
  findBySlug
};