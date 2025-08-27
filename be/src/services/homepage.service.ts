// HomepageService: Homepage data orchestrator service
import { findLatest } from './article.service';
import { findTodaySchedule } from './program.service';
import { createClient } from 'redis';

interface HomepageData {
  latest_articles: any[];
  today_schedule: any[];
  timestamp: string;
}

// Initialize Redis client
const redis = createClient({
  socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379')
  }
});

redis.on('error', (err) => {
  console.error('Redis connection error:', err);
});

// Get aggregated homepage data
const getHomepageData = async (): Promise<HomepageData> => {
  try {
    // Use Promise.all for parallel data fetching
    const [latestArticles, todaySchedule] = await Promise.all([
      findLatest(3), // Get 3 latest articles
      findTodaySchedule() // Get today's schedule
    ]);

    // Aggregate the data
    const homepageData: HomepageData = {
      latest_articles: latestArticles,
      today_schedule: todaySchedule,
      timestamp: new Date().toISOString()
    };

    return homepageData;
  } catch (error) {
    console.error('Error in getHomepageData:', error);
    throw error;
  }
};

// Get cached homepage data with fallback
const getCachedHomepageData = async (): Promise<HomepageData> => {
  const cacheKey = 'homepage:data';
  const cacheTTL = 300; // 5 minutes

  try {
    // Try to get from cache first
    const cachedData = await redis.get(cacheKey);
    
    if (cachedData) {
      console.log('Homepage data served from cache');
      return JSON.parse(cachedData) as HomepageData;
    }

    // If not in cache, fetch fresh data
    console.log('Fetching fresh homepage data');
    const freshData = await getHomepageData();
    
    // Cache the fresh data
    await redis.setEx(cacheKey, cacheTTL, JSON.stringify(freshData));
    
    return freshData;
  } catch (error) {
    console.error('Error in getCachedHomepageData:', error);
    
    // Fallback: try to get data without cache
    try {
      return await getHomepageData();
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError);
      throw fallbackError;
    }
  }
};

// Invalidate homepage cache
const invalidateHomepageCache = async (): Promise<void> => {
  try {
    await redis.del('homepage:data');
    console.log('Homepage cache invalidated');
  } catch (error) {
    console.error('Error invalidating homepage cache:', error);
  }
};

export {
  getHomepageData,
  getCachedHomepageData,
  invalidateHomepageCache
};